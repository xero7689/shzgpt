
import { Configuration, OpenAIApi } from "openai";

import GPTAppBar from './components/gptAppBar';
import GPTSidePanel from './components/gptSidePanel';
import MessageBox from './components/MessageBox';

import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';


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
  const chatContentRef = useRef(null);

  const [appBarHeight, setAppBarHeight] = useState(0);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [chatInterfaceHeight, setChatInterfaceHeight] = useState(0);

  const [queryInProgress, setQueryInProgress] = useState(false);

  // Settings of Chat History
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

  /** 
   * Prevent Default Form Action
   * For example: `Enter` click event will trigger the submit form 
   */
  function handleSubmit(event) {
    event.preventDefault();
    // handle form submission here
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessageButton()
    };
  }

  /**
   * GPT API Query Effect
   */
  useEffect(() => {
    async function chat() {
      const last_role = chatHistory[chatHistory.length - 1].role;
      if (last_role === 'user') {
        setQueryInProgress(prev => !prev);
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: formatChatHistory(chatHistory),
        });
        setQueryInProgress(prev => !prev);
        setChatHistory(prevHistory => [...prevHistory, formatResponseMessage(response)]); //
      }
    }
    chat();
  }, [chatHistory]);

  /**
   * Scroll to the bottom of view once history being change
   */
  useEffect(() => {
    chatContentRef.current.scrollTo({
      top: chatContentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [chatHistory]);


  /**
   * Effect that calculate the size of AppBar and Content
   */
  useEffect(() => {
    if (chatInterfaceRef.current && appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
      const chatInterfaceHeight = window.innerHeight - appBarRef.current.offsetHeight;
      setChatInterfaceHeight(chatInterfaceHeight);
    }
  }, [innerHeight]);

  /**
   * Effect that change the App height dynamically if resizing
   */
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
            </Box>
            <Box display={queryInProgress ? "flex" : "none"} pl={4}>
              <CircularProgress size={20}></CircularProgress>
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
                variant="filled"
                onChange={(e) => setRequestMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                label="Send a message..."
                multiline
                maxRows={1}
                InputLabelProps={{ style: { color: '#e9e9fd' } }}
                sx={{
                  width: "100%",
                  backgroundColor: "#282930",
                  textArea: {
                    color: "#bdbec2",
                  }
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
