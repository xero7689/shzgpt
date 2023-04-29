import { configureStore } from "@reduxjs/toolkit";

import promptsReducer from "../features/promptsSlice";

export default configureStore({
    reducer: {
        // This tells Redux that we want our top-level state object to have a field named posts inside,
        // and all the data for state.posts will be updated by the postsReducer function when actions are dispatched.
        prompts: promptsReducer,
    }
});