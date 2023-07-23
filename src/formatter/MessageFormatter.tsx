interface FormattedUserMessage {
  timestamp: number,
  role: string,
  content: string
}

export function formatUserMessage(userMessage: string): FormattedUserMessage {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "user",
    "content": userMessage
  }
}

interface GPT_Response {
  data: {
    choices: {
      message: {
        content: string;
      }
    }[]
  },
  status: number,
  statusText: string,
  request: XMLHttpRequest,
  config: object,
  headers: object
}

export function formatResponseMessage(response: GPT_Response) {
  const timestamp = Date.now();
  return {
    "timestamp": timestamp,
    "role": "assistant",
    "content": response.data.choices[0].message.content,
  }
}

interface ChatHistoryEntry {
  timestamp: number;
  role: string;
  content: string;
}

interface FormattedChatHistory {
  role: string;
  content: string;
}

export function formatChatHistory(history: ChatHistoryEntry[]): FormattedChatHistory[] {
  // Format chat history used to query API
  return history.map(({ role, content }) => ({ role, content }));
}
