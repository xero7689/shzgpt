import { useEffect } from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatUserMessage } from "../formatter/MessageFormatter";

import {
  addSessionMessage,
  selectCurrentChatRoomId,
} from "../features/chatRoomSlice";

import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { AppDispatch } from "../app/store";

import { useGetChatMessagesQuery } from "../features/api/socketSlice";

import { useSendMessageMutation } from "../features/api/socketSlice";

import { selectUserIsLogin } from "../features/chatUserSlice";

export default function InputForm() {
  const theme = useTheme();

  const messageRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch() as AppDispatch;
  const [requestMessage, setRequestMessage] = useState("");
  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const userIsLogin = useSelector(selectUserIsLogin);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestMessage(event.target.value);
  };

  const [skip, setSkip] = useState(true);

  const {
    data: chatMessageData,
    isLoading: isGetChatloading,
    isError: isGetChatError,
    error,
  } = useGetChatMessagesQuery(undefined, { skip }) || {};

  useEffect(() => {
    setSkip(userIsLogin == false);
  }, [userIsLogin]);

  useEffect(() => {
    console.log(`[InputForm][chatMessage]: ${chatMessageData}`);
    if (chatMessageData) {
      dispatch(addSessionMessage(chatMessageData));
    }
  }, [dispatch, chatMessageData]);

  const [sendChat, { isLoading: isSendChatLoading }] = useSendMessageMutation();

  async function handleSubmit() {
    const userMessage = formatUserMessage(requestMessage, currentChatRoomId);

    // addSessionMessage use current room Id in the async thunk
    // You should use the sendChatResponse belowing to decided the chatroom Id
    dispatch(addSessionMessage(userMessage));

    // Testing for websocket sendMessage
    await sendChat({
      chatroomId: currentChatRoomId,
      chatMessageContent: userMessage.content,
    });
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
        handleSubmit();
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
        onClick={handleSubmit}
      >
        Send
      </Button>
    </Box>
  );
}
