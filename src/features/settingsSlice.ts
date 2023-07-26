import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const initialState = {
  modalIsDisplay: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleSettingsModal(state) {
      state.modalIsDisplay = !state.modalIsDisplay;
    },
  },
});

export const { toggleSettingsModal } = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectSettingsDisplayState = (state: RootState) =>
  state.settings.modalIsDisplay;
