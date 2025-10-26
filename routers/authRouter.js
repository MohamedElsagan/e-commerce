import { body, param, query } from "express-validator";
import express from 'express';
import { setName, setEmail, setPassword, checkEmail, checkPassword } from "../validations/authValidation.js";
import { authController } from "../controllers/authController.js";


const authRouter = express.Router({ mergeParams: true });

authRouter.post(
    "/register",
    [setName("name"), setEmail("email"), setPassword("password"),body("role")],
    authController.register
)
authRouter.post(
    "/login",
    [checkEmail("email"), checkPassword("password")],


    authController.login
);
authRouter.post(
    "/forgot-password",
    [checkEmail("email")],
    authController.forgetPassword
);
authRouter.post(
    "/reset-password",
    [
        query("token").exists(), query("email").exists(),
        query("id").isInt(), setPassword("password")
    ],
    authController.resetPassword
);
authRouter.post(
    "/logout",
    authController.logout
);
authRouter.post(
    "/refresh-token",
    authController.refreshToken
)

export { authRouter };