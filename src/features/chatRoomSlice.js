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
  async (args, { dispatch, getState }) => {
    const state = getState();
    const history = formatChatHistory(state.chatRooms.currentChatRoomSession);

    // Handle Too Long History
    const slice_history = history.slice(-5);
    slice_history.unshift(history[1]);

    // Prime Too Long History
    const fetchHistory = history.length > 10 ? slice_history : history;

    const response = await fetchMessage(fetchHistory);
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
    const response = await getChatRoom();
    dispatch(chatRoomsUpdated(response.results));

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
    return response;
  }
);

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    historyUpdated(state, action) {
      state.currentChatRoomSession = action.payload;
    },
    addSessionMessage(state, action) {
      state.currentChatRoomSession.push(action.payload);
    },
    chatRoomsUpdated(state, action) {
      state.chatRooms = action.payload;
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
    }
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

export const selectSessionHistoryPrev = (state) => state.chatRooms.sessionHistoryPrev;
export const selectSessionHistoryNext = (state) => state.chatRooms.sessionHistoryNext;