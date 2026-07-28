import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { z } from 'zod';

import {User} from "../model/User.model.js";
import { redis } from '../redis/index.js';
import {uploadOnCloudnary} from "../config/Cloudinary.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {generateAccessToken , generateRefreshToken} from "../utils/genrateTokens.js"
import {emailQueue} from "../queue/email.queue.js"
import { ERROR_CODES } from '../utils/errorCode.js';

const passwordSchema =  z 
    .string()
    .min(8 , {message : "PAssword must be atleast 8 charcter long ."})
    .refine((p) => /[A-Z]/.test(p) , {
        message : "Password must conatin at least oen uppercase letter."
    })
    .refine((p) => /[a-z]/.test(p), {
        message: 'Password must contain at least one lowercase letter.',
    })
    .refine((p) => /[0-9]/.test(p), {
        message: 'Password must contain at least one number.',
    })
    .refine((p) => /[!@#$%^&*?]/.test(p), {
        message: 'Password must contain at least one special character.',
    })

const otpRequestParser = z.object({
    email : z.string().trim().email({
        message : "Provide valid email",
    }),
    type : z.enum(['register' , 'password-reset'])
});

const otpVerifyParser = z.object({
    email : z.string().trim().email({
        message : "Provide valid email",
    }),
    otp : z.string(),
    type : z.enum(['register' , 'password-reset'])
})

const registerParser = z.object({
    fullName : z.string().trim().min(5),
    userName : z.string().trim().min(3),
    email : z.string().trim().email(),
    password : passwordSchema,
    DOB : z.string().trim()
})

const loginParser = z.object({
  userName: z.string().trim().min(1),
  email : z.string().trim().email(),
  password: z.string().min(1),
});

const passwordChangeParser = z.object({
  email: z.string().trim().email(),
  password: passwordSchema,
});

const setRefreshCookie = (res , token) => {
    res.cookie('refreshToken' , token , {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

const setAccessCookie = (res , token) => {
    res.cookie('accessToken' , token , {
        httpOnly : true, // the cookie can not access via document.cookie 
        secure : process.env.NODE_ENV === 'production', // in production cookie is only sent over HTTPS 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // allows cors request in production or in dev works it's relaxed this 
        maxAge: 30 * 60 * 1000, 
    })
}

const hashOtp = (otp) => { // convert plain otp to fixed length hash 
    return crypto
        .createHash('sha256') // creates a hasher using the sha algo
        .update(otp) // feed the otp to hasher
        .digest('hex') // finalizes and return the hash as a string 
};

const otpRequest = asyncHandler(async(req , res) => {
    const parsed = otpRequestParser.parse(req.body);
    const {email , type } = parsed;
    const user = await User.findOne({email});
    if(!user && type === "password-reset"){
        throw new ApiError(404 , "Email not found");
    }
    if(user && type === "register"){
        throw new ApiError(404 , "Email already exist");
    }
    // OTP rate limiter 
    // prevent a user from requesting too many OTP's 
    const limitKey = `otp:${email}:${type}:limit`; // create a unique redis key per user per otp type 
    const limit = await redis.incr(limitKey); // increment the value at the key by 1 and return the new val // if key does not exist creates it with value 0 then incr to 1
    if(limit === 1){
        await redis.expire(limitKey , 60);
    } // Only the first request , set 60-second TTl on the on the key 
    // because if we could expire on every req , the window would reset on each attempt , and the counter would never expire naturally  
    if(limit > 3){ // if user has requested more than 3 otp's within 60 sec block them with 
        throw new ApiError(429 , "Too Many Requests , Try again Later");
    }

    const otp = crypto.randomInt(100000 , 999999).toString();
    const hashedOtp = hashOtp(otp);

    await redis.set( // set hashedotp in redis  
        `otp:${email}:${type}`,
        hashedOtp,
        'EX',
        300
    )

    await emailQueue.add( // adding an email job to the Queue // internally does LPUSH to redis list 
      'otp-mail',
      {
        to: email,
        subject: 'OTP Verification',
        body: `
          <div>
            <h2>Your OTP Code</h2>
            <h1>${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
          </div>
        `,
      },
      {
        attempts: 3, // if the job fails , BullMQ will retry it up to 3 times before marking it as failed 
        backoff: { // control the delays b/w retries 
          type: 'exponential',
          delay: 2000,
        },
        // 1st fail -> wait 2000 retry 
        // 2nd fail -> wait 4000 retry 
        // 3rd fail -> wait 8000 retry 
      }
    );
    return res.status(200).json(new ApiResponse(200 , `OTP sent for ${type}`));
})

const otpVerify = asyncHandler(async(req , res) => {
    const parsed = otpVerifyParser.parse(req.body);
    const {email , type , otp} = parsed;
    const user = await User.findOne({email});
    if(!user && type === "password-reset"){
        throw new ApiError(404 , "Email not found");
    }
    if(user && type === "register"){
        throw new ApiError(404 , "UserName or Email already exist");
    }

    const storedOTP = await redis.get(`otp:${email}:${type}`);
    if (!storedOTP) {
      throw new ApiError(410 , "OTP expired or not found");
    }
    // rate limit also here in verification OTP 
    const attemptKey = `otp:${email}:${type}:limit`; 
    const attempt = await redis.incr(attemptKey);
    if(attempt === 1){
        await redis.expire(attemptKey , 100);
    } 
    if(attempt > 3){ 
        await redis.del(`otp:${email}:${type}`); // we delete this after 3 attempts because a six digit otp can be genrate 
        throw new ApiError(429 , "Too Many Requests , Try again Later");
    }
    const hashedOtp = hashOtp(otp);
    if(storedOTP !== hashedOtp){
        throw new ApiError(401 , "Inavlid Request");
    }
    await Promise.all([
        redis.del(`otp:${email}:${type}`),
        redis.del(attemptKey),
        redis.set(
        `otp:${email}:${type}:verified`,
        'verified',
        'EX',
        300
        )
    ]);
    return res.status(200).json(new ApiResponse(200 , "OTP verified successfully"));
})

const register = asyncHandler(async(req , res) => {
    const parsed = registerParser.parse(req.body);
    const {email , userName , password  , fullName , DOB} = parsed;
    const verified = await redis.get(`otp:${email}:register:verified`);
    if(!verified){
        throw new ApiError(401 , "Email not verified");
    }
    const Exitsuser = await User.findOne({
        $or : [{userName} , {email}]
    });
    if(Exitsuser){
        throw new ApiError(409 , "Email_UserName_already_taken");
    }
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400 , "Avtar file is required");
    }

    const avatar = await uploadOnCloudnary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400 , "Avatar file upload failed!");
    }
    // console.log("Cloudinary result:", avatar);
    const hashedPassword = await bcrypt.hash(password , 10);
    const user = await User.create({
        fullName,
        userName,
        email,
        password : hashedPassword,
        DOB,
        avatar : avatar.url,
    })
    const createdUser = await User.findById(user._id).select("-password");
    if(!createdUser){
        throw new ApiError(500 , "Something Went wrong!");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setAccessCookie(res, accessToken);
    setRefreshCookie(res , refreshToken);
    await Promise.all([
        redis.del(`otp:${email}:register:verified`),
        redis.set(
            `user:${user._id}:refresh-token`,
            refreshToken,
            'EX',
            7 * 24 * 60 * 60 
        ),
    ]);
    await emailQueue.add( // adding an email job to the Queue
      'Welcome-Email',
      {
        to: email,
        subject: `Welcome ${userName}`,
        body: `
          <div>
            <h2>Thanks ${userName} to choosing us</h2>
            <h1>let's chat with your friend smoothly Feel free to contact us!</h1>
          </div>
        `,
      },
      {
        attempts: 3, // if the job fails , BullMQ will retry it up to 3 times before marking it as failed 
        backoff: { // control the delays b/w retries 
          type: 'exponential',
          delay: 2000,
        },
        // 1st fail -> wait 2000 retry 
        // 2nd fail -> wait 4000 retry 
        // 3rd fail -> wait 8000 retry 
      }
    );
    return res.status(201).json(new ApiResponse(201 , 
        createdUser , 
        "User created Successfully"
    ));
})
// https://picsum.photos/id/237/536/354

const login = asyncHandler(async(req , res) => {
    const parsed = loginParser.parse(req.body);

    const {email , userName , password} = parsed;
    // rate limit 
    const attemptsKey = `login:${email}:attempts`;
    const attempts = await redis.incr(attemptsKey);
    if(attempts === 1){
        redis.expire(attemptsKey , 7 * 60);
    } 
    if(attempts > 5){
        throw new ApiError(429 , "Too many Login requests");
    }
    // find the user
    const user = await User.findOne({
        $or : [{email} , {userName}]
    })
    if(!user){
        throw new ApiError(401 , "Invalid Credentials");
    }
    const isCorrectPassword = await bcrypt.compare(password , user.password);
    if(!isCorrectPassword){
        throw new ApiError(401 , "Invalid Credentials");
    }
    await redis.del(attemptsKey);
    const accessToken = generateAccessToken(user._id , user.userName , user.email);
    const refreshToken = generateRefreshToken(user._id);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res , refreshToken);

    await redis.set(
            `user:${user._id}:refresh-token`,
            refreshToken,
            'EX',
            7 * 24 * 60 * 60 
    )
    // await emailQueue.add( // adding an email job to the Queue
    //   'Recent-Login',
    //   {
    //     to: email,
    //     subject: 'Recent Login ',
    //     body: `
    //       <div>
    //         <h2>Hey ${user.userName} we see a new recent login</h2>
    //         <h1>if this was you ignore this email</h1>
    //         <p>otherwise go and check</p>
    //       </div>
    //     `,
    //   },
    //   {
    //     attempts: 3, 
    //     backoff: { // control the delays b/w retries 
    //       type: 'exponential',
    //       delay: 2000,
    //     },
    //   }
    // );

    return res.status(200).json(new ApiResponse(200 , 
        {
            _id : user._id,
            userName : user.userName,
            fullName : user.fullName,
            avatar : user.avatar
        }, 
        "Logged In Successfully"
    ))
})
const refresh = asyncHandler(async(req , res) => {
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken){
        throw new ApiError(401 , "No refresh token" , ERROR_CODES.INVALID_REFRESH);
    }

    let userId;
    try {
        const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN);
        userId = decoded._id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Refresh token expired", ERROR_CODES.TOKEN_EXPIRED)
        }
        throw new ApiError(401, "Invalid refresh token", ERROR_CODES.INVALID_REFRESH)
    }

    const storedToken = await redis.get( `user:${userId}:refresh-token`);
    if(!storedToken || storedToken !== refreshToken){
        throw new ApiError(401 , "Invalid Token" , ERROR_CODES.INVALID_REFRESH);
    }
    const user = await user.findById(userId);
    const new_accessToken = generateAccessToken(user._id , user.userName , user.email);
    const new_refreshToken = generateRefreshToken(user._id);

    setAccessCookie(res, new_accessToken);
    setRefreshCookie(res , new_refreshToken);
    
    await redis.set(
            `user:${user._id}:refresh-token`,
            new_refreshToken,
            'EX',
            7 * 24 * 60 * 60 
    )
    return res.status(200).json(new ApiResponse(200 , "Token genrated"));
})
const changePassword = asyncHandler(async(req,res)=>{
    const parsed = passwordChangeParser.parse(req.body);
    const {email , password} = parsed;
    const verified = await redis.get(`otp:${email};password-reset:verified`);
    if(!verified){
        throw new ApiError("Not Verified");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404 , "User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    await Promise.all([
      redis.del(`otp:${email}:password-reset:verified`),
      redis.del(`user:${user._id}:refresh-token`),
    ]);
    await emailQueue.add( // adding an email job to the Queue
      'password-change',
      {
        to: email,
        subject: 'password-change',
        body: `
          <div>
            <h2>Your Password is Changed</h2>
            <p>Login Again </p>
          </div>
        `,
      },
      {
        attempts: 3, // if the job fails , BullMQ will retry it up to 3 times before marking it as failed 
        backoff: { // control the delays b/w retries 
          type: 'exponential',
          delay: 2000,
        },
      }
    );
    return res.status(200).json(new ApiResponse(200 , "Password change Successfully relogin now"));
})
const logout = asyncHandler(async(req , res)=>{
    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
    if(!refreshToken){
        throw new ApiError(401 , "No Token found");
    }
    try{
        const decodedRefresh = jwt.verify(
            refreshToken , process.env.REFRESH_TOKEN
        )
        if(req.userId !== decodedRefresh._id){
            throw new ApiError(401 , "Invalid Token Pair");
        }
        const decodedAccess = jwt.verify(accessToken , process.env.ACCESS_TOKEN);
        const remainTime = decodedAccess.exp - Math.floor(Date.now() / 1000);
        await Promise.all([
            remainTime > 0 
            ? redis.set(
                `blacklist:${accessToken}`,
                'blacklisted',
                'EX',
                remainTime
            )
            : Promise.resolve(),
            redis.del(
                `user:${req.userId}:refresh-token`
            ),
        ])
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.status(200).json(new ApiResponse(200 , "Logout Successfully"));
    }
    catch(err){
    if(
      err.name === 'JsonWebTokenError' ||
      err.name === 'TokenExpiredError'
    ){
      throw new ApiError(400 , err.message);
    }
    throw new Error("Internal server issues");
    }
})
export {
    otpRequest,
    otpVerify,
    register,
    login,
    refresh,
    changePassword,
    logout
}