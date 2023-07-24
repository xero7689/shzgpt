import { ChatCompletionRequestMessageRoleEnum } from "openai";

export interface UserInfo {
  id: number | null;
  name: string;
  created_at: string;
}

export interface CurrentChatRoomInfo {
  id: number | null;
  name: string | null;
}

export interface PostNewMessageArgs {
  chatRoomId: number | null;
  role: ChatCompletionRequestMessageRoleEnum;
  newMessage: string;
}

export interface ShzGPTMessage {
  timestamp: number;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
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

