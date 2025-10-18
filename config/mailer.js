import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transproter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASS,
    },
})

const sendMmail = async({to,subject,html,text})=>{
    return await transproter.sendMail({
        to,
        subject,
        text,
        html
    });
}

export {sendMmail}