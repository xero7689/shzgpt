import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  createTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  SwipeableDrawer,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { useAppEffect } from "./effects/appEffect";

import GPTAppBar from "./components/gptAppBar";
import ChatRoomsManage from "./components/chatRoomsManage";
import InputForm from "./components/InputForm";
import FixedPromptsList from "./features/FixedPromptList";
import { ChatSession } from "./features/chatSession";
import { ChatSessionControlBar } from "./features/chatSessionControlBar";

import { getDesignTokens } from "./theme";
import {
  fetchChatRoom,
  selectCurrentChatSession,
  selectCurrentChatRoomId,
  initChatRoomState,
} from "./features/chatRoomSlice";
import { useSelector } from "react-redux";
import { PromptManage } from "./features/promptManage";

import SettingsModal from "./features/settingsModal";
import ChatUserModal from "./features/chatUserModal";

import {
  getChatUserData,
  selectChatUserData,
  selectUserIsLogin,
  selectChatUserModalIsOpen,
  toggleChatUserModal,
} from "./features/chatUserSlice";
import { fetchAPIKey } from "./features/apiKeySlice";
import { initPromptState } from "./features/promptsSlice";

import { ThunkDispatch, Action } from "@reduxjs/toolkit";
import { RootState } from "./app/store";

import { PaletteMode } from "@mui/material";

import webSocketManager from "./lib/socketHelpers";

function App() {
  const [toggleSidePanel, setToggleSidePanel] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<PaletteMode>("light");

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(colorMode)),
    [colorMode]
  );

  const dispatch: ThunkDispatch<RootState, null, Action> = useDispatch();
  const chatSession = useSelector(selectCurrentChatSession);
  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const userIsLogin = useSelector(selectUserIsLogin);
  const userInfo = useSelector(selectChatUserData);
  const userModalIsOpen = useSelector(selectChatUserModalIsOpen);

  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef } =
    useAppEffect();

  useEffect(() => {
    if (userIsLogin) {
      if (Object.keys(userInfo).length === 0) {
        dispatch(getChatUserData());
        dispatch(fetchAPIKey());
      }
      dispatch(fetchChatRoom());
    } else {
      if (!userModalIsOpen) {
        // Only allowed close modal if user is login
        // Add Notification Here in the future's feature
        dispatch(toggleChatUserModal());
      }
    }
  }, [dispatch, userIsLogin, userInfo]);

  useEffect(() => {
    if (!userIsLogin) {
      dispatch(initChatRoomState());
      dispatch(initPromptState());
    }
  }, [dispatch, userIsLogin]);

  useEffect(() => {}, [chatSession]);

  useEffect(() => {}, [currentChatRoomId]);

  const [toggleItemId, setToggleItemid] = useState<number>(0);
  const naviDrawerItems = [
    { component: ChatRoomsManage, icon: <ChatIcon /> },
    { component: PromptManage, icon: <TextFieldsIcon /> },
  ];
  const handleNaviDrawerItemClick = (index: number) => {
    setToggleItemid(index);
  };

  return (
    <ThemeProvider theme={theme}>
      <SwipeableDrawer
        id="sidepanel-wrapper"
        anchor="left"
        open={toggleSidePanel}
        onClose={() => setToggleSidePanel(false)}
        onOpen={() => setToggleSidePanel(true)}
      >
        <Box display="flex">
          <Box
            id="navigation-drawer"
            display="flex"
            flexDirection="column"
            sx={{
              borderRight: "1px solid",
              borderColor: "primary.border",
            }}
          >
            <List>
              {naviDrawerItems.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={() => handleNaviDrawerItemClick(index)}
                >
                  <ListItemButton>
                    <ListItemIcon
                      sx={{ minWidth: 0, color: "primary.contrastText" }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box display="flex">
            {naviDrawerItems.map((item, index) => (
              <item.component
                key={index}
                toggle={toggleItemId === index ? true : false}
              ></item.component>
            ))}
          </Box>
        </Box>
      </SwipeableDrawer>
      <Box display="flex" maxHeight="100vh" maxWidth="100vw" overflow="hidden">
        <Box
          height="100%"
          width="100%"
          flexGrow={1}
          display="flex"
          flexDirection="column"
        >
          <GPTAppBar
            ref={appBarRef}
            setColorMode={setColorMode}
            setToggleSidePanel={setToggleSidePanel}
          ></GPTAppBar>
          <Box
            display="flex"
            height="100%"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            position={{
              md: "static",
            }}
            sx={{
              backgroundColor: "background.default",
            }}
          >
            <Box
              ref={chatInterfaceRef}
              flexGrow={1}
              display="flex"
              flexDirection="column"
              sx={{
                backgroundColor: "background.default",
                height: chatInterfaceHeight,
              }}
            >
              <ChatSessionControlBar></ChatSessionControlBar>
              <ChatSession
                colorMode={colorMode}
                chatContentRef={chatContentRef}
              ></ChatSession>
              <FixedPromptsList />
              <InputForm />
            </Box>
          </Box>
        </Box>
        <SettingsModal />
        <ChatUserModal />
      </Box>
    </ThemeProvider>
  );
}

export default App;
