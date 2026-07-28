import mongoose , {Schema}from "mongoose";
const notificationSchema = new Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    type : {
        type : String,
        enum : ["req" , "accept"],
        required : true
    },
    payload : {
        type : mongoose.Schema.Types.Mixed,
        required : true,
    }
} , {timestamps : true});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;