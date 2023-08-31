import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import fetchMessage from "../fetchers/gpt";
import {
  getChatHistory,
  getChatRoom,
  createChatRoom,
} from "../fetchers/storage";
import { convertDjangoChatHistory } from "../formatter/djangoResponseConvert";
import {
  formatChatHistory,
  formatResponseMessage,
} from "../formatter/MessageFormatter";

import { encode } from "gpt-tokenizer";

import { ChatCompletionRequestMessage } from "openai";

import {
  ChatRoomObject,
  ChatRoomState,
  ChatRooms,
  ShzGPTMessage,
} from "../types/interfaces";

import { isInitChatMessage } from "../lib/utils";

const initialState = {
  currentChatRoomId: 0,

  nextChatHistoryPagination: 0,
  sessionHistoryPrev: [],
  sessionHistoryNext: [],

  currentChatRoom: undefined,
  newChatRooms: {},

  maxCompleteTokenLength: 1024,
  status: {
    fetchGPTStatus: "pending",
    fetchGPTErrorMessage: "",
    fetchChatRoomStatus: "pending",
    fetchChatSessionStatus: "pending",
    addNewChatRoomStatus: "pending",
  },
} as ChatRoomState;

export const fetchGPTMessage = createAsyncThunk<
  ShzGPTMessage,
  { activeKey: string }
>("chatRoom/fetchGPTMessage", async ({ activeKey }, { getState }) => {
  const state = getState() as RootState;

  if (!state.chatRooms.currentChatRoomId) {
    state.chatRooms.status.fetchGPTStatus = "Error";
    state.chatRooms.status.fetchGPTErrorMessage = "Currnet Chatroom not exists";
    throw new Error("Current Chat Room doesn't Exist");
  }
  const history = formatChatHistory(
    state.chatRooms.newChatRooms[state.chatRooms.currentChatRoomId].sessions
  );

  const fetchHistory = history;

  let finalHistory: ChatCompletionRequestMessage[] = [];
  fetchHistory.reduceRight((accumulator, item) => {
    const token = encode(item.content);
    accumulator += token.length;
    if (accumulator < state.chatRooms.maxCompleteTokenLength) {
      finalHistory.push(item);
    }
    return accumulator;
  }, 0);

  const response = await fetchMessage(finalHistory.reverse(), activeKey);
  return formatResponseMessage(response.data, state.chatRooms.currentChatRoomId);
});

export const fetchChatSession = createAsyncThunk<
  ShzGPTMessage[] | undefined,
  { chatroomId: number }
>(
  "chatRoom/fetchChatSession",
  async ({ chatroomId }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;

    // If there is already have session then skip the api fetching
    // Remenber to write the chat completemanuly to state instead reading from the server
    if (state.chatRooms.newChatRooms[chatroomId].sessions === undefined) {
      const response = await getChatHistory(chatroomId);
      return convertDjangoChatHistory(response, chatroomId);
    } else {
      return undefined;
    }
  }
);

export const addNewChatRoom = createAsyncThunk(
  "chatRoom/addNewChatRoom",
  async (newChatRoomName: string) => {
    const response = await createChatRoom(newChatRoomName);
    return response;
  }
);

export const fetchChatRoom = createAsyncThunk(
  "chatRoom/fetchChatRoom",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;

    let response = await getChatRoom();
    let results = response.results as ChatRoomObject[];

    // Initialize current chatroom
    if (!state.chatRooms.currentChatRoomId) {
      //The `reduce` function expects the provided callback function to always return a valid `ChatRoomObject`, but in some cases, it may return `undefined`.
      //An initial value for the `reduce` function to ensure that it always returns a valid `ChatRoomObject` is necessary.
      const latest_used_chatroom = results.reduce((prev, current) => {
        if (prev.last_used_time && current.last_used_time) {
          return new Date(prev.last_used_time) >
            new Date(current.last_used_time)
            ? prev
            : current;
        }
        return prev;
      });
      if (latest_used_chatroom.id) {
        dispatch(currentChatRoomUpdated(latest_used_chatroom.id));
        dispatch(fetchChatSession({ chatroomId: latest_used_chatroom.id }));
      }
    }

    // Missing the first ChatRooms
    const newChatRooms = response.results.reduce(
      (acc: ChatRooms, obj: ChatRoomObject) => {
        acc[obj.id] = obj;
        return acc;
      },
      {}
    );
    dispatch(newChatRoomsUpdated(newChatRooms));

    // Continue Fetch Remaing ChatRooms
    const regex = /\/\?page=(.*)/; // regular expression to match "/?" and capture the query string
    if (response["next"]) {
      while (response["next"]) {
        let match = response["next"].match(regex);

        if (match) {
          const pageNum = match[1];
          response = await getChatRoom(pageNum);

          const newChatRooms = response.results.reduce(
            (acc: ChatRooms, obj: ChatRoomObject) => {
              acc[obj.id] = obj;
              return acc;
            },
            {}
          );
          dispatch(newChatRoomsUpdated(newChatRooms));
        }
      }
    }
    return response;
  }
);

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    initChatRoomState(state) {
      state.currentChatRoomId = 0;
      state.nextChatHistoryPagination = 0;
      state.sessionHistoryPrev = [];

      state.sessionHistoryNext = [];
      state.status = {
        fetchGPTStatus: "pending",
        fetchGPTErrorMessage: "",
        fetchChatRoomStatus: "pending",
        fetchChatSessionStatus: "pending",
        addNewChatRoomStatus: "pending",
      };
    },
    initChatRoomSession(state, action) {
      const { chatRoomId, initMessage } = action.payload;
      state.newChatRooms[chatRoomId].sessions = [initMessage];
    },
    addSessionMessage(state, action) {
      console.log("[addSessionMessage]");
      console.log(action.payload);
      const chatMessage = action.payload;

      if (isInitChatMessage(chatMessage)) {
        console.log("Found init message");
        return;
      }

      const { timestamp, role, content, chatroomId } = action.payload;
      const message = { timestamp, role, content, chatroomId };
      if (
        state.newChatRooms[chatroomId] &&
        state.newChatRooms[chatroomId].sessions
      ) {
        state.newChatRooms[chatroomId].sessions.push(message);
      }
    },
    newChatRoomUpdated(state, action) {
      const payload = action.payload;
      state.newChatRooms[payload.id] = payload;
    },
    newChatRoomsUpdated(state, action) {
      const payload = action.payload;
      for (let key in payload) {
        const chatRoomInfo = state.newChatRooms[payload[key].id];
        state.newChatRooms[payload[key].id] = {
          ...chatRoomInfo,
          ...payload[key],
        };
      }
    },
    currentChatRoomUpdated(state, action) {
      state.currentChatRoomId = action.payload as number;
    },
    sessionHistoryPrevPush(state, action) {
      state.sessionHistoryPrev.push(action.payload);
    },
    sessionHistoryPrevPop(state) {
      if (state.sessionHistoryPrev.length !== 0) {
        const prevSession = state.sessionHistoryPrev.pop();
        if (prevSession) {
          state.currentChatRoomId = prevSession;
        }
      }
    },
    sessionHistoryNextPush(state, action) {
      state.sessionHistoryNext.push(action.payload);
    },
    sessionHistoryNextPop(state) {
      if (state.sessionHistoryNext.length !== 0 && state.currentChatRoomId) {
        state.sessionHistoryPrev.push(state.currentChatRoomId);
        const nextSession = state.sessionHistoryNext.pop();
        if (nextSession) {
          state.currentChatRoomId = nextSession;
        }
      }
    },
    updateMaxCompleteTokenLength(state, action) {
      state.maxCompleteTokenLength = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // GPT Message Status
      .addCase(fetchGPTMessage.pending, (state) => {
        state.status.fetchGPTStatus = "loading";
      })
      .addCase(fetchGPTMessage.fulfilled, (state, action) => {
        state.status.fetchGPTStatus = "succeeded";
        if (state.currentChatRoomId) {
          state.newChatRooms[state.currentChatRoomId].sessions.push(
            action.payload
          );
        }
      })
      .addCase(fetchGPTMessage.rejected, (state, action) => {
        state.status.fetchGPTStatus = "failed";
        if (action.error.message) {
          state.status.fetchGPTErrorMessage = action.error.message;
        }
      })

      // Chat History Status
      .addCase(fetchChatSession.pending, (state) => {
        state.status.fetchChatSessionStatus = "loading";
      })
      .addCase(fetchChatSession.fulfilled, (state, action) => {
        state.status.fetchChatSessionStatus = "succeeded";
        if (action.payload) {
          if (state.currentChatRoomId) {
            state.newChatRooms[state.currentChatRoomId].sessions =
              action.payload;
          }
        }
      })
      .addCase(fetchChatSession.rejected, (state, action) => {
        state.status.fetchChatSessionStatus = "failed";
        if (action.error.message) {
          state.status.fetchGPTErrorMessage = action.error.message;
        }
      })

      // ChatRoom Status
      .addCase(fetchChatRoom.pending, (state) => {
        state.status.fetchChatRoomStatus = "loading";
      })
      .addCase(fetchChatRoom.fulfilled, (state) => {
        state.status.fetchChatRoomStatus = "succeeded";
      })
      .addCase(fetchChatRoom.rejected, (state, action) => {
        state.status.fetchChatRoomStatus = "failed";
        if (action.error.message) {
          state.status.fetchGPTErrorMessage = action.error.message;
        }
      })

      // Add New ChatRoom Status
      .addCase(addNewChatRoom.pending, (state) => {
        state.status.addNewChatRoomStatus = "loading";
      })
      .addCase(addNewChatRoom.fulfilled, (state, action) => {
        state.status.addNewChatRoomStatus = "succeeded";
        const payload = action.payload;
        state.newChatRooms[payload.id] = payload;
      })
      .addCase(addNewChatRoom.rejected, (state, action) => {
        state.status.addNewChatRoomStatus = "failed";
      });
  },
});

export const {
  initChatRoomState,
  newChatRoomUpdated,
  newChatRoomsUpdated,
  initChatRoomSession,
  addSessionMessage,
  currentChatRoomUpdated,
  sessionHistoryPrevPush,
  sessionHistoryPrevPop,
  sessionHistoryNextPush,
  sessionHistoryNextPop,
  updateMaxCompleteTokenLength,
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;

export const selectCurrentChatSession = (state: RootState) => {
  if (state.chatRooms.currentChatRoomId) {
    const currentChatRoom =
      state.chatRooms.newChatRooms[state.chatRooms.currentChatRoomId];
    if ("sessions" in currentChatRoom) {
      return currentChatRoom.sessions;
    }
    return [];
  } else {
    return undefined;
  }
};

export const selectChatRoomSessionsById = (
  state: RootState,
  id: number | undefined
) => {
  if (id && id in state.chatRooms.newChatRooms) {
    return state.chatRooms.newChatRooms[id].sessions;
  } else {
    return [];
  }
};

export const selectChatRoomById = (
  state: RootState,
  id: number | undefined
) => {
  if (id && id in state.chatRooms.newChatRooms) {
    return state.chatRooms.newChatRooms[id];
  } else {
    return undefined;
  }
};

export const selectLastRoleOfHistory = (state: RootState) => {
  if (state.chatRooms.currentChatRoomId) {
    const lastSession =
      state.chatRooms.newChatRooms[
        state.chatRooms.currentChatRoomId
      ].sessions.slice(-1);
    if (lastSession) {
      return lastSession[0].role;
    }
  }
};

export const selectAllChatRooms = (state: RootState) =>
  state.chatRooms.newChatRooms;

export const selectFetchGPTStatus = (state: RootState) =>
  state.chatRooms.status.fetchGPTStatus;

export const selectChatHistoryStatus = (state: RootState) =>
  state.chatRooms.status.fetchChatSessionStatus;

export const selectCurrentChatRoomId = (state: RootState) =>
  state.chatRooms.currentChatRoomId;

export const selectSessionHistoryPrev = (state: RootState) =>
  state.chatRooms.sessionHistoryPrev;
export const selectSessionHistoryNext = (state: RootState) =>
  state.chatRooms.sessionHistoryNext;

export const selectMaxCompleteTokenLength = (state: RootState) =>
  state.chatRooms.maxCompleteTokenLength;
