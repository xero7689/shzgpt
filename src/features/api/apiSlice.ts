import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import {
  ChatUserData,
  ShzGPTChatHistoryResponseObject,
  PostMessageArgs,
} from "../../types/interfaces";

let envBaseUrl = process.env.REACT_APP_DJANGO_STORAGE_API_ENDPOINT;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${envBaseUrl}/chat`,
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
      PostMessageArgs
    >({
      query: (initialChat) => {
        const { chatRoomId, role, message } = initialChat;
        return {
          url: "/chat/",
          method: "POST",
          body: {
            chatroom: chatRoomId,
            role: role,
            content: message,
          },
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useGetChatsQuery, useAddNewChatMutation } =
  apiSlice;
