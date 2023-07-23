export interface UserInfo {
  id: number | null;
  name: string;
  created_at: string;
}

export interface FormattedUserMessage {
  timestamp: number,
  role: string,
  content: string
}

export interface GPT_Response {
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

export interface ChatHistoryEntry {
  timestamp: number;
  role: string;
  content: string;
}

export interface FormattedChatHistory {
  role: string;
  content: string;
}
