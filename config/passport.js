import passport  from "passport";
import { Strategy as GoogleStratgy } from "passport-google-oauth20";
import dotenv from 'dotenv'
import { UserModel } from "../models/userModel.js";
dotenv.config();

passport.use(
    new GoogleStratgy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : process.env.GOOGLE_REDIRECT_URI
    } , async (accessToken , refreshToken , profile , done) =>{
        try {
            const user = await UserModel.findOrCreate({
                profileId : profile.id,
                profileDisplayName : profile.displayName,
                profileEmail : profile.emails?.[0]?.value,
                profilePhoto : profile.photos?.[0]?.value
            })
            return done (null , user);
        } catch (error) {
            return done(error , null)
        }
    })
)

export {passport}
