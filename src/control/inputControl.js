import { useState, useRef } from 'react';
import { Configuration } from "openai";

import { formatUserMessage, formatChatHistory, formatResponseMessage } from '../formatter/MessageFormatter';
import fetchMessage from "../fetchers/gpt";

const configuration = new Configuration({
    apiKey: "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",
});
delete configuration.baseOptions.headers['User-Agent'];



export default function useInputControl(setNeedScroll, chatHistory, setChatHistory) {
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

        const last_role = queryMessages[queryMessages.length - 1].role;
        try {
            if (last_role === 'user') {
                setQueryInProgress(true);
                const response = await fetchMessage(formatChatHistory(queryMessages));
                setChatHistory(prevHistory => [...prevHistory, formatResponseMessage(response)]); //
            }
        } catch (err) {
            setQueryError(err);
        }
        setQueryInProgress(false);
        setNeedScroll(pre=>!pre);
    }

    return {handleInputChange, handleSendMessage, requestMessage, messageRef, queryError, queryInProgress};
}