import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalIsDisplay: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleSettingsModal(state, action) {
      state.modalIsDisplay = !state.modalIsDisplay;
    },
  },
  extraReducers(builder) {},
});

export const { toggleSettingsModal } = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectSettingsDisplayState = (state) =>
  state.settings.modalIsDisplay;
