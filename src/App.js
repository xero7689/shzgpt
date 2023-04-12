
import { Box, Skeleton, CircularProgress } from '@mui/material';

import useInputControl from './control/inputControl';
import { useAppEffect } from './effects/appEffect';

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';
import InputForm from './components/InputForm';
import LoadingBox from './components/LoadingBox';

function App() {
  const {handleInputChange, handleSendMessage, chatHistory, requestMessage, messageRef, queryError, queryInProgress} = useInputControl();
  const { chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef} = useAppEffect(chatHistory);
  const inputFormProps = { handleInputChange, handleSendMessage, messageRef};

  return (
    <div className="App" style={{ height: "100vh", overflow: 'auto' }}>
      <Box display="flex" flexDirection="column" height="100%">
        <GPTAppBar ref={appBarRef}></GPTAppBar>
        <Box display="flex" sx={{ backgroundColor: '#1f2129' }}>
          {/* <GPTSidePanel></GPTSidePanel> */}
          <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ height: chatInterfaceHeight, marginTop: "64px" }}>
            <Box ref={chatContentRef} className="ChatContent" flexGrow={1} display="flex" flexDirection="column" gap={5}
              sx={{
                overflow: "auto"
              }}
              p={4}
            >
              {chatHistory.map(item => {
                return (
                  <MessageBox key={item.timestamp} timestamp={item.timestamp} role={item.role} content={item.content}>
                  </MessageBox>
                )
              })}
              <LoadingBox queryInProgress={queryInProgress} />
            </Box>
            <InputForm {...inputFormProps}/>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
