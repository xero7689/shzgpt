import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import {
  ChatUserData,
  ShzGPTChatHistoryResponseObject,
  PostNewMessageArgs,
} from "../../types/interfaces";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/chat",
    prepareHeaders: (headers, { getState }) => {
      const csrftoken = Cookies.get("csrftoken");

      if (csrftoken) {
        headers.set("X-CSRFToken", csrftoken);
      }

      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUser: builder.query<ChatUserData, void>({
      query: () => "/user/",
    }),
    getChats: builder.query<ShzGPTChatHistoryResponseObject[], number>({
      query: (roomId) => `/chat-history/${roomId}`,
      transformErrorResponse: (response, meta, arg) => {
        console.log("[RTK][getChats][Response]:");
        console.log(response);
        return response;
      },
    }),
    addNewChat: builder.mutation<
      ShzGPTChatHistoryResponseObject,
      PostNewMessageArgs
    >({
      query: (initialChat) => {
        const { chatRoomId, role, newMessage } = initialChat;
        return {
          url: "/chat/",
          method: "POST",
          body: {
            chatroom: chatRoomId,
            role: role,
            content: newMessage,
          },
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useGetChatsQuery, useAddNewChatMutation } =
  apiSlice;
