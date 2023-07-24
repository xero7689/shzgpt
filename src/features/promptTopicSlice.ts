import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptTopic } from "../fetchers/storage";
import { RootState } from "../app/store";
import { PromptTopicState, ShzGPTPromptTopic } from "../types/interfaces";

const initialState: PromptTopicState = {
  promptTopic: [],
  status: "idle",
  error: undefined,
};

export const fetchPromptTopic = createAsyncThunk(
  "prompts/fetchPromptTopic",
  async (_, { getState }) => {
    const state = getState() as RootState;

    if (!state.chatUser.isLogin) {
      return [];
    }
    const response = await getPromptTopic();
    return response.results;
  }
);

const promptTopicSlice = createSlice({
  name: "promptTopic",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchPromptTopic.fulfilled, (state, action) => {
      state.promptTopic = action.payload;
    });
  },
});

export default promptTopicSlice.reducer;

export const selectAllPromptTopic = (state: RootState) => state.promptTopic.promptTopic;

export const selectPromptTopicById = (state: RootState, promptTopicId: ShzGPTPromptTopic["id"]) =>
  state.promptTopic.promptTopic.find((promptTopic: ShzGPTPromptTopic) => promptTopic.id === promptTopicId);
