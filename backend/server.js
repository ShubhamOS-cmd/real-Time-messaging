import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
});
import {createServer} from "http";
import app from './app.js';
import connectDB from './src/db/index.js';
import {} from "./src/config/Cloudinary.config.js"
import { initSocket } from './src/socket/socket.js';
import "./src/queue/email.worker.js";
import "./src/config/mailer.js";
const PORT = process.env.PORT || 8000;
const httpServer = createServer(app);
initSocket(httpServer);
connectDB()
.then(() => {
    app.on("error" , (error) => {
        console.log(error);
        throw error;
    });
    httpServer.listen(process.env.PORT || 8000 , () => {
        console.log(`serve is running on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("DB connection failed " , err);
})
