import { ShzGPTMessage } from "../types/interfaces";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";

export function formatUserMessage(userMessage: string, chatRoomId: number): ShzGPTMessage {
  const timestamp = Date.now();
  return {
    chatroomId: chatRoomId,
    timestamp: timestamp,
    role: "user",
    content: userMessage,
  };
}

export function formatShzGPTMessage(message: string, role: ChatCompletionRequestMessageRoleEnum, chatroomId: number): ShzGPTMessage {
  const timestamp = Date.now();
  return {
    timestamp: timestamp,
    role: role,
    content: message,
    chatroomId: chatroomId
  };
}


export function formatResponseMessage(
  responseData: CreateChatCompletionResponse, chatroomId: number
): ShzGPTMessage {
  const timestamp = Date.now();
  let content = "[System Message] Response choices message not exists";

  if (
    responseData.choices &&
    responseData.choices.length > 0 &&
    responseData.choices[0].message &&
    responseData.choices[0].message.content
  ) {
    content = responseData.choices[0].message.content;
  }

  return {
    timestamp: timestamp,
    role: ChatCompletionRequestMessageRoleEnum["Assistant"],
    content: content,
    chatroomId: chatroomId
  };
}

export function formatChatHistory(
  history: ShzGPTMessage[]
): ChatCompletionRequestMessage[] {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}
