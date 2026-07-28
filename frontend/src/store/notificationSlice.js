import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications : []
}

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers:{
        addNotification: (state , action) => {
            state.notifications.push(action.payload)
        },
        removeNotification: (state , action) => {
            state.notifications = state.notifications.filter(
                n => n.senderId !== action.payload
            )
        },
        clearNotification : (state) => {
            state.notifications = []
        }
    }
})

export const {addNotification , removeNotification , clearNotification} = notificationSlice.actions
export default notificationSlice.reducer