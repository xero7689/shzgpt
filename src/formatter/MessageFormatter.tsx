import { ShzGPTMessage } from "../types/interfaces";
import { ChatCompletionRequestMessage } from "openai";

import { CreateChatCompletionResponse } from "openai";

export function formatUserMessage(userMessage: string): ShzGPTMessage {
  const timestamp = Date.now();
  return {
    timestamp: timestamp,
    role: "user",
    content: userMessage,
  };
}

export function formatResponseMessage(
  responseData: CreateChatCompletionResponse
) {
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
    role: "assistant",
    content: content,
  };
}

export function formatChatHistory(
  history: ShzGPTMessage[]
): ChatCompletionRequestMessage[] {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}
