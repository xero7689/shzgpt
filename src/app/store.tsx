import { configureStore } from "@reduxjs/toolkit";

import { Middleware, MiddlewareAPI, Dispatch, Action } from "@reduxjs/toolkit";

import chatRoomReducer from "../features/chatRoomSlice";
import promptsReducer from "../features/promptsSlice";
import promptTopicReducer from "../features/promptTopicSlice";
import settingsReducer from "../features/settingsSlice";
import chatUserReducer from "../features/chatUserSlice";
import apiKeySlice from "../features/apiKeySlice";

const loggerMiddleware: Middleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  console.group(action.type);
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

export const store = configureStore({
  reducer: {
    // This tells Redux that we want our top-level state object to have a field named posts inside,
    // and all the data for state.posts will be updated by the postsReducer function when actions are dispatched.
    chatRooms: chatRoomReducer,
    prompts: promptsReducer,
    promptTopic: promptTopicReducer,
    settings: settingsReducer,
    chatUser: chatUserReducer,
    apiKey: apiKeySlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
