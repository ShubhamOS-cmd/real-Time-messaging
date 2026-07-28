import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    fullName : {
        type : String,
        require : true,
        trim : true
    },
    userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
    },
    email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
    },
    DOB:{
        type : Date
    },
    password : {
        type : String,
        default : null
    },
    avatar:{
        type : String,
        default: null,
    },
    lastSeen : {
        type : Date,
        default : null
    }
} , {timestamps:true});

export const User = mongoose.model("User" , userSchema);