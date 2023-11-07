import { ShzGPTMessage, ShzGPTChatHistoryResponseObject } from "../types/interfaces";

export function convertDjangoChatHistory(data: ShzGPTChatHistoryResponseObject[], chatroomId: number): ShzGPTMessage[] {
    if (data.length === 0) return [];

    return data.map(({ role, content, created_at }) => {
        const date = new Date(created_at);
        const timestamp = date.getTime();

        return {
            timestamp,
            role,
            content,
            chatroomId,
        };
    }).sort((a, b) => a.timestamp - b.timestamp);;
}
