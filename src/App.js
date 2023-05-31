import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { Box, createTheme } from "@mui/material";

import { useAppEffect } from "./effects/appEffect";

import GPTAppBar from "./components/gptAppBar";
import GPTSidePanel from "./components/gptSidePanel";
import InputForm from "./components/InputForm";
import { ChatSession } from "./features/chatSession";
import { ChatSessionControlBar } from "./features/chatSessionControlBar";
import { PromptsList } from "./features/promptsList";
import { AddPromptForm } from "./features/AddPromptForm";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { getDesignTokens } from "./theme";
import {
  fetchChatRoom,
  selectCurrentChatSession,
  selectCurrentChatRoomInfo,
} from "./features/chatRoomSlice";
import { useSelector } from "react-redux";

function App() {
  const [toggleSidePanel, setToggleSidePanel] = useState(true);
  const [togglePrompts, setTogglePrompts] = useState(false);
  const [colorMode, setColorMode] = useState("light");

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(colorMode)),
    [colorMode]
  );

  const dispatch = useDispatch();
  const chatSession = useSelector(selectCurrentChatSession);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);

  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef } = useAppEffect();

  useEffect(() => {
    dispatch(fetchChatRoom());
  }, [dispatch]);

  useEffect(() => {}, [chatSession]);

  useEffect(() => {}, [currentChatRoomInfo]);

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" maxHeight="100vh" maxWidth="100vw">
        <GPTSidePanel
          toggleSidePanel={toggleSidePanel}
          setToggleSidePanel={setToggleSidePanel}
        />
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
        <Box
          display="flex"
          sx={{
            backgroundColor: "primary.main",
            border: "1px solid",
            borderColor: "primary.border",
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              sx={{ padding: "0px", height: "100%", borderRadius: "0px" }}
              onClick={() => setTogglePrompts((pre) => !pre)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box
            minWidth="250px"
            display={togglePrompts ? "flex" : "none"}
            flexDirection="column"
            px={1}
            py={2}
            sx={{ border: "1px solid", borderColor: "primary.border" }}
          >
            <PromptsList />
            <AddPromptForm />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
