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
  prompt_topic: number;
  name: string;
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
