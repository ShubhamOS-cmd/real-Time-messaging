import mongoose , {Mongoose, Schema}from "mongoose";

const messageSchema = new Schema({
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ChatRoom",
        required : true,
        index : true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : {
            type : String,
            enum : ["text" , "image" , "file"],
            default : "text"
        },
        content : {
            type : String,
            required : true
        },
    },
}, {timestamps : true})

messageSchema.index({ chatId: 1, createdAt: 1 });
 
const Message = mongoose.model("Message", messageSchema);
export default Message;