import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptTopic } from "../fetchers/storage";


const initialState = {
    promptTopic: [],
    status: 'idle',
    error: null
}

export const fetchPromptTopic = createAsyncThunk('prompts/fetchPromptTopic', async () => {
    const response = await getPromptTopic();
    return response.results;
})


const promptTopicSlice = createSlice(
    {
        name: 'promptTopic',
        initialState,
        reducers: {
        },
        extraReducers(builder) {
            builder
                .addCase(fetchPromptTopic.fulfilled, (state, action) => {
                    state.promptTopic = action.payload;
                })
        }
    }
)

export default promptTopicSlice.reducer;

export const selectAllPromptTopic = state => state.promptTopic;

export const selectPromptTopicById = (state, promptTopicId) =>
    state.promptTopic.find(promptTopic => promptTopic.id === promptTopicId);