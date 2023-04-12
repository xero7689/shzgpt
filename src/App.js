import { useState } from 'react';
import { Box, Container } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';
import InputForm from './components/InputForm';
import LoadingBox from './components/LoadingBox';

function App() {
  const systemMessage = "You're a helpful assistance.";
  const [chatHistory, setChatHistory] = useState([
    {
      timestamp: Date.now(),
      "role": "system",
      "content": systemMessage
    },
  ]);

  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef, setNeedScroll } = useAppEffect();
  const { handleInputChange, handleSendMessage, requestMessage, messageRef, queryError, queryInProgress } = useInputControl(setNeedScroll, chatHistory, setChatHistory);
  const inputFormProps = { handleInputChange, handleSendMessage, setNeedScroll, messageRef };

  return (
    <div className="App" style={{ height: "100%" }}>
      <Box display="flex" height="100%" flexDirection="column" >
        <GPTAppBar ref={appBarRef}></GPTAppBar>
        <Box display="flex" height="100%" sx={{ backgroundColor: '#1f2129' }}>
          {/* <GPTSidePanel></GPTSidePanel> */}
          <Container>
            <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ height: chatInterfaceHeight, marginTop: "64px" }}>
              <Box ref={chatContentRef} className="ChatContent" flexGrow={1} display="flex" flexDirection="column" gap={5} pt={2}
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
    </div>
  );
}

export default App;
