import jwt from 'jsonwebtoken';
export const generateAccessToken = (userId , userName , email) => {
    return jwt.sign({ // payload
        _id : userId,
        userName,
        email,
    },
    process.env.ACCESS_TOKEN,
    {
        expiresIn: process.env.ACCESS_TOKEN_EX
    },
    )
}
export const generateRefreshToken = (userId) => {
    return jwt.sign({
           _id : userId 
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EX
        },
    )
}