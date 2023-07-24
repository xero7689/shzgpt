import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptsList, postNewPrompt } from "../fetchers/storage";
import { RootState } from "../app/store";

import { PromptSliceState, ShzGPTPrompt, ShzGPTPromptArgs } from "../types/interfaces";

const initialState: PromptSliceState = {
  prompts: [] as ShzGPTPrompt[],
  status: "idle",
  error: undefined,
};

export const fetchPrompts = createAsyncThunk(
  "prompts/fetchPrompts",
  async (_, { getState }) => {
    const state = getState() as RootState;

    if (!state.chatUser.isLogin) {
      return [];
    }

    const response = await getPromptsList();
    return response.results;
  }
);

export const addNewPrompt = createAsyncThunk(
  "prompts/addNewPrompt",
  async (initialPrompt: ShzGPTPromptArgs) => {
    const response = await postNewPrompt(initialPrompt);
    return response;
  }
);

const promptsSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    initPromptState(state) {
      state.prompts = [];
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPrompts.pending, (state) => {
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

export const selectAllPrompts = (state: RootState) => state.prompts.prompts;

export const selectPromptById = (state: RootState, promptId: number) =>
  state.prompts.prompts.find((prompt) => prompt.id === promptId);
