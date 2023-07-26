import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import fetchMessage from "../fetchers/gpt";
import {
  getChatHistory,
  postChat,
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

import { ChatRoomObject, ChatRoomState } from "../types/interfaces";

const initialState = {
  currentChatRoomInfo: null,
  currentChatRoomSession: [],
  nextChatHistoryPagination: 0,
  sessionHistoryPrev: [],
  sessionHistoryNext: [],
  chatRooms: [],
  maxCompleteTokenLength: 1024,
  status: {
    fetchGPTStatus: "idle",
    fetchGPTErrorMessage: "",
    fetchChatRoomStatus: "idle",
    fetchChatSessionStatus: "idle",
  },
} as ChatRoomState;

import { PostNewMessageArgs } from "../types/interfaces";

export const fetchGPTMessage = createAsyncThunk<void, { activeKey: string }>(
  "chatRoom/fetchGPTMessage",
  async ({ activeKey }, { dispatch, getState }) => {
    const state = getState() as RootState;

    if (!state.chatRooms.currentChatRoomInfo) {
      state.chatRooms.status.fetchGPTStatus = "Error";
      state.chatRooms.status.fetchGPTErrorMessage =
        "Currnet Chatroom not exists";
      return;
    }
    const history = formatChatHistory(state.chatRooms.currentChatRoomSession);

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
    const formatedResponse = formatResponseMessage(response.data);
    dispatch(addSessionMessage(formatedResponse));

    const postChatArgs = {
      chatRoomId: state.chatRooms.currentChatRoomInfo.id,
      role: formatedResponse.role,
      newMessage: formatedResponse.content,
    };
    dispatch(postNewMessage(postChatArgs));
  }
);

export const postNewMessage = createAsyncThunk(
  "chatRoom/addNewMessage",
  async (args: PostNewMessageArgs) => {
    const response = await postChat(args);
    return response;
  }
);

export const fetchChatSession = createAsyncThunk(
  "chatRoom/fetchChatSession",
  async (roomId: number, { dispatch }) => {
    const response = await getChatHistory(roomId);
    dispatch(historyUpdated(convertDjangoChatHistory(response)));
    return response;
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
    if (!state.chatRooms.currentChatRoomInfo) {
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
        dispatch(currentChatRoomUpdated(latest_used_chatroom));
        dispatch(fetchChatSession(latest_used_chatroom.id));
      }
    }
    dispatch(chatRoomsUpdated(response.results));

    // Continue Fetch Remaing ChatRooms
    const regex = /\/\?page=(.*)/; // regular expression to match "/?" and capture the query string
    if (response["next"]) {
      while (response["next"]) {
        let match = response["next"].match(regex);

        if (match) {
          const pageNum = match[1];
          response = await getChatRoom(pageNum);
          dispatch(chatRoomsUpdated(response.results));
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
      state.currentChatRoomInfo = null;
      state.currentChatRoomSession = [];
      state.nextChatHistoryPagination = 0;
      state.sessionHistoryPrev = [];

      state.sessionHistoryNext = [];
      state.chatRooms = [];
      state.status = {
        fetchGPTStatus: "idle",
        fetchGPTErrorMessage: "",
        fetchChatRoomStatus: "idle",
        fetchChatSessionStatus: "idle",
      };
    },
    historyUpdated(state, action) {
      state.currentChatRoomSession = action.payload;
    },
    addSessionMessage(state, action) {
      state.currentChatRoomSession.push(action.payload);
    },
    chatRoomsUpdated(state, action) {
      const chatRoomSet = new Set(
        state.chatRooms.map((chatRoom) => chatRoom.id)
      );

      const uniqueChatRooms = action.payload.filter(
        (chatRoom: ChatRoomObject) => !chatRoomSet.has(chatRoom.id)
      );

      uniqueChatRooms.sort((a: ChatRoomObject, b: ChatRoomObject) => {
        if (a.last_used_time && b.last_used_time) {
          return new Date(b.last_used_time) > new Date(a.last_used_time);
        }
      });

      state.chatRooms = [...state.chatRooms, ...uniqueChatRooms];
      state.chatRooms.sort((a, b) => {
        if (a.last_used_time && b.last_used_time) {
          new Date(b.last_used_time).getTime() -
            new Date(a.last_used_time).getTime();
        }
        return 0; // Handle the case if last_used_time not exists
      });
    },
    currentChatRoomUpdated(state, action) {
      state.currentChatRoomInfo = action.payload;
    },
    sessionHistoryPrevPush(state, action) {
      state.sessionHistoryPrev.push(action.payload);
    },
    sessionHistoryPrevPop(state) {
      if (state.sessionHistoryPrev.length !== 0) {
        const prevSession = state.sessionHistoryPrev.pop();
        if (prevSession) {
          state.currentChatRoomInfo = prevSession;
        }
      }
    },
    sessionHistoryNextPush(state, action) {
      state.sessionHistoryNext.push(action.payload);
    },
    sessionHistoryNextPop(state) {
      if (state.sessionHistoryNext.length !== 0 && state.currentChatRoomInfo) {
        state.sessionHistoryPrev.push(state.currentChatRoomInfo);
        const nextSession = state.sessionHistoryNext.pop();
        if (nextSession) {
          state.currentChatRoomInfo = nextSession;
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
      .addCase(fetchGPTMessage.fulfilled, (state) => {
        state.status.fetchGPTStatus = "succeeded";
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
      .addCase(fetchChatSession.fulfilled, (state) => {
        state.status.fetchChatSessionStatus = "succeeded";
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
      });
  },
});

export const {
  historyUpdated,
  initChatRoomState,
  chatRoomsUpdated,
  addSessionMessage,
  currentChatRoomUpdated,
  sessionHistoryPrevPush,
  sessionHistoryPrevPop,
  sessionHistoryNextPush,
  sessionHistoryNextPop,
  updateMaxCompleteTokenLength,
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;

export const selectCurrentChatSession = (state: RootState) =>
  state.chatRooms.currentChatRoomSession;

export const selectLastRoleOfHistory = (state: RootState) => {
  const lastSession = state.chatRooms.currentChatRoomSession.slice(-1);
  if (lastSession) {
    return lastSession[0].role;
  }
};

export const selectAllChatRooms = (state: RootState) =>
  state.chatRooms.chatRooms;

export const selectFetchGPTStatus = (state: RootState) =>
  state.chatRooms.status.fetchGPTStatus;

export const selectChatHistoryStatus = (state: RootState) =>
  state.chatRooms.status.fetchChatSessionStatus;

export const selectCurrentChatRoomInfo = (state: RootState) =>
  state.chatRooms.currentChatRoomInfo;

export const selectSessionHistoryPrev = (state: RootState) =>
  state.chatRooms.sessionHistoryPrev;
export const selectSessionHistoryNext = (state: RootState) =>
  state.chatRooms.sessionHistoryNext;

export const selectMaxCompleteTokenLength = (state: RootState) =>
  state.chatRooms.maxCompleteTokenLength;
