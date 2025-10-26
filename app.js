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
import { categoryRouter } from './routers/categoryRouter.js';
import { isAllowedMiddleware } from './middlewares/isAllowedMiddleware.js';
import { upload, UPLOADS_FOLDER } from './config/multer.js';
import { asyncWraperMiddleware } from './middlewares/asyncWraperMiddleware.js';
import { httpStatusERROR } from './utils/httpStatusText.js';
import path from "path";
import { fileURLToPath } from "url";
import { deleteCloudinary, uploadCloudinary } from './config/cloudinary.js';
// import { testJob } from './jobs/testJobs.js';


dotenv.config();
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next))
app.use('/uploads', express.static(path.join(__dirname, "uploads")));


/** AUTH */
app.use("/api/change-lang/:lang/auth", langMiddleWare, authRouter);
app.use("/api", googleRouter);
/** PRODUCT */
// app.use("/api/change-lang/:lang/categories", langMiddleWare, gloabalLimiter, categoryRouter);
app.use("/api/change-lang/:lang/categories", langMiddleWare, accessTokenMiddleware, gloabalLimiter, categoryRouter);
app.use("/api/change-lang/:lang/products", langMiddleWare, accessTokenMiddleware, gloabalLimiter, productRouter);

app.post("/upload", upload.array("img"), (req, res) => {
  try {

    res.json({ ok: true, file: req.files.length });

  } catch (error) {
    console.log(error);
    res.json({ ok: true, error: error.message });


  }
})
/** cloudinary */
app.post("/upload-cloudinary", uploadCloudinary.array("img"), (req, res) => {
  try {
    console.log("req.file ", req.files);

    res.json({ ok: true, files: req.files });

  } catch (error) {
    console.log(error);
    res.json({ ok: true, error: error.message });
  }
})
app.delete("/upload-cloudinary/:folder/:publicId", async (req, res) => {
  try {
    const { folder, publicId } = req.params; // هنا بتجيب الجزء بعد /upload-cloudinary/
    const fileName = `${folder}/${publicId}`;
    // console.log("req.params =", req.params);
    console.log("file name =", fileName);

    const result = await deleteCloudinary(fileName);
    res.json({ ok: true, result });
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error: error.message });
  }
});

/**------------------------------------------------------------------------------------ */
app.get("/:lang/test", langMiddleWare, (req, res) => {
  // console.log(req.params); //
  //  { lang: 'en' }


  res.json({
    msg: req.t("validation.name.type")
  })
});
/**------------------------------------------------------------------------------------ */
app.use((req, res, next) => {
  return res.status(404).json({ msg: "not found router" });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    error: error.message
  })
})
/**------------------------------------------------------------------------------------ */













app.listen(port, console.log("server is coneccted"));