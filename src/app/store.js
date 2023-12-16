import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "../features/apiSlice";

const store = configureStore({
  reducer: {
    api: apiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
