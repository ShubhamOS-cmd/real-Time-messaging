import axiosInstance from "./axiosInstance";
const chatRequest = async(data) => {
    const {receiverId} = data;
    if(receiverId === "")throw new Error("fields reqiired");
    const res = await axiosInstance.post(`/api/chat/chatReq/${receiverId}`);
    return res.data;
}

const acceptChatReq = async(data) => {
    const {receiverId} = data;
    if(receiverId === "")throw new Error("fields reqiired");
    const res = await axiosInstance.post(`/api/chat/acceptChatReq/${receiverId}`);
    return res.data;
}
const ignoreChatRequest = async(data) => {
    const {receiverId} = data;
    if(receiverId === "" || !receiverId)throw new Error("fields reqiired");
    const res = await axiosInstance.post(`/api/chat/ignoreReq/${receiverId}`);
    return res.data;
}
const getChatRooms = async() =>{
    const res = await axiosInstance.get("/api/chat/getChatRooms");
    return res.data;
}
const getChatHistory = async(data) => {
    const {chatId} = data;
    const res = await axiosInstance.get(`/api/chat/getChatHistory/${chatId}`);
    return res.data;
}
const cancelChatRequest  = async(data) => {
    const {receiverId} = data;
    const res = await axiosInstance.delete(`/api/chat/cancelChatRequest/${receiverId}`);
    return res.data;
}
export {
    chatRequest, acceptChatReq ,ignoreChatRequest , getChatRooms , getChatHistory , cancelChatRequest
}