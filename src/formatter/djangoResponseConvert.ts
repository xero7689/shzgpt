import { ShzGPTMessage, ShzGPTChatHistoryResponseObject } from "../types/interfaces";

export function convertDjangoChatHistory(data: ShzGPTChatHistoryResponseObject[]): ShzGPTMessage[] {
    if (data.length === 0) return [];

    return data.map(({ role, content, created_at }) => {
        const date = new Date(created_at);
        const timestamp = date.getTime();

        return {
            timestamp,
            role,
            content,
        };
    }).sort((a, b) => a.timestamp - b.timestamp);;
}
