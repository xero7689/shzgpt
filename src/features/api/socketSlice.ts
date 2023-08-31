import { apiSlice } from "./apiSlice";
import { RootState } from "../../app/store";

import webSocketManager from "../../lib/socketHelpers";

import {
  ChatRequest,
  ChatResponse,
  ChatRoleType,
  StatusCode,
} from "../../common/pb/message";


import { Context } from "../../common/pb/message";

interface SendMessageArgs {
  chatMessageContent: string;
  chatroomId: number;
}

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<Context, void>({
      query: () => `/chat-socket-init/`,
      async onCacheEntryAdded(
        arg,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = webSocketManager.getConnection(`/ws/async-chat/`);

        try {
          await cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
              const result = reader.result as ArrayBuffer;
              if (result) {
                const uiArray = new Uint8Array(result);
                const response = ChatResponse.decode(uiArray);
                let role: string;

                switch (response.context!.role) {
                  case ChatRoleType.SYSTEM:
                    role = 'system';
                    break;
                  case ChatRoleType.USER:
                    role = 'user';
                    break;
                  case ChatRoleType.ASSISTANT:
                    role = 'assistant';
                    break;
                }

                if (response.statusCode === StatusCode.SUCCESS) {
                  updateCachedData((draft) => {
                    if (response.context) {
                      const timestamp = response.context!.timestamp!.getTime();
                      const newDraft = {
                        chatroomId: response.context.chatroomId,
                        content: response.context.content,
                        role: role,
                        timestamp: timestamp,
                      }
                      Object.assign(draft, newDraft);
                    }
                  });
                }
              }
            });
            reader.readAsArrayBuffer(event.data);
          };

          ws.addEventListener("message", listener);
        } catch {}
        await cacheEntryRemoved;
        ws.close();
      },
    }),
    sendMessage: builder.mutation({
      /*
       * Accept user input message and send to server over websocket.
       * The Promise object should return the request value originally to
       * indicate that the send action is success.
       */
      queryFn: (args: SendMessageArgs) => {
        const { chatMessageContent, chatroomId } = args;
        const socket = webSocketManager.getConnection(`/ws/async-chat/`);
        const ts = new Date();
        const payload = {
          context: {
            chatroomId: chatroomId,
            role: ChatRoleType.USER,
            content: chatMessageContent,
            timestamp: ts,
          },
        };
        return new Promise((resolve, rejects) => {
          const bytesRequest = ChatRequest.encode(payload).finish();
          socket.send(bytesRequest);
          return resolve({
            data: {
              chatroomId: chatroomId,
              role: ChatRoleType.USER,
              content: chatMessageContent,
              timestamp: ts.getTime(),
            },
          });
        });
      },
    }),
  }),
});

export const { useGetChatMessagesQuery, useSendMessageMutation } = extendedApi;
