import { useEffect, useState } from 'react';


import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';
import InputForm from './components/InputForm';
import LoadingBox from './components/LoadingBox';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


import { darkTheme } from './theme';

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

  useEffect(() => {
  }, [chatHistory])

  useEffect(() => {
  }, [currentChatRoom])


  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef, setNeedScroll } = useAppEffect();
  const { handleInputChange, handleSendMessage, requestMessage, messageRef, queryError, queryInProgress } = useInputControl(setNeedScroll, chatHistory, setChatHistory, currentChatRoom);
  const inputFormProps = { handleInputChange, handleSendMessage, setNeedScroll, messageRef };

  return (
    <div className="App" style={{ height: "100%" }}>
      <ThemeProvider theme={darkTheme}>
        <Box display="flex" height="100%" flexDirection="column" >
          <GPTAppBar ref={appBarRef} setToggleSidePanel={setToggleSidePanel}></GPTAppBar>
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
            <GPTSidePanel setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} toggleSidePanel={toggleSidePanel} />
            <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ backgroundColor: "background.default", height: chatInterfaceHeight, marginTop: "64px" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" backgroundColor="primary.main" px={2}>
                <Box display="flex">
                  <IconButton>
                    <ArrowBackIcon fontSize="small" sx={{color:"primary.contrastText"}}></ArrowBackIcon>
                  </IconButton>
                  <IconButton>
                    <ArrowForwardIcon fontSize="small" sx={{color:"primary.contrastText"}}></ArrowForwardIcon>
                  </IconButton>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold" pl={2} color="primary.contrastText">{currentChatRoom.name}</Typography>
                <IconButton>
                  <MoreVertIcon sx={{ color: "primary.contrastText" }} />
                </IconButton>
              </Box>
              <Box ref={chatContentRef} className="ChatContent" flexGrow={1} px={4} display="flex" flexDirection="column" gap={4} pt={4} py={3}
                sx={{
                  overflow: "auto",
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                }}
              >
                {chatHistory.map(item => {
                  return (
                    <MessageBox key={item.timestamp} timestamp={item.timestamp} role={item.role} content={item.content}>
                    </MessageBox>
                  )
                })}
                <LoadingBox queryInProgress={queryInProgress} />
              </Box>
              <InputForm {...inputFormProps} />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
