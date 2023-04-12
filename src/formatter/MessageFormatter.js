export function formatUserMessage(userMessage) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "user",
    "content": userMessage
  }
}

export function formatResponseMessage(response) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "assistant",
    "content": response.data.choices[0].message.content,
  }
}

export function formatChatHistory(history) {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}