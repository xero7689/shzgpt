import Cookies from "js-cookie";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { getUser, login, logout } from "../fetchers/storage";

import { ChatUserData } from "../types/interfaces";

const initialState = {
  ChatUserData: {} as ChatUserData,
  isLogin: Boolean(Cookies.get("c_user")),
  loginStatus: "pending",
  modalIsOpen: false,
};

export const loginStorageServer = createAsyncThunk<ChatUserData, {username: string, password: string}>(
  "chatUser/loginStorageServer",
  async ({ username, password }, { dispatch }) => {
    const response = await login(username, password);

    if (response["status"] === "success") {
      return response.data;
    }
  }
);

export const logoutStorageServer = createAsyncThunk<void>(
  "chatUser/logoutStorageServer",
  async (_, { dispatch }) => {
    // Verify current login status before logout
    const response = await logout();
    if (response["status"] === "success") {
      dispatch(setUserLogout());
    }
    return response;
  }
);

export const getChatUserData = createAsyncThunk(
  "chatUser/getChatUserData",
  async (_, { dispatch }) => {
    const response = await getUser();
    dispatch(setChatUserData(response));
    return response;
  }
);

export const chatUserSlice = createSlice({
  name: "chatUser",
  initialState,
  reducers: {
    setUserLogin(state, action) {
      state.ChatUserData = action.payload;
      state.isLogin = true;
    },
    setUserLogout(state) {
      state.ChatUserData = {
        id: null,
        name: "",
        created_at: ""
      };
      state.isLogin = false;
    },
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    setChatUserData(state, action) {
        state.ChatUserData = action.payload;
    },
    toggleChatUserModal(state) {
      state.modalIsOpen = !state.modalIsOpen;
    },
  },
  extraReducers(builder) {
      builder
      .addCase(loginStorageServer.pending, (state) => {
      })
      .addCase(loginStorageServer.fulfilled, (state, action) => {
          state.ChatUserData = action.payload;
          state.isLogin = true;
      })
      .addCase(loginStorageServer.rejected, (state) => {
      })
  }
});

export const {
  setUserLogin,
  setUserLogout,
  setLoginStatus,
  setChatUserData,
  toggleChatUserModal,
} = chatUserSlice.actions;

export default chatUserSlice.reducer;

export const selectChatUserData = (state: RootState) => state.chatUser.ChatUserData;
export const selectUserIsLogin = (state: RootState) => state.chatUser.isLogin;
export const selectChatUserModalIsOpen = (state: RootState) => state.chatUser.modalIsOpen;
