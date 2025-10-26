const isAllowedMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            if (roles.includes(req.user.role)){
                
                return next();

            }
            return res.status(403).json({ msg: req.t("server.not_admin") });

        } catch (err) {
            console.error("Admin check error:", err);
            res.status(500).json({ msg: req.t("server.internal_error") });
        }
    }

}
export {
    isAllowedMiddleware
};