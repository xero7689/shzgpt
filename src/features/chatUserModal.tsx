import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch, Action } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

import {
  selectUserIsLogin,
  selectChatUserModalIsOpen,
  toggleChatUserModal,
  selectUserInfo,
} from "./chatUserSlice";

import { loginStorageServer, logoutStorageServer } from "./chatUserSlice";

export default function ChatUserModal() {
  const dispatch: ThunkDispatch<RootState, null, Action> = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const userIsLogin = useSelector(selectUserIsLogin);
  const modalIsOpen = useSelector(selectChatUserModalIsOpen);

  // State For User Name, Password
  const [inputUsername, setInputUsername] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const handleUsernameInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(event.target.value);
  };

  const handlePasswordInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value);
  };

  const handleLoginOnClick = () => {
    dispatch(
      loginStorageServer({
        username: inputUsername,
        password: inputPassword,
      })
    );
  };

  const handleLogoutOnClick = () => {
    dispatch(logoutStorageServer());
  };

  const handleModalClose = () => {
    dispatch(toggleChatUserModal());
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    // width: "25%",
    // height: "25%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper2",
    borderRadius: 2,
    boxShadow: 24,
    p: 6,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Modal open={modalIsOpen} onClose={handleModalClose}>
      <Box sx={modalStyle}>
        <Box>
          <img src="/logo192.png" alt="logo" />
        </Box>
        <Box
          sx={{
            display: userIsLogin ? "flex" : "none",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "primary.contrastText",
            }}
          >
            Hello, {userInfo.name}
          </Typography>
          <Button onClick={handleLogoutOnClick} variant="contained" color="warning">
            <Typography fontWeight="bold">Log Out!</Typography>
          </Button>
        </Box>
        <Box
          sx={{
            display: userIsLogin ? "none" : "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ color: "primary.contrastText" }}>
            <Typography variant="h6">Welcome to SHZ GPT!</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              onChange={handleUsernameInputOnChange}
              size="small"
              label="Username"
            ></TextField>
            <TextField
              onChange={handlePasswordInputOnChange}
              size="small"
              label="Password"
              type="password"
            ></TextField>
            <Button onClick={handleLoginOnClick} variant="contained" color="secondary">
              <Typography fontWeight="bold">Login!</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
