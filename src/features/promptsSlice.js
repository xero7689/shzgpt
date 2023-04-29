import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptsList } from "../fetchers/storage";
import { create } from "@mui/material/styles/createTransitions";

const prompt_topics = ["Education", "Programming"];

const initialState = {
    prompts: [],
    status: 'idle',
    error: null
}

export const fetchPrompts = createAsyncThunk('posts/fetchPrompts', async () => {
    const response = await getPromptsList();
    console.log("in fetch prompts");
    console.log(response.results);
    return response.results;
});

const promptsSlice = createSlice(
    {
        name: 'prompts',
        initialState,
        reducers: {
            promptAdded: {
                reducer(state, action) {
                    console.log(action.payload);
                    state.prompts.push(action.payload)
                },
            },
        },
        extraReducers(builder) {
            builder
                .addCase(fetchPrompts.pending, (state, action) => {
                    state.status = 'loading';
                })
                .addCase(fetchPrompts.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.prompts = action.payload;
                })
                .addCase(fetchPrompts.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                })
        }
    }
)

export const { promptAdded } = promptsSlice.actions;
export default promptsSlice.reducer;

export const selectAllPrompts = state => state.prompts;

export const selectPromptById = (state, promptId) =>
    state.prompts.find(prompt => prompt.id === promptId);