/**
 Axios Interceptors are functions act as middleware to automatically 
 catch inspect or modify http request before they leave you react application and response before they reach your componenest logic
 interceptors are methods triggred before or after the main request or response 
 Request interceptor: Allows you to execute code before a request is sent
 Response interceptor: Allows you to process the response before it reaches the calling code

 */

import axios from "axios"
import {store} from "../store/store.js"

import { clearUser } from "../store/authSlice.js"
import { clearChatRooms } from "../store/chatSlice.js"
import {clearNotification} from "../store/notificationSlice.js"
import {disconnectSocket} from "../socket/socket.js"

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_SERVER_URL || "http://localhost:8000",
    withCredentials : true,
}) // send cookies with automatically with every request


// 
axiosInstance.interceptors.response.use(
    // success - just return
    (response) => response,
    // error handler
    async(error) => {
        const originalRequest = error.config;
        const errorCode = error.response?.data?.code;
        if(errorCode === "TOKEN_EXPIRED" && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                await axiosInstance.post("/api/auth/refresh");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                const isLoggedIn = store.getState().auth.isAuthenticated;
                if(isLoggedIn){
                    store.dispatch(clearUser());
                    store.dispatch(clearChatRooms());
                    store.dispatch(clearNotification());
                    disconnectSocket();
                    window.location.href = "/login"
                } // this run when user is logged in but their token is expired 
                // server sent token_expired we try to refrsh if token refresh then good otherwise logout the user and sent back to login page 
                return Promise.reject(refreshError); 
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
