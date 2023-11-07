import { ShzGPTMessage } from "../types/interfaces";

export function isInitChatMessage(message: ShzGPTMessage) {
  return message.chatroomId === null;
}
