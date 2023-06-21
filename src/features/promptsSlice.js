import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptsList, postNewPrompt } from "../fetchers/storage";

const initialState = {
  prompts: [],
  promptTopic: [],
  status: "idle",
  error: null,
};

export const fetchPrompts = createAsyncThunk(
  "prompts/fetchPrompts",
  async (args, { dispatch, getState }) => {
    const state = getState();

    if (!state.chatUser.isLogin) {
      return [];
    }

    const response = await getPromptsList();
    return response.results;
  }
);

export const addNewPrompt = createAsyncThunk(
  "prompts/addNewPrompt",
  async (initialPrompt, { dispatch, getState }) => {
    const response = await postNewPrompt(initialPrompt);
    return response;
  }
);

const promptsSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    initPromptState(state, action) {
      state.prompts = [];
      state.promptTopic = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPrompts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPrompts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prompts = action.payload;
      })
      .addCase(fetchPrompts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPrompt.fulfilled, (state, action) => {
        state.prompts.push(action.payload);
      });
  },
});

export const { initPromptState } = promptsSlice.actions;
export default promptsSlice.reducer;

export const selectAllPrompts = (state) => state.prompts;

export const selectPromptById = (state, promptId) =>
  state.prompts.find((prompt) => prompt.id === promptId);
