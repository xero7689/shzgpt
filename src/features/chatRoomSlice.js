import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

const initialState = {
  currentChatRoomInfo: {
    id: null,
    name: null,
  },
  currentChatRoomSession: [],
  nextChatHistoryPagination: 0,
  sessionHistoryPrev: [],
  sessionHistoryNext: [],
  chatRooms: [],
  status: {
    fetchGPTStatus: "idle",
    fetchChatRoomStatus: "idle",
    fetchChatSessionStatus: "idle",
  },
};

export const fetchGPTMessage = createAsyncThunk(
  "chatRoom/fetchGPTMessage",
  async ({ activeKey }, { dispatch, getState }) => {
    const state = getState();
    const history = formatChatHistory(state.chatRooms.currentChatRoomSession);

    // Handle Too Long History
    const slice_history = history.slice(-3);
    slice_history.unshift(history[1]);

    // Prime Too Long History
    const fetchHistory = history.length > 10 ? slice_history : history;

    const response = await fetchMessage(fetchHistory, activeKey);
    const formatedResponse = formatResponseMessage(response);
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
  async ({ chatRoomId, role, newMessage }, { dispatch, getState }) => {
    const response = await postChat(chatRoomId, role, newMessage);
    return response;
  }
);

export const fetchChatSession = createAsyncThunk(
  "chatRoom/fetchChatSession",
  async (roomId, { dispatch, getState }) => {
    const response = await getChatHistory(roomId);
    dispatch(historyUpdated(convertDjangoChatHistory(response)));
    return response;
  }
);

export const addNewChatRoom = createAsyncThunk(
  "chatRoom/addNewChatRoom",
  async (newChatRoomName) => {
    const response = await createChatRoom(newChatRoomName);
    return response;
  }
);

export const fetchChatRoom = createAsyncThunk(
  "chatRoom/fetchChatRoom",
  async (args, { dispatch, getState }) => {
    const state = getState();

    let response = await getChatRoom();

    // Initialize current chatroom
    if (!state.chatRooms.currentChatRoomInfo.id) {
      const latest_used_chatroom = response.results.reduce((prev, current) => {
        return new Date(prev.last_used_time) > new Date(current.last_used_time)
          ? prev
          : current;
      });
      dispatch(currentChatRoomUpdated(latest_used_chatroom));
      dispatch(fetchChatSession(latest_used_chatroom.id));
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
    initChatRoomState(state, action) {
      state.currentChatRoomInfo = {
        id: null,
        name: null,
      };
      state.currentChatRoomSession = [];
      state.nextChatHistoryPagination = 0;
      state.sessionHistoryPrev = [];

      state.sessionHistoryNext = [];
      state.chatRooms = [];
      state.status = {
        fetchGPTStatus: "idle",
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
        (chatRoom) => !chatRoomSet.has(chatRoom.id)
      );

      uniqueChatRooms.sort(
        (a, b) => new Date(b.last_used_time) - new Date(a.last_used_time)
      );

      state.chatRooms = [...state.chatRooms, ...uniqueChatRooms];
      state.chatRooms.sort(
        (a, b) => new Date(b.last_used_time) - new Date(a.last_used_time)
      );
    },
    currentChatRoomUpdated(state, action) {
      state.currentChatRoomInfo = action.payload;
    },
    sessionHistoryPrevPush(state, action) {
      state.sessionHistoryPrev.push(action.payload);
    },
    sessionHistoryPrevPop(state, action) {
      if (state.sessionHistoryPrev.length !== 0) {
        const prevSession = state.sessionHistoryPrev.pop();
        state.currentChatRoomInfo = prevSession;
      }
    },
    sessionHistoryNextPush(state, action) {
      state.sessionHistoryNext.push(action.payload);
    },
    sessionHistoryNextPop(state, action) {
      if (state.sessionHistoryNext.length !== 0) {
        state.sessionHistoryPrev.push(state.currentChatRoomInfo);
        const nextSession = state.sessionHistoryNext.pop();
        state.currentChatRoomInfo = nextSession;
      }
    },
  },
  extraReducers(builder) {
    builder
      // GPT Message Status
      .addCase(fetchGPTMessage.pending, (state, action) => {
        state.status.fetchGPTStatus = "loading";
      })
      .addCase(fetchGPTMessage.fulfilled, (state, action) => {
        state.status.fetchGPTStatus = "succeeded";
      })
      .addCase(fetchGPTMessage.rejected, (state, action) => {
        state.status.fetchGPTStatus = "failed";
        state.status.fetchGPTEerror = action.error.message;
      })
      // Chat History Status
      .addCase(fetchChatSession.pending, (state, action) => {
        state.status.fetchChatSessionStatus = "loading";
      })
      .addCase(fetchChatSession.fulfilled, (state, action) => {
        state.status.fetchChatSessionStatus = "succeeded";
      })
      .addCase(fetchChatSession.rejected, (state, action) => {
        state.status.fetchChatSessionStatus = "failed";
        state.error = action.error.message;
      })

      // ChatRoom Status
      .addCase(fetchChatRoom.pending, (state, action) => {
        state.status.fetchChatRoomStatus = "loading";
      })
      .addCase(fetchChatRoom.fulfilled, (state, action) => {
        state.status.fetchChatRoomStatus = "succeeded";
      })
      .addCase(fetchChatRoom.rejected, (state, action) => {
        state.status.fetchChatRoomStatus = "failed";
        state.error = action.error.message;
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
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;

export const selectCurrentChatSession = (state) =>
  state.chatRooms.currentChatRoomSession;
export const selectLastRoleOfHistory = (state) =>
  state.chatRooms.currentChatRoomSession.slice(-1).role;

export const selectAllChatRooms = (state) => state.chatRooms.chatRooms;

export const selectFetchGPTStatus = (state) =>
  state.chatRooms.status.fetchGPTStatus;

export const selectChatHistoryStatus = (state) =>
  state.chatRooms.status.fetchChatSessionStatus;

export const selectCurrentChatRoomInfo = (state) =>
  state.chatRooms.currentChatRoomInfo;

export const selectSessionHistoryPrev = (state) =>
  state.chatRooms.sessionHistoryPrev;
export const selectSessionHistoryNext = (state) =>
  state.chatRooms.sessionHistoryNext;
