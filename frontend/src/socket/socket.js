import { io } from "socket.io-client";
import {store} from "../store/store.js";
import {setChatRooms , setActiveChat , setMessages , addMessage , updateLastMessage , clearChatRooms , removeChatRoom , addChatRooms} from "../store/chatSlice.js";
import {addNotification} from "../store/notificationSlice.js"
let socket = null;
export const connectSocket = () => {
    if(socket) return;
    console.log("SOCKET CALLED");
    socket  = io(import.meta.env.VITE_SERVER_URL , {
        withCredentials : true
    })
    socket.on("connect" ,() => {
        console.log("Socket connected" , socket.id);
    })
    socket.on("connect_error" , (err) => {
        console.log("Socket connection failed " , err.message);
    })
    registerEvents();
}

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect()
        socket = null;
    }
}

export const getSocket = () => socket;
const registerEvents = () => {
    socket.off("req");
    socket.off("acc");
    socket.off("new_message");
    socket.off("message_sent");
    
    console.log("Register event 2 times ");
    socket.on("req" , (payload , ack)=>{
        store.dispatch(addNotification(payload));
        ack(true); // socket io sends a special ACK packet to the server 
    })
    socket.on("acc" , (payload)=>{
        store.dispatch(addChatRooms({
            chatId : payload.chatRoom_id,
            otherMember:{
                _id : payload.senderId,
                fullName : payload.senderName,
                userName : payload.senderUserName,
                avatar : payload.senderAvatar
            },
            lastMessage : null
        }))
    })
    socket.on("new_message" , ({chatId , sender , message , createdAt}) => {
        console.log("new message timer");
        const activeChat = store.getState().chat.activeChat;
        store.dispatch(updateLastMessage({ // update chatlist preview
            chatId,
            lastMessage:{
                content : message,
                sender : sender,
                createdAt : createdAt
            }
        }))
        if(activeChat === chatId){ // append to user when it open this chat
            store.dispatch(addMessage({chatId , message : {
                sender,
                message:{content : message},
                createdAt
            }}))
        }
    })
    socket.on("message_sent", ({ messageId }) => {
        console.log("Message saved", messageId)
        
    })
    socket.on("error", ({ message }) => {
        console.error("Socket error", message)
    })
}

// call this when user hits send
export const sendMessage = (roomId, content) => {
    if (!socket) return;

    socket.emit("send-message", {
        roomId,
        message: { type: "text", content }
    })
}