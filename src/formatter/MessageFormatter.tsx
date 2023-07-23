import { FormattedUserMessage, GPT_Response, ChatHistoryEntry, FormattedChatHistory } from "../types/interfaces";

export function formatUserMessage(userMessage: string): FormattedUserMessage {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "user",
    "content": userMessage
  }
}



export function formatResponseMessage(response: GPT_Response) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "assistant",
    "content": response.data.choices[0].message.content,
  }
}



export function formatChatHistory(history: ChatHistoryEntry[]): FormattedChatHistory[] {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}
