import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = ({id , name , email , status})=>{
    return jwt.sign({
        id : id,
        name : name,
        email : email,
        status : status
    } , process.env.JWT_ACCESS_SECRET,{
        expiresIn : process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    })
}
const generateRefreshToken = ({id , name , email , status})=>{
    return jwt.sign({
        id : id,
        name : name,
        email : email,
        status : status
    } , process.env.JWT_REFRESH_SECRET,{
        expiresIn : process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    })
}

export {generateAccessToken , generateRefreshToken};