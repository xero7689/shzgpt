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

let envBaseUrl = process.env.REACT_APP_DJANGO_STORAGE_API_ENDPOINT;

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<Context, void>({
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
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
              const result = reader.result as ArrayBuffer;
              if (result) {
                const uiArray = new Uint8Array(result);
                const response = ChatResponse.decode(uiArray);
                let role: string;

                switch (response.context!.role) {
                  case ChatRoleType.SYSTEM:
                    role = "system";
                    break;
                  case ChatRoleType.USER:
                    role = "user";
                    break;
                  case ChatRoleType.ASSISTANT:
                    role = "assistant";
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
                      };
                      Object.assign(draft, newDraft);
                    }
                  });
                }
              }
            });
            reader.readAsArrayBuffer(event.data);
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
          //const socket = webSocketManager.getConnection(`/ws/async-chat/`);
          webSocketManager.safeSend("/ws/async-chat/", bytesRequest);
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
      async onQueryStarted({}, { dispatch }) {
        // Await Websocket manager wont stop onQueryStarted here
        // The code will wait for the connection and also do queryFn at same time.
        // which means the event listener will append later?!
        const socketItem = await webSocketManager.getAndReConnect(
          "/ws/async-chat/"
        );

        if (!socketItem.onMessageEventListener) {
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
                    role = "system";
                    break;
                  case ChatRoleType.USER:
                    role = "user";
                    break;
                  case ChatRoleType.ASSISTANT:
                    role = "assistant";
                    break;
                }

                if (response.statusCode === StatusCode.SUCCESS) {
                  dispatch(
                    extendedApi.util.updateQueryData(
                      "getChatMessages",
                      undefined,
                      (draft) => {
                        if (response.context) {
                          const timestamp =
                            response.context!.timestamp!.getTime();
                          const newDraft = {
                            chatroomId: response.context.chatroomId,
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
              }
            });
            reader.readAsArrayBuffer(event.data);
          };
          socketItem.socket.addEventListener("message", listener);
          socketItem.onMessageEventListener = true;
        }
      },
    }),
  }),
});

export const { useGetChatMessagesQuery, useSendMessageMutation } = extendedApi;
