import { createSlice, nanoid } from "@reduxjs/toolkit";

const prompt_topics = ["Education", "Programming"];

const initialState = {
    prompts: [
        {
            id: 0,
            topic: "role",
            title: "AWS Architector",
            content: "I want you to act like an AWS professional Architector",
        },
        {
            id: 1,
            topic: "role",
            title: "English Refinement",
            content: "You will act as an English teacher and I will provide you with a sentence to refine using common grammar, like a native speaker"
        }
    ],
    status: 'idle',
    error: null
}

const promptsSlice = createSlice(
    {
        name: 'prompts',
        initialState,
        reducers: {
            promptAdded: {
                reducer(state, action) {
                    state.prompts.push(action.payload)
                },
                prepare(title, content) {
                    return {
                        payload: {
                            id: nanoid(),
                            topic: "test",
                            title,
                            content
                        }
                    }
                }
            },
        }
    }
)

export const { promptAdded } = promptsSlice.actions;
export default promptsSlice.reducer;

export const selectAllPrompts = state => state.prompts;

export const selectPromptById = (state, promptId) =>
    state.prompts.find(prompt => prompt.id === promptId);