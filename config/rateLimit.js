import {rateLimit} from "express-rate-limit";

const gloabalLimiter = rateLimit({
    windowMs : 1000 * 60 * 1,
    limit : (req,res)=> req?.user?.id ? 10 : 5,
    // skip : (req) => req?.user?.role === "admin",
    handler: (req, res, next, options) => {
        console.log(`🔒 IP ${req.ip}`);
        console.log(`🔒 req.user ${req.user}`);
        return res.status(options.statusCode).json({
            success: false,
            error: req.t("limiter.too_many_requests"),
            limit: options.limit,
            windowMinutes: `${options.windowMs / 60000} m`
        });
    },
    

})
export {gloabalLimiter};