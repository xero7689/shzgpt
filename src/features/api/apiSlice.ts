import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ChatUserData } from '../../types/interfaces'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/chat' }),
  endpoints: builder => ({
    getUser: builder.query<ChatUserData, void>({
      query: () => '/user/'
    })
  })
});

export const {
  useGetUserQuery
} = apiSlice;
