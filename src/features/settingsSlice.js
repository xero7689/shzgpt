import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modalIsDisplay: false,
    apiKey: "",
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        toggleSettingsModal(state, action) {
            state.modalIsDisplay = !state.modalIsDisplay;
        },
        setApiKey(state, action) {
            state.apiKey = action.payload;

            const cookieData = JSON.stringify(action.payload);
            document.cookie = `openai_api_key=${cookieData}`;
        } 
    },
    extraReducers(builder) {
    }
});

export const {
    toggleSettingsModal,
    setApiKey
} = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectSettingsDisplayState = (state) => state.settings.modalIsDisplay;
export const selectAPIKey = (state) => state.settings.apiKey;