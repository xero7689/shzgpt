import React from 'react';
import { useEffect, useState } from 'react';


import { ThemeProvider } from '@mui/material/styles';
import { Box, createTheme } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import InputForm from './components/InputForm';
import { ChatHistoryList } from './features/chatHistoryList';
import { ChatHistoryControlBar } from './features/chatHistoryControlBar';
import { PromptsList } from './features/promptsList';
import { AddPromptForm } from './features/AddPromptForm';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getDesignTokens } from './theme';
import { selectAllChatHistory, selectCurrentChatRoomInfo } from './features/chatRoomSlice';
import { useSelector } from 'react-redux';

function App() {
  const [toggleSidePanel, setToggleSidePanel] = useState(false);
  const [togglePrompts, setTogglePrompts] = useState(false);
  const [colorMode, setColorMode] = useState("light");

  const theme = React.useMemo(() => createTheme(getDesignTokens(colorMode)), [colorMode]);

  const chatHistory = useSelector(selectAllChatHistory);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);

  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef } = useAppEffect();
  const { handleInputChange, handleSendMessage, messageRef, queryInProgress } = useInputControl();
  const inputFormProps = { handleInputChange, handleSendMessage, messageRef };

  useEffect(() => {
  }, [chatHistory])

  useEffect(() => {
  }, [currentChatRoomInfo])

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" maxHeight="100vh" maxWidth="100vw">
        <GPTSidePanel toggleSidePanel={toggleSidePanel} setToggleSidePanel={setToggleSidePanel} />
        <Box flexGrow={1} display="flex" height="100%" flexDirection="column">
          <GPTAppBar ref={appBarRef} setColorMode={setColorMode} setToggleSidePanel={setToggleSidePanel}></GPTAppBar>
          <Box display="flex" height="100%"
            flexDirection={{
              xs: "column",
              md: "row"
            }}
            position={{
              md: "static"
            }}
            sx={{
              backgroundColor: 'background.default',
            }}
          >
            <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ backgroundColor: "background.default", height: chatInterfaceHeight }}>
              <ChatHistoryControlBar></ChatHistoryControlBar>
              <ChatHistoryList colorMode={colorMode} queryInProgress={queryInProgress} chatContentRef={chatContentRef}></ChatHistoryList>
              <InputForm {...inputFormProps} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" sx={{ backgroundColor: "primary.main", border: "1px solid", borderColor: "primary.border" }}>
          <Box display="flex" alignItems="center">
            <IconButton sx={{ padding: "0px", height: "100%", borderRadius: "0px" }} onClick={() => setTogglePrompts(pre => !pre)}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box minWidth="250px" display={togglePrompts ? "flex": "none"} flexDirection="column" px={1} py={2} sx={{border: "1px solid", borderColor:"primary.border"}}>
            <PromptsList></PromptsList>
            <AddPromptForm></AddPromptForm>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
