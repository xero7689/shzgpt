import Cookies from "js-cookie";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { getUser, login, logout } from "../fetchers/storage";

import { BaseResponse, ChatUserData } from "../types/interfaces";

const initialState = {
  ChatUserData: {} as ChatUserData,
  isLogin: Boolean(Cookies.get("c_user")),
  loginStatus: "pending",
  loginDetail: "",
  logoutStatus: "pending",
  logoutDetail: "",
  modalIsOpen: false,
};

export const loginStorageServer = createAsyncThunk<
  BaseResponse,
  { username: string; password: string }
>(
  "chatUser/loginStorageServer",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    const response = await login(username, password);

    if (response["status"] === "succeeded") {
      return response;
    } else {
      return rejectWithValue(response);
    }
  }
);

export const logoutStorageServer = createAsyncThunk<BaseResponse>(
  "chatUser/logoutStorageServer",
  async (_, { dispatch, rejectWithValue }) => {
    const response = await logout();

    if (response["status"] === "succeeded") {
      return response;
    } else {
      return rejectWithValue(response);
    }
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
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    setLoginDetail(state, action) {
      state.loginDetail = action.payload;
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
        state.loginStatus = "loading";
      })
      .addCase(loginStorageServer.fulfilled, (state, action) => {
        const payload = action.payload;
        const data = payload.data as ChatUserData;
        state.ChatUserData = data;
        state.loginStatus = payload.status;
        state.loginDetail = payload.detail;
        state.isLogin = true;
      })
      .addCase(loginStorageServer.rejected, (state, action) => {
        const payload = action.payload as BaseResponse;
        state.loginStatus = payload["status"];
        state.loginDetail = payload["detail"];
        state.isLogin = false;
      })
      .addCase(logoutStorageServer.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logoutStorageServer.fulfilled, (state, action) => {
        state.ChatUserData = {
          id: null,
          name: "",
          created_at: "",
        };
        state.loginStatus = "pending";
        state.loginDetail = "";
        state.isLogin = false;

        const payload = action.payload as BaseResponse;
        state.logoutStatus = payload["status"];
        state.logoutDetail = payload["detail"];
      })
      .addCase(logoutStorageServer.rejected, (state, action) => {
        const payload = action.payload as BaseResponse;
        state.logoutStatus = payload["status"];
        state.logoutDetail = payload["detail"];
      })
  },
});

export const {
  setLoginStatus,
  setLoginDetail,
  setChatUserData,
  toggleChatUserModal,
} = chatUserSlice.actions;

export default chatUserSlice.reducer;

export const selectChatUserData = (state: RootState) =>
  state.chatUser.ChatUserData;
export const selectUserIsLogin = (state: RootState) => state.chatUser.isLogin;
export const selectChatUserModalIsOpen = (state: RootState) =>
  state.chatUser.modalIsOpen;

export const selectLoginStatus = (state: RootState) =>
  state.chatUser.loginStatus;
export const selectLoginDetail = (state: RootState) =>
  state.chatUser.loginDetail;

export const selectLogoutStatus = (state: RootState) =>
  state.chatUser.logoutStatus;
export const selectLogoutDetail = (state: RootState) =>
  state.chatUser.logoutDetail;
