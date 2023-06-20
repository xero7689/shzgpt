import { useDispatch, useSelector } from "react-redux";

import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

import {
  selectUserIsLogin,
  selectChatUserModalIsOpen,
  toggleChatUserModal,
  selectUserInfo,
} from "./chatUserSlice";

import { loginStorageServer, logoutStorageServer } from "./chatUserSlice";

export default function ChatUserModal(props) {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const userIsLogin = useSelector(selectUserIsLogin);
  const modalIsOpen = useSelector(selectChatUserModalIsOpen);

  // State For User Name, Password
  const [inputUsername, setInputUsername] = useState(null);
  const [inputPassword, setInputPassword] = useState(null);

  const handleUsernameInputOnChange = (event) => {
    setInputUsername(event.target.value);
  };

  const handlePasswordInputOnChange = (event) => {
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
    transform: "translate(-50%, -50%)",
    // width: "50%",
    bgcolor: "background.paper2",
    borderRadius: 2,
    boxShadow: 24,
    p: 6,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flexGrow: 1,
  };

  return (
    <Modal open={modalIsOpen} onClose={handleModalClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: userIsLogin ? "flex" : "none",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "primary.contrastText",
              fontWeight: "bold",
            }}
            fontSize="large"
          >
            Hello, {userInfo.name}
          </Typography>
          <Button onClick={handleLogoutOnClick} variant="contained">
            LogOut
          </Button>
        </Box>
        <Box
          sx={{
            display: userIsLogin ? "none" : "flex",
          }}
        >
          <Box
            sx={{
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              onChange={handleUsernameInputOnChange}
              size="small"
              label="username"
            ></TextField>
            <TextField
              onChange={handlePasswordInputOnChange}
              size="small"
              label="password"
            ></TextField>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleLoginOnClick} variant="contained">
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
