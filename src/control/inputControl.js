import { useState, useRef } from 'react';
import { Configuration } from "openai";

import { formatUserMessage, formatChatHistory, formatResponseMessage } from '../formatter/MessageFormatter';
import fetchMessage from "../fetchers/gpt";
import { postChat } from '../fetchers/storage';

const configuration = new Configuration({
    apiKey: "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",
});
delete configuration.baseOptions.headers['User-Agent'];



export default function useInputControl(setNeedScroll, chatHistory, setChatHistory, currentChatRoom) {
    const messageRef = useRef();
    const [requestMessage, setRequestMessage] = useState("");
    const [queryError, setQueryError] = useState(null);
    const [queryInProgress, setQueryInProgress] = useState(false);


    const handleInputChange = (event) => {
        setRequestMessage(event.target.value);
    }

    async function handleSendMessage() {
        if (queryInProgress) {
            return;
        }
        const userMessage = formatUserMessage(requestMessage)
        const queryMessages = [...chatHistory, userMessage];
        setChatHistory(prevHistory => [...prevHistory, userMessage]);
        messageRef.current.value = "";

        await postChat(currentChatRoom, userMessage.role, userMessage.content);


        const last_role = queryMessages[queryMessages.length - 1].role;
        try {
            if (last_role === 'user') {
                setQueryInProgress(true);
                const history = formatChatHistory(queryMessages)
                const response = await fetchMessage(history.length > 20 ? history.slice(-10) : history);
                const formatedResponse = formatResponseMessage(response);
                setChatHistory(prevHistory => [...prevHistory, formatedResponse]); //
                await postChat(currentChatRoom, formatedResponse.role, formatedResponse.content);
            }
        } catch (err) {
            setQueryError(err);
        }
        setQueryInProgress(false);
        setNeedScroll(pre => !pre);
    }

    return { handleInputChange, handleSendMessage, requestMessage, messageRef, queryError, queryInProgress };
}