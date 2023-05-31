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
  currentChatRoomHistory: [],
  chatRooms: [],
  status: {
    fetchGPTStatus: "idle",
    fetchChatRoomStatus: "idle",
    fetchChatHistoryStatus: "idle",
  },
};

export const fetchGPTMessage = createAsyncThunk(
  "chatRoom/fetchGPTMessage",
  async (args, { dispatch, getState }) => {
    const state = getState();
    const history = formatChatHistory(state.chatHistory.currentChatRoomHistory);

    // Handle Too Long History
    const slice_history = history.slice(-5);
    slice_history.unshift(history[1]);

    // Prime Too Long History
    const fetchHistory = history.length > 10 ? slice_history : history;

    const response = await fetchMessage(fetchHistory);
    const formatedResponse = formatResponseMessage(response);
    dispatch(addHistoryMessage(formatedResponse));

    const postChatArgs = {
      chatRoomId: state.chatHistory.currentChatRoomInfo.id,
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

export const fetchChatHistory = createAsyncThunk(
  "chatRoom/fetchChatHistory",
  async (rommId, { dispatch, getState }) => {
    const response = await getChatHistory(rommId);
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
    if (!state.chatHistory.currentChatRoomInfo.id) {
      const latest_used_chatroom = response.results.reduce((prev, current) => {
        return new Date(prev.last_used_time) > new Date(current.last_used_time)
          ? prev
          : current;
      });
      dispatch(currentChatRoomUpdated(latest_used_chatroom));
      dispatch(fetchChatHistory(latest_used_chatroom.id));
    }
    return response;
  }
);

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    historyUpdated(state, action) {
      state.currentChatRoomHistory = action.payload;
    },
    addHistoryMessage(state, action) {
      state.currentChatRoomHistory.push(action.payload);
    },
    chatRoomsUpdated(state, action) {
      state.chatRooms = action.payload;
    },
    currentChatRoomUpdated(state, action) {
      state.currentChatRoomInfo = action.payload;
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
      .addCase(fetchChatHistory.pending, (state, action) => {
        state.status.fetchChatHistoryStatus = "loading";
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.status.fetchChatHistoryStatus = "succeeded";
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.status.fetchChatHistoryStatus = "failed";
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
  addHistoryMessage,
  currentChatRoomUpdated,
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;

export const selectAllChatHistory = (state) =>
  state.chatHistory.currentChatRoomHistory;
export const selectLastRoleOfHistory = (state) =>
  state.chatHistory.currentChatRoomHistory.slice(-1).role;

export const selectAllChatRooms = (state) => state.chatHistory.chatRooms;

export const selectFetchGPTStatus = (state) =>
  state.chatHistory.status.fetchGPTStatus;

export const selectChatHistoryStatus = (state) =>
  state.chatHistory.status.fetchChatHistoryStatus;

export const selectCurrentChatRoomInfo = (state) =>
  state.chatHistory.currentChatRoomInfo;
