import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


import { User } from "../model/User.model.js";
import ChatRoom from "../model/ChatRoom.model.js"
import Notification from "../model/Notification.model.js"


const getCurrentUser = asyncHandler(async(req , res)=>{
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if(!user){
        throw new ApiError(404 ,"User not found");
    }
    return res.status(200).json(new ApiResponse(200 , user , "User get Succefully"));
})
// in the findTheUser we have some edge cases 
/**
1. what if they 2 user are already friend or connected 
2. what if they not accepted the chat request till yet and another user do again a request
so we have to find in both ChatRoome and Notifications to handle these case

// But the problem is there are 3 DB request means 3 round trip 
so we have to optimize by single aggregation pipeline
 */
const findTheUser = asyncHandler(async(req , res)=>{
    //console.log(req);
    const {userName} = req.params;
    const currentUserId = req.userId;

    if(!userName){
        throw new ApiError(404 , "Please give us userName");
    }
    const foundUser = await User.findOne({userName : userName.toLowerCase()}).select("_id fullName userName avatar");
    if(!foundUser){
        throw new ApiError(404 , "Invalid User credentials");
    }
    // check if already connected 
    const existingRoom = await ChatRoom.findOne({
        members:{
            $all : [currentUserId , foundUser._id]
        }
    })
    if(existingRoom){
        return res.status(200).json(new ApiResponse(
            200 , {
                user: foundUser,
                status : "connected",
                chatId : existingRoom._id
            } , "User found"
        ))
    }
    // check already have chat request
    const pendingRequest = await Notification.findOne({
        type : "req",
        $or :[
            {sender:currentUserId , receiver:foundUser._id},
            {sender:foundUser._id , receiver:currentUserId}
        ]
    })
    if(pendingRequest){
        return res.status(200).json(new ApiResponse(
            200 , {
                user:foundUser,
                status : "pending",
                chatId : "None"
            } , "User found"
        ))
    }
    if(!existingRoom && !pendingRequest){
    return res.status(200).json(new ApiResponse(
            200 , {
                user:foundUser,
                status : "none",
                chatId : "None"
            } , "User found"
    ))
    }
})

export {
    getCurrentUser,
    findTheUser
}