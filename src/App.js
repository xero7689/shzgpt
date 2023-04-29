import React from 'react';
import { useEffect, useState } from 'react';


import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography, createTheme } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';
import InputForm from './components/InputForm';
import LoadingBox from './components/LoadingBox';
import { PromptsList } from './features/promptsList';
import { AddPromptForm } from './features/AddPromptForm';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Container from '@mui/material/Container';


import { getDesignTokens } from './theme';

function App() {
  const systemMessage = "You're a helpful assistance.";
  const [currentChatRoom, setCurrentChatRoom] = useState({});
  const [chatHistory, setChatHistory] = useState([
    {
      timestamp: Date.now(),
      "role": "system",
      "content": systemMessage
    },
  ]);
  const [toggleSidePanel, setToggleSidePanel] = useState(false);
  const [togglePrompts, setTogglePrompts] = useState(false);
  const [colorMode, setColorMode] = useState("light");

  const theme = React.useMemo(() => createTheme(getDesignTokens(colorMode)), [colorMode]);

  useEffect(() => {
  }, [chatHistory])

  useEffect(() => {
  }, [currentChatRoom])


  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef, setNeedScroll } = useAppEffect();
  const { handleInputChange, handleSendMessage, requestMessage, messageRef, queryError, queryInProgress } = useInputControl(setNeedScroll, chatHistory, setChatHistory, currentChatRoom);
  const inputFormProps = { handleInputChange, handleSendMessage, setNeedScroll, messageRef };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" maxHeight="100vh" maxWidth="100vw">
        <GPTSidePanel setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} toggleSidePanel={toggleSidePanel} setToggleSidePanel={setToggleSidePanel} />
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
              <Box display="flex" justifyContent="space-between" alignItems="center" backgroundColor="primary.main" px={2}>
                <Box display="flex">
                  <IconButton>
                    <ArrowBackIcon fontSize="small" sx={{ color: "primary.contrastText" }}></ArrowBackIcon>
                  </IconButton>
                  <IconButton>
                    <ArrowForwardIcon fontSize="small" sx={{ color: "primary.contrastText" }}></ArrowForwardIcon>
                  </IconButton>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold" pl={2} color="primary.contrastText">{currentChatRoom.name}</Typography>
                <IconButton>
                  <MoreVertIcon sx={{ color: "primary.contrastText" }} />
                </IconButton>
              </Box>
              <Box flexGrow={1} sx={{ overflow: "auto" }}>
                <Container maxWidth="md">
                  <Box ref={chatContentRef} className="ChatContent" px={4} display="flex" flexDirection="column" gap={4} pt={4} py={3}
                    sx={{
                      overflow: "auto",
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                    }}
                  >
                    {chatHistory.map(item => {
                      return (
                        <MessageBox key={item.timestamp} timestamp={item.timestamp} role={item.role} content={item.content} colorMode={colorMode}>
                        </MessageBox>
                      )
                    })}
                    <LoadingBox queryInProgress={queryInProgress} />
                  </Box>
                </Container>
              </Box>
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
