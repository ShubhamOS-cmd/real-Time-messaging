import { Server } from "socket.io";
import { socketAuth } from "../middleware/socket.middleware.js";
import { onConnection } from "./index.js";
let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer , {
        cors: {origin: process.env.client_url,
            credentials:true,
            methods: ["GET", "POST"]
        }
    })
    //console.log(io);
    io.use(socketAuth);
    io.on("connection" , onConnection); /// ....... 
}

export const getIO = () => {
    if(!io)throw new Error("Socket not initialized");
    return io;
}