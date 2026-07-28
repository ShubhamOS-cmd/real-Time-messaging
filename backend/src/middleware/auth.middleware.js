import jwt from "jsonwebtoken"
import {redis} from "../redis/index.js"
import { ApiError } from "../utils/ApiError.js";
import { ERROR_CODES } from "../utils/errorCode.js";
export const verifyJWT = async(req , res , next) => {
    //console.log(req.cookies);
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
    if(!token){
        return next(new ApiError(401 ,"No Token provided" , ERROR_CODES.INVALID_TOKEN));
    }
    try {
        const blacklisted = await redis.get(`blacklist:${token}`);
        if (blacklisted) {
            return next(new ApiError(401 , "Invalid Token"));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.userId = decoded._id;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token expired", ERROR_CODES.TOKEN_EXPIRED)
        }
        throw new ApiError(401, "Invalid token", ERROR_CODES.INVALID_TOKEN)
    }
}