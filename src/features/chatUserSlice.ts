import Cookies from "js-cookie";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { getUser, login, logout } from "../fetchers/storage";

import { UserInfo } from "../types/interfaces";

const initialState = {
  userInfo: {} as UserInfo,
  isLogin: Boolean(Cookies.get("c_user")),
  loginStatus: "pending",
  modalIsOpen: false,
};

export const loginStorageServer = createAsyncThunk<UserInfo, {username: string, password: string}>(
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

export const getUserInfo = createAsyncThunk(
  "chatUser/getUserInfo",
  async (_, { dispatch }) => {
    const response = await getUser();
    dispatch(setUserInfo(response));
    return response;
  }
);

export const chatUserSlice = createSlice({
  name: "chatUser",
  initialState,
  reducers: {
    setUserLogin(state, action) {
      state.userInfo = action.payload;
      state.isLogin = true;
    },
    setUserLogout(state) {
      state.userInfo = {
        id: null,
        name: "",
        created_at: ""
      };
      state.isLogin = false;
    },
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    setUserInfo(state, action) {
        state.userInfo = action.payload;
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
          state.userInfo = action.payload;
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
  setUserInfo,
  toggleChatUserModal,
} = chatUserSlice.actions;

export default chatUserSlice.reducer;

export const selectUserInfo = (state: RootState) => state.chatUser.userInfo;
export const selectUserIsLogin = (state: RootState) => state.chatUser.isLogin;
export const selectChatUserModalIsOpen = (state: RootState) => state.chatUser.modalIsOpen;
