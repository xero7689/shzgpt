import { apiSlice } from "./apiSlice";
import { RootState } from "../../app/store";

import webSocketManager from "../../lib/socketHelpers";

import {
  ChatRequest,
  ChatResponse,
  ChatRole,
  ChatStatus,
} from "../../types/chatTypes";

import { ChatContext } from "../../types/chatTypes";

interface SendMessageArgs {
  chatMessageContent: string;
  chatroomId: number;
}

let envBaseUrl = process.env.REACT_APP_DJANGO_STORAGE_API_ENDPOINT;

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<ChatContext, void>({
      query: () => `${envBaseUrl}/chat/chat-socket-init/`,
      async onCacheEntryAdded(
        arg,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const webSocketItem = await webSocketManager.getAndReConnect(
          `/ws/async-chat/`
        );
        const ws = webSocketItem.socket;

        try {
          await cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const response: ChatResponse = JSON.parse(event.data);

            let role: string;

            switch (response.context.role) {
              case ChatRole.SYSTEM:
                role = "system";
                break;
              case ChatRole.USER:
                role = "user";
                break;
              case ChatRole.ASSISTANT:
                role = "assistant";
                break;
            }

            if (response.status === ChatStatus.SUCCESS) {
              updateCachedData((draft) => {
                if (response.context) {
                  const timestamp = new Date(response.timestamp).getTime();
                  const newDraft = {
                    chatroomId: response.context.chatroom_id,
                    content: response.context.content,
                    role: role,
                    timestamp: timestamp,
                  };
                  Object.assign(draft, newDraft);
                }
              });
            }
          };

          ws.addEventListener("message", listener);
          webSocketItem.onMessageEventListener = true;
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
      queryFn: async (args: SendMessageArgs) => {
        /*
         * Wait for connection Open here since await getConnection statement
         * in onQueryStarted doesnt really block the process there.
         */
        webSocketManager.hasConnection("/ws/async-chat/");

        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (webSocketManager.hasConnection("/ws/async-chat/")) {
              clearInterval(interval);
              resolve("Has Connection");
            } else {
            }
          }, 2000);
        });

        const { chatMessageContent, chatroomId } = args;
        const ts = new Date();
        const payload: ChatRequest = {
          context: {
            chatroom_id: chatroomId,
            role: ChatRole.USER,
            content: chatMessageContent,
          },
          timestamp: ts.getTime(),
        };
        return new Promise((resolve, rejects) => {
          //const socket = webSocketManager.getConnection(`/ws/async-chat/`);
          webSocketManager.safeSend("/ws/async-chat/", payload);
          return resolve({
            data: {
              chatroomId: chatroomId,
              role: ChatRole.USER,
              content: chatMessageContent,
              timestamp: ts.getTime(),
            },
          });
        });
      },
      async onQueryStarted({}, { dispatch }) {
        // Await Websocket manager wont stop onQueryStarted here
        // The code will wait for the connection and also do queryFn at same time.
        // which means the event listener will append later?!
        const socketItem = await webSocketManager.getAndReConnect(
          "/ws/async-chat/"
        );

        if (!socketItem.onMessageEventListener) {
          const listener = (event: MessageEvent) => {
            const response = JSON.parse(event.data) as ChatResponse;
            let role: string;

            switch (response.context!.role) {
              case ChatRole.SYSTEM:
                role = "system";
                break;
              case ChatRole.USER:
                role = "user";
                break;
              case ChatRole.ASSISTANT:
                role = "assistant";
                break;
            }

            if (response.status === ChatStatus.SUCCESS) {
              dispatch(
                extendedApi.util.updateQueryData(
                  "getChatMessages",
                  undefined,
                  (draft) => {
                    if (response.context) {
                      const timestamp = response.timestamp;
                      const newDraft = {
                        chatroomId: response.context.chatroom_id,
                        content: response.context.content,
                        role: role,
                        timestamp: timestamp,
                      };
                      Object.assign(draft, newDraft);
                    }
                  }
                )
              );
            } else {
              console.log(
                "[onMessageEventListener] GPT Server Response Failed"
              );
            }
          };
          socketItem.socket.addEventListener("message", listener);
          socketItem.onMessageEventListener = true;
        }
      },
    }),
  }),
});

export const { useGetChatMessagesQuery, useSendMessageMutation } = extendedApi;
