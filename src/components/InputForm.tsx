import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "@reduxjs/toolkit";

import { formatUserMessage } from "../formatter/MessageFormatter";

import {
  addSessionMessage,
  fetchGPTMessage,
  selectCurrentChatRoomId,
} from "../features/chatRoomSlice";

import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { selectActiveKey } from "../features/apiKeySlice";

import { AppDispatch } from "../app/store";

import { postChat } from "../fetchers/storage";

export default function InputForm() {
  const theme = useTheme();

  const messageRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch() as AppDispatch;
  const [requestMessage, setRequestMessage] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [_, setQueryError] = useState(null);
  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const activeKey = useSelector(selectActiveKey);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestMessage(event.target.value);
  };

  async function handleSendMessage() {
    if (queryInProgress || !currentChatRoomId || !messageRef.current) {
      return;
    }

    const userMessage = formatUserMessage(requestMessage);

    dispatch(addSessionMessage(userMessage));

    messageRef.current.value = "";

    const userInputMessage = {
        chatRoomId: currentChatRoomId,
        role: userMessage.role,
        newMessage: userMessage.content,
      }

    await postChat(userInputMessage);

    try {
      setQueryInProgress(true);
      if (activeKey) {
        const dispatchedAction: AnyAction = await dispatch(
          fetchGPTMessage({ activeKey })
        );
        const actionPayload = dispatchedAction.payload;
        const postChatArgs = {
          chatRoomId: currentChatRoomId,
          role: actionPayload.role,
          newMessage: actionPayload.content,
        };

        await postChat(postChatArgs);
      }
    } catch (err: any) {
      setQueryError(err);
    }
    setQueryInProgress(false);
  }

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Do line break here!
      } else {
        event.preventDefault();
        if (!messageRef.current || messageRef.current.value.trim() === "") {
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
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        }}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Box>
  );
}
