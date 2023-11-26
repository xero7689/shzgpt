import {
  CreateChatCompletionResponse,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

export interface BaseResponse {
  status: string;
  detail: string;
  data: object;
}

export interface ChatUserData {
  id: number | null;
  name: string;
  created_at: string;
}

export interface ChatRoomSession {
  [timestamp: number]: ShzGPTMessage;
}

export interface ChatRoomObject {
  id: number;
  name: string;
  created_at: string;
  last_used_time: string;
  sessions: ShzGPTMessage[];
}

// Calling chatroom status is a little wierd
// since this is the status corresponding to fetch() api
export interface ChatRoomStatus {
  fetchGPTStatus: string;
  fetchGPTErrorMessage: string;
  fetchChatRoomStatus: string;
  fetchChatSessionStatus: string;
  addChatRoomStatus: string;
}

export interface ChatRooms {
  [id: number]: ChatRoomObject;
}

export interface ChatRoomState {
  currentChatRoomId: number;
  nextChatHistoryPagination: number;
  sessionHistoryPrev: number[];
  sessionHistoryNext: number[];

  currentChatRoom: number | undefined;
  ChatRooms: ChatRooms;

  status: ChatRoomStatus;
  maxCompleteTokenLength: number;
}

export interface PostMessageArgs {
  chatRoomId: number | null;
  role: ChatCompletionRequestMessageRoleEnum;
  message: string;
}

export type ShzGPTChatHistoryResponseObject = {
  id: number;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  chatroom: number;
  tokens: number;
  created_at: string;
};

export interface ShzGPTMessage {
  timestamp: number;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  chatroomId: number;
}

export interface ShzGPTPrompt {
  id: number;
  name: string;
  prompt_topic: number;
  content: string;
}

export interface ShzGPTPromptTopic {
  id: number;
  name: string;
}

export interface ShzGPTPromptArgs {
  name: string;
  prompt_topic: string;
  content: string;
}

export declare const ShzGPTStatusEnum: {
  readonly Idle: "idle";
  readonly Succeeded: "succeeded";
  readonly Loading: "loading";
  readonly Failed: "failed";
};

export interface BaseState {
  status:
    | (typeof ShzGPTStatusEnum)["Idle"]
    | (typeof ShzGPTStatusEnum)["Succeeded"]
    | (typeof ShzGPTStatusEnum)["Loading"]
    | (typeof ShzGPTStatusEnum)["Failed"];
  error: string | undefined;
}

export interface PromptSliceState extends BaseState {
  prompts: ShzGPTPrompt[];
}

export interface PromptTopicState extends BaseState {
  promptTopic: ShzGPTPromptTopic[];
}

export interface APIKeyObject {
  id: number;
  key: string;
  desc: string;
  model: number;
  created_at: string;
}

export interface APIKeyState {
  keys: APIKeyObject[];
  activeKey: string;
}
