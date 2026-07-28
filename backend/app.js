import express, { urlencoded } from "express"
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from "cookie-parser"
import cors from "cors"
import logger from "./src/config/logger.js"
import authRoute from "./src/routes/Auth.route.js"
import userRoute from "./src/routes/User.route.js"
import chatRoute from "./src/routes/Chat.route.js"
import { ERROR_CODES } from "./src/utils/errorCode.js"

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials : true
}));
app.use(morgan('combined' , {
    stream: {write:(message) => logger.info(message.trim())}
}));
app.use(cookieParser());

app.use(express.urlencoded({extended:true}))
app.use((err , req , res , next) => {
    const statusCode  = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    const code = err.code || ERROR_CODES.SERVER_ERROR;
    return res.status(statusCode).json({
        statusCode,
        code,
        message,
        success:false
    })
});
app.get("/" , (req , res) => {
    return res.json({message : "Server is Working"});
})
app.use('/api/auth' , authRoute);
app.use('/api/user' , userRoute);
app.use('/api/chat' , chatRoute);
export default app;