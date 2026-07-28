import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatRooms : [], 
    activeChat : null,
    messages : {}
}

const chatSlice = createSlice({
    name : "chat",
    initialState,
    reducers:{
        setChatRooms : (state , action) => {
            state.chatRooms = action.payload
        },
        setActiveChat : (state , action) => {
            state.activeChat = action.payload;
        },
        setMessages : (state , action) =>{
            const {chatId , messages} = action.payload;
            state.messages[chatId] = messages;
        },
        addMessage : (state , action) => {
            const { chatId, message } = action.payload
            if (!state.messages[chatId]) {
                state.messages[chatId] = []
            }
            state.messages[chatId].push(message)
        },
        updateLastMessage : (state , action) =>{
            const {chatId , lastMessage} = action.payload;
            const chat = state.chatRooms.find(c => c.chatId === chatId);
            if(chat){
                chat.lastMessage = lastMessage
            }
        },
        clearChatRooms : (state) => {
            state.chatRooms = []
        },
        removeChatRoom : (state , action) => {
            state.chatRooms = state.chatRooms.filter(
                room => room._id !== action.payload
            )
        },
        addChatRooms : (state , action) => {
            state.chatRooms.push(action.payload);
        }
    }
})
export const {
    setChatRooms , setActiveChat , setMessages , addMessage , updateLastMessage , clearChatRooms , removeChatRoom , addChatRooms
} = chatSlice.actions;
export default chatSlice.reducer;