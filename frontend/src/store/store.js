import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import notificationSlice from "./notificationSlice.js"
import chatSlice from "./chatSlice.js"
export const store = configureStore({
    reducer:{
        auth : authReducer,
        notification : notificationSlice,
        chat : chatSlice
    }
});