import express from 'express';
import {passport} from "../config/passport.js";

const googleRouter = express.Router();

googleRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] ,session: false})
);
googleRouter.get("/auth/google/callback/",
  passport.authenticate("google", { failureRedirect: "/login" , session: false}),
  (req, res) => {
        console.log(req.user);
    // res.status(201).json({msg : "Succssed"})
    const redi = req.query.r
    res.send("✔✔❌❌✔✔✔😂");
  }
  

);
export {googleRouter}
