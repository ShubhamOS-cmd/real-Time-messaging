import jwt from "jsonwebtoken"
import cookie from "cookie";
import {redis} from "../redis/index.js"
import { ApiError } from "../utils/ApiError.js";
export const socketAuth = async (socket , next) => {
    const Cookies = socket.handshake.headers.cookie || "";
    const parsed = cookie.parse(Cookies);
    const token = parsed.accessToken;
    if(!token)return next(new ApiError(401 , "Unauthorized!"));
    try {
        const blacklisted = await redis.get(`blacklist:${token}`);
        if (blacklisted) {
            next(new ApiError(401 , "Invalid Token"));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        socket.userId = decoded._id;
        next();
    } catch (error) {
        console.log(error.message);
        next(new ApiError(401 , error.message));
    }
}