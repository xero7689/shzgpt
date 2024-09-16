/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export enum ChatRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}
export enum ChatStatus {
  ERROR = -1,
  SUCCESS = 1,
}

export interface ChatContext {
  chatroom_id: number;
  role: ChatRole;
  content: string;
}
export interface ChatRequest {
  context: ChatContext;
  timestamp: number;
}
export interface ChatResponse {
  status: ChatStatus;
  context: ChatContext;
  status_detail: string;
  timestamp: number;
}
