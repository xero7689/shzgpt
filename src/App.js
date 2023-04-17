import { useEffect, useState, useRef } from 'react';


import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';
import InputForm from './components/InputForm';
import LoadingBox from './components/LoadingBox';

import myTheme from './theme';

function App() {
  const systemMessage = "You're a helpful assistance.";
  const [currentChatRoom, setCurrentChatRoom] = useState();
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
      <ThemeProvider theme={myTheme}>
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
              backgroundColor: '#1f2129',
            }}
          >
            <GPTSidePanel setChatHistory={setChatHistory} setCurrentChatRoom={setCurrentChatRoom} toggleSidePanel={toggleSidePanel} />
            <Container maxWidth="md">
              <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ height: chatInterfaceHeight, marginTop: "64px" }}>
                <Box ref={chatContentRef} className="ChatContent" flexGrow={1} display="flex" flexDirection="column" gap={4} pt={4} py={3}
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
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
