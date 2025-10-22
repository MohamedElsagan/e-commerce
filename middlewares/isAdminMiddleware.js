const isAdminMiddleware = (req, res, next) => {
    try {
        // تأكد إن فيه user
        if (!req.user) {
            return res.status(401).json({ msg: req.t("server.not_authenticated") });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: req.t("server.not_admin") });
        }

        next();
    } catch (err) {
        console.error("Admin check error:", err);
        res.status(500).json({ msg: req.t("server.internal_error") });
    }
}
export {
    isAdminMiddleware
};