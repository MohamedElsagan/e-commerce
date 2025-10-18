import jwt from "jsonwebtoken";

const accessTokenMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) 
    return res.status(401).json({ msg: req.t("token.access_token_missing") });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    console.log(req.user.id);
    console.log(req.user.status);
    
    if(req.user.status === "admin")
       return next(); 
    return res.status(401).json({ msg: req.t("server.not_admin")});
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: req.t("token.access_token_expired")});
    }
    return res.status(403).json({ msg: req.t("token.invalid_access_token") });
  }
};

export { accessTokenMiddleware };
