import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { googleRouter } from './routers/googleRouter.js';
import cookieParser from 'cookie-parser';
import { productRouter } from './routers/productRoute.js';
import { langMiddleWare } from './middlewares/langMiddleware.js';
import { authRouter } from './routers/authRouter.js';
import { i18next, i18nextMiddleware } from './config/i18n.js';
import { accessTokenMiddleware } from './middlewares/accessTokenMiddleware.js';
import { gloabalLimiter } from './config/rateLimit.js';


dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next))


/** AUTH */
app.use("/api/change-lang/:lang/auth", langMiddleWare, authRouter);
app.use("/api", googleRouter);
/** PRODUCT */
app.use("/api/change-lang/:lang/products", langMiddleWare, accessTokenMiddleware, gloabalLimiter, productRouter);
/**------------------------------------------------------------------------------------ */
app.get("/:lang/test", langMiddleWare, (req, res) => {
  // console.log(req.params); //
  //  { lang: 'en' }

  res.json({
    msg: req.t("validation.name.type")
  })
});
/**------------------------------------------------------------------------------------ */

/**------------------------------------------------------------------------------------ */

app.listen(port, console.log("server is coneccted"));