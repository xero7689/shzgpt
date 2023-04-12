import { useState, useRef } from 'react';
import { Configuration } from "openai";

import { formatUserMessage, formatChatHistory, formatResponseMessage } from '../formatter/MessageFormatter';
import fetchMessage from "../fetchers/gpt";

const configuration = new Configuration({
    apiKey: "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",
});
delete configuration.baseOptions.headers['User-Agent'];

const systemMessage = "You're a helpful assistance.";

export default function useInputControl() {
    const messageRef = useRef();
    const [requestMessage, setRequestMessage] = useState("");
    const [queryError, setqueryError] = useState(null);
    const [queryInProgress, setQueryInProgress] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            timestamp: Date.now(),
            "role": "system",
            "content": systemMessage
        },
    ]);

    const handleInputChange = (event) => {
        setRequestMessage(event.target.value);
    }

    async function handleSendMessage() {
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
            setqueryError(err);
        }
        setQueryInProgress(false);
    }

    return {handleInputChange, handleSendMessage, chatHistory, requestMessage, messageRef, queryError, queryInProgress};
}