
import { Configuration, OpenAIApi } from "openai";

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';

import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';


function formatUserMessage(userMessage) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "user",
    "content": userMessage
  }
}

function formatResponseMessage(response) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "assistant",
    "content": response.data.choices[0].message.content,
  }
}

function formatChatHistory(history) {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}

function App() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);
  const systemMessage = "You're a helpful assistance.";

  // Settings of Chat Interface
  const appBarRef = useRef(null);
  const chatInterfaceRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [chatInterfaceHeight, setChatInterfaceHeight] = useState(0);

  const messageRef = useRef();
  const [requestMessage, setRequestMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      timestamp: Date.now(),
      "role": "system",
      "content": systemMessage
    },
  ]);


  function handleSendMessageButton() {
    const userMessage = formatUserMessage(requestMessage)
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    messageRef.current.value = "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle form submission here
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessageButton()
    };
  }

  useEffect(() => {
    async function chat() {
      const last_role = chatHistory[chatHistory.length - 1].role;
      if (last_role === 'user') {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: formatChatHistory(chatHistory),
        });
        setChatHistory(prevHistory => [...prevHistory, formatResponseMessage(response)]); //
        console.log(formatResponseMessage(response));
      }
    }
    chat();
  }, [chatHistory]);

  useEffect(() => {
    if (chatInterfaceRef.current && appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
      const chatInterfaceHeight = window.innerHeight - appBarRef.current.offsetHeight;
      setChatInterfaceHeight(chatInterfaceHeight);
    }
  }, [innerHeight]);

  useEffect(() => {
    const handleResize = () => setInnerHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });


  return (
    <div className="App" style={{ height: "100vh", overflow: 'auto' }}>
      <Box display="flex" flexDirection="column" height="100%">
        <GPTAppBar ref={appBarRef}></GPTAppBar>
        <Box display="flex" sx={{ backgroundColor: '#1f2129' }}>
          {/* <GPTSidePanel></GPTSidePanel> */}
          <Box ref={chatInterfaceRef} flexGrow={1} display="flex" flexDirection="column" sx={{ height: chatInterfaceHeight, marginTop: "64px" }}>
            <Box className="ChatContent" flexGrow={1} display="flex" flexDirection="column" gap={4}
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
            </Box>
            <Box
              className="InputGroup"
              component="form"
              autoComplete="off"
              display="flex"
              onSubmit={handleSubmit}
              p={4}
              gap={2}
            >
              <TextField
                inputRef={messageRef}
                id="outlined-basic"
                onChange={(e) => setRequestMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                placeholder="Send a message..."
                sx={{
                  width: "100%",
                  backgroundColor: "#282930",
                  input: {
                    color: "#bdbec2",
                  },
                }}
              />
              <Button variant="contained" endIcon={<SendIcon />}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#5b61ed",
                  color: "#e9e9fd"
                }}

                onClick={handleSendMessageButton}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
