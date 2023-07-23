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
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { useAppEffect } from "./effects/appEffect";

import GPTAppBar from "./components/gptAppBar";
import ChatRoomsManage from "./components/chatRoomsManage";
import InputForm from "./components/InputForm";
import { ChatSession } from "./features/chatSession";
import { ChatSessionControlBar } from "./features/chatSessionControlBar";

import { getDesignTokens } from "./theme";
import {
  fetchChatRoom,
  selectCurrentChatSession,
  selectCurrentChatRoomInfo,
  initChatRoomState,
} from "./features/chatRoomSlice";
import { useSelector } from "react-redux";
import { PromptManage } from "./features/promptManage";

import SettingsModal from "./features/settingsModal";
import ChatUserModal from "./features/chatUserModal";
import {
  getUserInfo,
  selectUserInfo,
  selectUserIsLogin,
} from "./features/chatUserSlice";
import { fetchAPIKey } from "./features/apiKeySlice";
import { initPromptState } from "./features/promptsSlice";

function App() {
  const [toggleSidePanel, setToggleSidePanel] = useState(true);
  const [colorMode, setColorMode] = useState("light");

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(colorMode)),
    [colorMode]
  );

  const dispatch = useDispatch();
  const chatSession = useSelector(selectCurrentChatSession);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);
  const userIsLogin = useSelector(selectUserIsLogin);
  const userInfo = useSelector(selectUserInfo);

  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef } =
    useAppEffect();

  useEffect(() => {
    if (userIsLogin) {
      if (Object.keys(userInfo).length === 0) {
        dispatch(getUserInfo());
        dispatch(fetchAPIKey());
      }
      dispatch(fetchChatRoom());
    }
  }, [dispatch, userIsLogin, userInfo]);

  useEffect(() => {
    if (!userIsLogin) {
      dispatch(initChatRoomState());
      dispatch(initPromptState());
    }
  }, [dispatch, userIsLogin]);

  useEffect(() => {}, [chatSession]);

  useEffect(() => {}, [currentChatRoomInfo]);

  const [toggleItemId, setToggleItemid] = useState(null);
  const naviDrawerItems = [
    { component: ChatRoomsManage, icon: <ChatIcon /> },
    { component: PromptManage, icon: <TextFieldsIcon /> },
  ];
  const handleNaviDrawerItemClick = (index) => {
    if (toggleItemId === index) {
      setToggleItemid(null);
    } else {
      setToggleItemid(index);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" maxHeight="100vh" maxWidth="100vw">
        <Box
          id="sidepanel-wrapper"
          display={toggleSidePanel ? "flex" : "none"}
          sx={{
            backgroundColor: "primary.main",
            borderRight: "1px solid",
            borderColor: "primary.border",
          }}
        >
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
        <Box flexGrow={1} display="flex" height="100%" flexDirection="column">
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