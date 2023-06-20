import Cookies from "js-cookie";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../fetchers/storage";

const initialState = {
  userInfo: {},
  isLogin: Boolean(Cookies.get("c_user")),
  loginStatus: "pending",
  modalIsOpen: false,
};

export const loginStorageServer = createAsyncThunk(
  "chatUser/loginStorageServer",
  async ({ username, password }, { dispatch, getState }) => {
    const response = await login(username, password);

    if (response["status"] === "success") {
      dispatch(setUserLogin(response.data));
    }
  }
);

export const logoutStorageServer = createAsyncThunk(
  "chatUser/logoutStorageServer",
  async (args, { dispatch, getState }) => {
    // Verify current login status before logout
    const response = await logout();
    if (response["status"] === "success") {
        dispatch(setUserLogout());
    }
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
    setUserLogout(state, action) {
      state.userInfo = null;
      state.isLogin = false;
    },
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    toggleChatUserModal(state, action) {
        state.modalIsOpen = !state.modalIsOpen;
    }
  },
  extraReducers(builder) {},
});

export const { setUserLogin, setUserLogout, setLoginStatus, toggleChatUserModal } =
  chatUserSlice.actions;

export default chatUserSlice.reducer;

export const selectUser = (state) => state.chatUser.userInfo;
export const selectChatUserModalIsOpen = (state) => state.chatUser.modalIsOpen;
