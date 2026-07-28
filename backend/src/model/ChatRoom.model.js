import mongoose , {Schema}from "mongoose";
const chatRoomSchema = new Schema({
    members : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        }
    ],
    lastMessage: { // last message needs to be updated on every new message but we have to optimize this we can not reach to db every time 
            content: {
                type: String,
                default: null,
            },
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
            timestamp: {
                type: Date,
                default: null,
            },
    },
}, {timestamps : true});
chatRoomSchema.index({members : true});
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;

// we have to optimize that using redis cache 