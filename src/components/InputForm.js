import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatUserMessage } from "../formatter/MessageFormatter";

import { addHistoryMessage, postNewMessage, fetchGPTMessage, selectCurrentChatRoomInfo } from "../features/chatRoomSlice"

import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "@emotion/react";
import SendIcon from "@mui/icons-material/Send";

export default function InputForm(props) {
  const theme = useTheme();

  const messageRef = useRef();
  const dispatch = useDispatch();
  const [requestMessage, setRequestMessage] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [queryError, setQueryError] = useState(null);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);

  const handleInputChange = (event) => {
    setRequestMessage(event.target.value);
  };

  async function handleSendMessage() {
    if (queryInProgress) {
      return;
    }
    const userMessage = formatUserMessage(requestMessage);

    dispatch(addHistoryMessage(userMessage));

    messageRef.current.value = "";

    // Post Use Input Chat to Server
    dispatch(
      postNewMessage({
        chatRoomId: currentChatRoomInfo.id,
        role: userMessage.role,
        newMessage: userMessage.content,
      })
    );

    // queryMessage should change to state.currentChatRoomHistory
    try {
      setQueryInProgress(true);
      await dispatch(fetchGPTMessage());
    } catch (err) {
      setQueryError(err);
    }
    setQueryInProgress(false);
    //setNeedScroll((pre) => !pre);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle form submission here
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Do line break here!
      } else {
        event.preventDefault();
        if (messageRef.current.value.trim() === "") {
          return;
        }
        handleSendMessage();
      }
    }
  };
  return (
    <Box
      className="InputGroup"
      component="form"
      autoComplete="off"
      display="flex"
      alignItems="center"
      onSubmit={handleSubmit}
      p={2}
      gap={2}
    >
      <TextField
        inputRef={messageRef}
        id="outlined-basic"
        variant="filled"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        label="Send a message..."
        multiline
        maxRows={4}
        InputLabelProps={{
          style: { color: theme.palette.primary.contrastText },
        }}
        sx={{
          width: "100%",
          textArea: {
            color: theme.palette.primary.contrastText,
          },
        }}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        sx={{
          fontWeight: "bold",
          backgroundColor: theme.palette.thirdary.main,
          color: theme.palette.thirdary.contrastText,
        }}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Box>
  );
}
