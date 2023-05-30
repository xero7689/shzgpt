import { useState, useRef } from "react";
import { Configuration } from "openai";

import { formatUserMessage } from "../formatter/MessageFormatter";

import { useDispatch, useSelector } from "react-redux";
import {
  addHistoryMessage,
  postNewMessage,
  fetchGPTMessage,
  selectCurrentChatRoomInfo,
} from "../features/chatRoomSlice";

const configuration = new Configuration({
  apiKey: "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",
});
delete configuration.baseOptions.headers["User-Agent"];

export default function useInputControl() {
  const messageRef = useRef();
  const [requestMessage, setRequestMessage] = useState("");
  const [queryError, setQueryError] = useState(null);
  const [queryInProgress, setQueryInProgress] = useState(false);

  const dispatch = useDispatch();
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

  return {
    handleInputChange,
    handleSendMessage,
    requestMessage,
    messageRef,
    queryError,
    queryInProgress,
  };
}
