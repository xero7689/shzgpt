/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "SHZgptServer";

export enum StatusCode {
  UNKNOW = 0,
  SUCCESS = 1,
  FAILED = 2,
  UNRECOGNIZED = -1,
}

export function statusCodeFromJSON(object: any): StatusCode {
  switch (object) {
    case 0:
    case "UNKNOW":
      return StatusCode.UNKNOW;
    case 1:
    case "SUCCESS":
      return StatusCode.SUCCESS;
    case 2:
    case "FAILED":
      return StatusCode.FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return StatusCode.UNRECOGNIZED;
  }
}

export function statusCodeToJSON(object: StatusCode): string {
  switch (object) {
    case StatusCode.UNKNOW:
      return "UNKNOW";
    case StatusCode.SUCCESS:
      return "SUCCESS";
    case StatusCode.FAILED:
      return "FAILED";
    case StatusCode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ChatRoleType {
  SYSTEM = 0,
  USER = 1,
  ASSISTANT = 2,
  UNRECOGNIZED = -1,
}

export function chatRoleTypeFromJSON(object: any): ChatRoleType {
  switch (object) {
    case 0:
    case "SYSTEM":
      return ChatRoleType.SYSTEM;
    case 1:
    case "USER":
      return ChatRoleType.USER;
    case 2:
    case "ASSISTANT":
      return ChatRoleType.ASSISTANT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChatRoleType.UNRECOGNIZED;
  }
}

export function chatRoleTypeToJSON(object: ChatRoleType): string {
  switch (object) {
    case ChatRoleType.SYSTEM:
      return "SYSTEM";
    case ChatRoleType.USER:
      return "USER";
    case ChatRoleType.ASSISTANT:
      return "ASSISTANT";
    case ChatRoleType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EventTarget {
  CHAT = 0,
  CHATROOM = 1,
  PROMPT = 2,
  UNRECOGNIZED = -1,
}

export function eventTargetFromJSON(object: any): EventTarget {
  switch (object) {
    case 0:
    case "CHAT":
      return EventTarget.CHAT;
    case 1:
    case "CHATROOM":
      return EventTarget.CHATROOM;
    case 2:
    case "PROMPT":
      return EventTarget.PROMPT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EventTarget.UNRECOGNIZED;
  }
}

export function eventTargetToJSON(object: EventTarget): string {
  switch (object) {
    case EventTarget.CHAT:
      return "CHAT";
    case EventTarget.CHATROOM:
      return "CHATROOM";
    case EventTarget.PROMPT:
      return "PROMPT";
    case EventTarget.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EventAction {
  SEND = 0,
  PULL = 1,
  UNRECOGNIZED = -1,
}

export function eventActionFromJSON(object: any): EventAction {
  switch (object) {
    case 0:
    case "SEND":
      return EventAction.SEND;
    case 1:
    case "PULL":
      return EventAction.PULL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EventAction.UNRECOGNIZED;
  }
}

export function eventActionToJSON(object: EventAction): string {
  switch (object) {
    case EventAction.SEND:
      return "SEND";
    case EventAction.PULL:
      return "PULL";
    case EventAction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Event {
  target: EventTarget;
  action: EventAction;
  timestamp: Date | undefined;
  payload: string;
}

export interface Context {
  chatroomId: number;
  role: ChatRoleType;
  content: string;
  timestamp: Date | undefined;
}

export interface ChatRequest {
  context: Context | undefined;
}

export interface ChatResponse {
  statusCode: StatusCode;
  context: Context | undefined;
  statusDetail: string;
}

function createBaseEvent(): Event {
  return { target: 0, action: 0, timestamp: undefined, payload: "" };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== 0) {
      writer.uint32(8).int32(message.target);
    }
    if (message.action !== 0) {
      writer.uint32(16).int32(message.action);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(26).fork()).ldelim();
    }
    if (message.payload !== "") {
      writer.uint32(34).string(message.payload);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.target = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.payload = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Event {
    return {
      target: isSet(object.target) ? eventTargetFromJSON(object.target) : 0,
      action: isSet(object.action) ? eventActionFromJSON(object.action) : 0,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      payload: isSet(object.payload) ? String(object.payload) : "",
    };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    if (message.target !== 0) {
      obj.target = eventTargetToJSON(message.target);
    }
    if (message.action !== 0) {
      obj.action = eventActionToJSON(message.action);
    }
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    if (message.payload !== "") {
      obj.payload = message.payload;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Event>, I>>(base?: I): Event {
    return Event.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event {
    const message = createBaseEvent();
    message.target = object.target ?? 0;
    message.action = object.action ?? 0;
    message.timestamp = object.timestamp ?? undefined;
    message.payload = object.payload ?? "";
    return message;
  },
};

function createBaseContext(): Context {
  return { chatroomId: 0, role: 0, content: "", timestamp: undefined };
}

export const Context = {
  encode(message: Context, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chatroomId !== 0) {
      writer.uint32(8).int32(message.chatroomId);
    }
    if (message.role !== 0) {
      writer.uint32(16).int32(message.role);
    }
    if (message.content !== "") {
      writer.uint32(26).string(message.content);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Context {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContext();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.chatroomId = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.role = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.content = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Context {
    return {
      chatroomId: isSet(object.chatroomId) ? Number(object.chatroomId) : 0,
      role: isSet(object.role) ? chatRoleTypeFromJSON(object.role) : 0,
      content: isSet(object.content) ? String(object.content) : "",
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
    };
  },

  toJSON(message: Context): unknown {
    const obj: any = {};
    if (message.chatroomId !== 0) {
      obj.chatroomId = Math.round(message.chatroomId);
    }
    if (message.role !== 0) {
      obj.role = chatRoleTypeToJSON(message.role);
    }
    if (message.content !== "") {
      obj.content = message.content;
    }
    if (message.timestamp !== undefined) {
      obj.timestamp = message.timestamp.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Context>, I>>(base?: I): Context {
    return Context.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Context>, I>>(object: I): Context {
    const message = createBaseContext();
    message.chatroomId = object.chatroomId ?? 0;
    message.role = object.role ?? 0;
    message.content = object.content ?? "";
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

function createBaseChatRequest(): ChatRequest {
  return { context: undefined };
}

export const ChatRequest = {
  encode(message: ChatRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.context !== undefined) {
      Context.encode(message.context, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.context = Context.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatRequest {
    return { context: isSet(object.context) ? Context.fromJSON(object.context) : undefined };
  },

  toJSON(message: ChatRequest): unknown {
    const obj: any = {};
    if (message.context !== undefined) {
      obj.context = Context.toJSON(message.context);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChatRequest>, I>>(base?: I): ChatRequest {
    return ChatRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChatRequest>, I>>(object: I): ChatRequest {
    const message = createBaseChatRequest();
    message.context = (object.context !== undefined && object.context !== null)
      ? Context.fromPartial(object.context)
      : undefined;
    return message;
  },
};

function createBaseChatResponse(): ChatResponse {
  return { statusCode: 0, context: undefined, statusDetail: "" };
}

export const ChatResponse = {
  encode(message: ChatResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statusCode !== 0) {
      writer.uint32(8).int32(message.statusCode);
    }
    if (message.context !== undefined) {
      Context.encode(message.context, writer.uint32(18).fork()).ldelim();
    }
    if (message.statusDetail !== "") {
      writer.uint32(26).string(message.statusDetail);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.statusCode = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.context = Context.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.statusDetail = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatResponse {
    return {
      statusCode: isSet(object.statusCode) ? statusCodeFromJSON(object.statusCode) : 0,
      context: isSet(object.context) ? Context.fromJSON(object.context) : undefined,
      statusDetail: isSet(object.statusDetail) ? String(object.statusDetail) : "",
    };
  },

  toJSON(message: ChatResponse): unknown {
    const obj: any = {};
    if (message.statusCode !== 0) {
      obj.statusCode = statusCodeToJSON(message.statusCode);
    }
    if (message.context !== undefined) {
      obj.context = Context.toJSON(message.context);
    }
    if (message.statusDetail !== "") {
      obj.statusDetail = message.statusDetail;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChatResponse>, I>>(base?: I): ChatResponse {
    return ChatResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChatResponse>, I>>(object: I): ChatResponse {
    const message = createBaseChatResponse();
    message.statusCode = object.statusCode ?? 0;
    message.context = (object.context !== undefined && object.context !== null)
      ? Context.fromPartial(object.context)
      : undefined;
    message.statusDetail = object.statusDetail ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
