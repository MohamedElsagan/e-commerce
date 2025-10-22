import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = ({id , name , email , role})=>{
    return jwt.sign({
        id : id,
        name : name,
        email : email,
        role : role
    } , process.env.JWT_ACCESS_SECRET,{
        expiresIn : process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    })
}
const generateRefreshToken = ({id , name , email , role})=>{
    return jwt.sign({
        id : id,
        name : name,
        email : email,
        role : role
    } , process.env.JWT_REFRESH_SECRET,{
        expiresIn : process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    })
}

export {generateAccessToken , generateRefreshToken};