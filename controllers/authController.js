import { validationResult } from "express-validator"
import { UserModel } from "../models/userModel.js";
import { comparePassword, generateResetToken, hashPassword, hashToken } from "../utils/authUtils.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import { RefreshTokenModel } from "../models/refreshTokenModel.js";
import { PasswordResetModel } from "../models/passwordResetModel.js";
import { sendMmail } from "../config/mailer.js";
import jwt from 'jsonwebtoken';
import { cookieUtlis } from "../utils/cookieUtlis.js";
import { roleUtlis } from "../utils/roleUtils.js";


const authController = {

    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array(), test: req.t("validation.email.invalid") });

            const { email, name, password } = req.body;
            const role = req.body.role || roleUtlis.USER;

            const existing = await UserModel.findEmail(email);
            if (existing)
                return res.status(400).json({ msg: req.t("validation.email.exists") });
            const hashed = await hashPassword(password);
            const user = await UserModel.create({
                email,
                password: hashed,
                name,
                role
            });
            const accessToken = generateAccessToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
            const refreshToken = generateRefreshToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await RefreshTokenModel.create({
                userId: user,
                token: refreshToken,
                expires_at: expiresAt
            })

            res.cookie("accessToken", accessToken, {
                httpOnly: cookieUtlis.HTTP_ONLY,
                sameSite: cookieUtlis.SAME_SITE,
                secure: cookieUtlis.SECURE,
                maxAge: cookieUtlis.MAX_AGE_ACCESS_TOKEN,
                path: cookieUtlis.PATH
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: cookieUtlis.HTTP_ONLY,
                sameSite: cookieUtlis.SAME_SITE,
                secure: cookieUtlis.SECURE,
                maxAge: cookieUtlis.MAX_AGE_REFRESH_TOKEN,
                path: cookieUtlis.PATH
            })

            res.status(201).json({ msg: req.t("success.register"), user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: req.t("server.error") });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findEmail({ email });
            if (!user)
                res.status(400).json({ msg: req.t("validation.login.invalid") });

            const isMatched = await comparePassword(password, user.password);
            if (!isMatched)
                return res.status(400).json({ msg: req.t("validation.login.invalid") });

            const accessToken = generateAccessToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
            const refreshToken = generateRefreshToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await RefreshTokenModel.create({
                userId: user.id,
                token: refreshToken,
                expires_at: expiresAt
            })

            res.cookie("accessToken", accessToken, {
                httpOnly: cookieUtlis.HTTP_ONLY,
                sameSite: cookieUtlis.SAME_SITE,
                secure: cookieUtlis.SECURE,
                maxAge: cookieUtlis.MAX_AGE_ACCESS_TOKEN,
                path: cookieUtlis.PATH
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: cookieUtlis.HTTP_ONLY,
                sameSite: cookieUtlis.SAME_SITE,
                secure: cookieUtlis.SECURE,
                maxAge: cookieUtlis.MAX_AGE_REFRESH_TOKEN,
                path: cookieUtlis.PATH
            })

            res.status(200).json({
                msg: req.t("success.login"),
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: req.t("server.error") });
        }
    },

    async forgetPassword(req, res) {
        try {

            const { email } = req.body;
            const user = await UserModel.findEmail({ email });
            if (!user)
                return res.status(200).json({ msg: req.t("auth.reset_link_sent") });

            await PasswordResetModel.deleteByUser(user.id);

            const rawToken = generateResetToken();
            const hashed = hashToken(rawToken);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await PasswordResetModel.create({
                user_id: user.id,
                token: hashed,
                expiresAt
            });
            const resetLink = `http://localhost:3000/api/change-lang/${req.lang}/auth/reset-password?email=${email}&id=${user.id}&token=${rawToken}`;
            const html = req.t("mail.body", {
                resetLink,
                expireTime: process.env.RESET_TOKEN_EXPIRES_MIN || 60
            });
             await sendMmail({
                to: user.email,
                subject: req.t("mail.subject"),
                html,
            });

            return res.status(200).json({ msg: req.t("auth.reset_link_sent") });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: req.t("server.error") });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, id, email } = req.query;
            if (!token || !id || !email)
                return res.status(400).json({ msg: req.t("auth.token_id_email_required") });

            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const { password } = req.body;
            const hashed = hashToken(token);
            // console.log("hashed = ",hashed);
            // console.log("token = ",token);
            // 099ec0405ca6f6da3be6649bc1dad4183cb6787ccc73b39cc70f988b5155b0b0

            const record = await PasswordResetModel.findByToken({ token: hashed });


            if (!record)
                return res.status(400).json({ msg: req.t("auth.invalid_or_expired_token") });

            // console.log("expires_at:", record.expires_at);
            // console.log("current:", new Date());


            if (record.user_id !== +id)
                return res.status(400).json({ msg: req.t("auth.invalid_token") });

            if (record.used)
                return res.status(400).json({ msg: req.t("auth.token_already_used") });

            if (new Date(record.expires_at) < Date.now())
                return res.status(400).json({ msg: req.t("auth.token_expired") });

            const hashedPass = await hashPassword(password);
            await UserModel.setPassword({
                id,
                hashedPassword: hashedPass
            });

            return res.status(200).json({ msg: req.t("success.updated") });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: req.t("server.error") });
        }
    },
    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken)
                await RefreshTokenModel.deleteByToken({ token: refreshToken });

            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/" });
            res.status(200).json({ msg: req.t("success.logout") });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: req.t("server.error") });
        }
    },

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken)
                return res.status(401).json({ msg: req.t("token.no_refresh_token") });
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log(decoded);

            const user = decoded;
            // 4️⃣ إنشاء Access Token جديد
            const newAccessToken = generateAccessToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });

            // 5️⃣ إرسال الـ Access Token الجديد
            res.cookie("accessToken", newAccessToken, {
                httpOnly: cookieUtlis.HTTP_ONLY,
                sameSite: cookieUtlis.SAME_SITE,
                secure: cookieUtlis.SECURE,
                maxAge: cookieUtlis.MAX_AGE_ACCESS_TOKEN,
                path: cookieUtlis.PATH
            })

            res.json({ accessToken: newAccessToken });
        } catch (err) {
            res.status(500).json({ error: req.t("server.error") });
        }

    }
}

export { authController };