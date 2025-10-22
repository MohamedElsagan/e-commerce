import jwt from "jsonwebtoken";

const accessTokenMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) 
    return res.status(401).json({ msg: req.t("token.access_token_missing") });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    
    // if(req.user.role === "admin")
    //    return next(); 
    // return res.status(401).json({ msg: req.t("server.not_admin")});
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: req.t("token.access_token_expired")});
    }
    return res.status(403).json({ msg: req.t("token.invalid_access_token") });
  }
};

export { accessTokenMiddleware };
