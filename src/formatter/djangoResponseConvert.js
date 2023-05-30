export function convertDjangoChatHistory(data) {
    if (data.length === 0) return data;

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