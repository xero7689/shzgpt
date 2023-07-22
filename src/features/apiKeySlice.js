import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAPIKey } from "../fetchers/storage";
import { Configuration } from "openai";

const initActiveAPIKey = Cookies.get('c_api_key')

let initOpenAIApiConfig = null
if (initActiveAPIKey) {
    initOpenAIApiConfig = new Configuration({
        apiKey: initActiveAPIKey
    })
    delete initOpenAIApiConfig.baseOptions.headers['User-Agent'];
}

const initialState = {
  keys: [],
  activeKey: initActiveAPIKey,
//   openAIApiConfig: initOpenAIApiConfig,
};

export const fetchAPIKey = createAsyncThunk(
  "apiKey/fetchAPIKey",
  async (args, { dispatch, getState }) => {
    const state = getState();
    const response = await getAPIKey();
    if (response.results.length >= 0) {
      dispatch(updateAPIKeys(response.results))
      if (!state.apiKey.activeKey) {
        // Set the first key as default active apiKey
        dispatch(updateActiveKey(response.results[0].key));
      }
    }
  }
);

const apiKeySlice = createSlice({
  name: "apiKey",
  initialState,
  reducers: {
    updateAPIKeys(state, action) {
        state.keys = action.payload;
    },
    updateActiveKey(state, action) {
        state.activeKey = action.payload;
        Cookies.set("c_api_key", action.payload);
    }
  },
  extraReducers(builder) {},
});

export const {
    updateAPIKeys,
    updateActiveKey,
} = apiKeySlice.actions;

export default apiKeySlice.reducer;

export const selectAllAPIKeys = (state) => state.apiKey.keys;
export const selectActiveKey = (state) => state.apiKey.activeKey;
