import {redis} from "../redis/index.js"
import {User} from "../model/User.model.js";
import Message from "../model/Message.model.js";
import ChatRoom from "../model/ChatRoom.model.js";
import Notification from "../model/Notification.model.js";
import {getIO} from "./socket.js"
// all our socket event handlers 
export const onConnection = async(socket) => {
    const userId = socket.userId;
    // register to redis 
    await redis.set(`socket:${userId}` , socket.id);
    console.log(`${userId} is online`);
    // join all exiting chat rooms 
    const userChats = await ChatRoom.find({members : {$in : [userId]}})
    //console.log(`${userId} have ${userChats.length}`);
    userChats.forEach(chat => socket.join(chat._id.toString())); 

    // deliver pending message
    await deliverPendingNotifications(socket , userId);
    
    // listen for events 
    socket.on("send-message" , ({message , roomId}) =>  onSendMessage(socket , message , userId , roomId));

    socket.on("disconnect" , async() => {
        await redis.del(`socket:${userId}`);
        await User.findByIdAndUpdate(userId , {lastSeen: new Date()}).select("-password");
        console.log(`${userId} is offline`);
    })
}
const onSendMessage = async(socket , message , userId , roomId) => {
    const chatRoom = await ChatRoom.findById(roomId);
    const newMessage = await Message.create({
        chatId : chatRoom._id,
        sender : userId,
        message : {
            type : "text",
            content : message.content
        }
    })
    await ChatRoom.findByIdAndUpdate(chatRoom._id , {
        lastMessage : {
            content : message.content,
            sender : userId,
            timestamp : new Date()
        }
    })
    const io = getIO();
    io.to(roomId).emit('new_message' , {
        chatId : roomId,
        sender : userId,
        message : message.content,
        createdAt : newMessage.createdAt
    });
    socket.emit("message_sent", { messageId: newMessage._id })
}
const deliverPendingNotifications = async (socket, userId) => {
    const pending = await Notification.find({ receiver: userId }).sort({ createdAt: 1 }) // database retrieval fetch all pending notification 

    for (const notification of pending) {// deliver one notification at a time 
        try {
            // waits up to 5 sec for the client to acknowledge recipt 
            await socket.timeout(5000).emitWithAck(notification.type , notification.payload); // litrally pause execution 
            // nothing belows run 
            // code only reaches here if client acknowledges
            await Notification.findByIdAndDelete(notification._id);
        } catch (error) { // 5 sec passes socket thorw an error and jump here 
            console.log("Client took too long to respond or disconnected , Saving message for later");
            break;
        }
    } // notification n1 , wait for ack then n2  wait for ack , n3 ....... sequentially 
}

/**
 *  why we can't use for each 
 * for each -> we can not handle await properly , 
 * in for of we use break but in for each we can not use break or continue it throw syntax error 
 * 
 * socket ack is a req res pattern where the receiving side confirms recipt of an event 
 * you can add a callback as the last argument of the emit() and this callback will be called once the other side acknowledges the event 
 * we pass a callback as the last argument to emit.
 * The reciever handler gets that callback as an extra parameter and calls it when done .
 * this work both side client-server or server-client
 * 1.
 * When you call emit(event , data , callback) socket.io does not send the callback function over the connection because function does not travel across the internet 
 * Instead it stores the callback locally in a map keyed by an auto incrementing packetId this.acks[id] = callback,
 * then sends EVENT packet that includes id fields alongside the event name 
 * 2.
 * On the recieving side , when a packet arrives with an id , means server is waiting for an answer on the specific message 
 * the client dynamically creates a temporary new synthetic function right on the spot 
 * when you passing true inside your client code that fake funciton does not contain your server logic 
 * intead it's only job is to bundle your true value into a special ACK packet with the same ID and send back to server 
 * 3.
 * The server recieves ACK packet 
 * it reads id from incoming packet 
 * it looks into this.acks[] memory map finds the function stored at key id and executes it using the data sent by client 
 * and finally run delete this.ack[id] to free RAM 
 * 
 * in for-----of loop spins through all notifications instantly it does not wait for step 1,2,3...
 * unless you force it by using socket.timestamp().emitWithAck() 
 * to prevent the server from hanging forever if a client fails to respond 
 * it causes memory leaks freeze backend 
 * 
 */


