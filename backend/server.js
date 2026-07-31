import {createServer} from "http";
import app from './app.js';
import connectDB from './src/db/index.js';
import {} from "./src/config/Cloudinary.config.js"
import { initSocket } from './src/socket/socket.js';
import "./src/queue/email.worker.js";
import "./src/config/mailer.js";
import "./src/redis/index.js"
const PORT = process.env.PORT || 8000;
const httpServer = createServer(app);
initSocket(httpServer);
connectDB()
.then(() => {
    app.on("error" , (error) => {
        console.log(error);
        throw error;
    });
    httpServer.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((err) => {
    console.log("DB connection failed " , err);
})
