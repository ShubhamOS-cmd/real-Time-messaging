import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {redis} from "../redis/index.js"
import { User } from "../model/User.model.js";
import Message from "../model/Message.model.js"
import ChatRoom from "../model/ChatRoom.model.js"
import Notification from "../model/Notification.model.js"
import {notifyUser} from "../utils/notifyUser.js"
import { getIO } from "../socket/socket.js";

const sendChatRequest = asyncHandler(async(req , res)=>{
    const {receiverId} = req.params;
    const currentUserId = req.userId;
    if(receiverId === currentUserId){
        throw new ApiError(400 , "You can not send request yourself ");
    }
    const receiver = await User.findById(receiverId);
    if(!receiver){
        throw new ApiError(400 , "UserId invalid");
    }
    const existingRoom = await ChatRoom.findOne({
            members:{
                $all : [currentUserId , receiverId]
            }
    })
    if(existingRoom){
        return res.status(400).json(new ApiResponse(
            400 , "Already Chat Room created"
        ))
    }
    const pendingRequest = await Notification.findOne({
        type : "req",
        $or :[
            {sender:currentUserId , receiver:receiverId},
            {sender:receiverId , receiver:currentUserId}
        ]
    })
    if(pendingRequest){
        return res.status(400).json(new ApiResponse(
            400 , "Already Request"
        ))
    }
    const sender = await User.findById(currentUserId).select("userName fullName avatar");
    const payload = {
        senderId : sender._id,
        senderName : sender.fullName,
        senderUserName: sender.userName,
        senderAvatar: sender.avatar
    }
    await notifyUser(receiverId , currentUserId , "req" ,payload);
    return res.status(200).json(new ApiResponse(200 , "Request send succesfully"));
})
const acceptChatRequest = asyncHandler(async(req , res)=>{
    const {receiverId} = req.params;
    const currentUserId = req.userId;
    const receiver = await User.findById(receiverId)
    if (!receiver) throw new ApiError(404, "User not found")
    const existingRoom = await ChatRoom.findOne({
            members:{
                $all : [currentUserId , receiverId]
            }
    })
    if(existingRoom){
        return res.status(400).json(new ApiResponse(
            400 , "Already Chat Room created"
        ))
    }
    const sender = await User.findById(currentUserId).select("userName fullName avatar");
    const chat_room = await ChatRoom.create({
        members : [currentUserId , receiverId]
    })
    const io = getIO();
    const senderSocketId = await redis.get(`socket:${currentUserId}`);
    const recieverSocketId = await redis.get(`socket:${receiverId}`);
    // io.sockets.sockets is a map that stores all currently clients 
    if(senderSocketId) io.sockets.sockets.get(senderSocketId)?.join(chat_room._id.toString());
    if(recieverSocketId) io.sockets.sockets.get(recieverSocketId)?.join(chat_room._id.toString());

    const payload = {
        senderId : sender._id,
        senderName : sender.fullName,
        senderUserName: sender.userName,
        senderAvatar: sender.avatar,
        chatRoom_id : chat_room._id
    }
    await notifyUser(receiverId , currentUserId , "acc" , payload);
    return res.status(200).json(new ApiResponse(
            200 ,chat_room ,  "Room Created"
    ))
})
const cancelChatRequest = asyncHandler(async(req, res) => {
    const { receiverId } = req.params;
    const currentUserId = req.userId;

    const deleted = await Notification.findOneAndDelete({
        type: "req",
        $or: [
            { sender: currentUserId, receiver: receiverId },
            { sender: receiverId, receiver: currentUserId }
        ]
    });

    if (!deleted) {
        throw new ApiError(404, "No pending request found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Request cancelled"));
})
const ignoreChatRequest = asyncHandler(async(req , res)=>{
    const {receiverId} = req.params;
    const currentUserId = req.userId;
    const receiver = await User.findById(receiverId);
    if (!receiver) throw new ApiError(404, "User not found");
    const sender = await User.findById(currentUserId).select("userName fullName avatar");
    const payload = {
        senderId : sender._id,
        senderName : sender.fullName,
        senderUserName: sender.userName,
        senderAvatar: sender.avatar
    }
    await notifyUser(receiverId , currentUserId , "ignore" , payload);
    return res.status(200).json(new ApiResponse(
        200 ,  "ignored Successfully"
    ))
})
const getMyChatRooms = asyncHandler(async(req , res)=>{
    const userId = req.userId;
    const allChatRooms = await ChatRoom.find({
        members : {$in : [userId]}
    })
    .populate("members" , "name userName avatar") // populate both members 
    .sort({updateAt : -1});
    // for each chat expose only other member info 
    const formattedChat = allChatRooms.map((chat) => {
        const otherMember =  chat.members.find(
            (member) => member._id.toString() !== userId.toString()
        )
        return {
            chatId : chat._id,
            otherMember,
            lastMessage: chat.lastMessage,
            updatedAt : chat.updateAt
        }
    })
    return res.status(200).json(new ApiResponse(200 , formattedChat , "All chats are fetched"));
})

const getAllMessages = asyncHandler(async(req , res)=>{
    const {chatId} = req.params;
    const { page = 1, limit = 50 } = req.query
    const userId = req.userId;

    const existChatRoom = await ChatRoom.findById(chatId);
    if(!existChatRoom){
        throw new ApiError(404 , "No ChatRoom found");
    }
    // security checks // checks that user is a member of specific chat 
    const isMember = existChatRoom.members.includes(userId);
    if (!isMember) throw new ApiError(403, "Unauthorized")
    // we have to paginate messages 
    const allMessages = await Message.find({
        chatId : existChatRoom._id
    })
    .sort({createdAt : 1})
    .skip((page - 1) * limit)
    .limit(Number(limit));
    return res.status(200).json(new ApiResponse(200 , allMessages , "Chat Fteched"));
})
// as the reciever get the notification 
// 2 things happen 1. in case of ignore or accept delete the notification from DB 
// if he accept then notifyuser and create 1

export {
    sendChatRequest,
    acceptChatRequest,
    ignoreChatRequest,
    getAllMessages,
    getMyChatRooms,
    cancelChatRequest
}