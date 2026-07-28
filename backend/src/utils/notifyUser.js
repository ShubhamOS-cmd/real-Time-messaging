import { redis } from "../redis/index.js";
import  {getIO} from "../socket/socket.js"
import Notification from "../model/Notification.model.js"
export const notifyUser = async(receiverId , currentUserId , type ,payload) => {
    const socketId = await redis.get(`socket:${receiverId}`);
    if(socketId){
        const io = getIO();
        io.to(socketId).emit(type , payload);
    }
    else{
        await Notification.create({
            sender : currentUserId,
            receiver : receiverId,
            type : type,
            payload : payload
        })
    }    
}