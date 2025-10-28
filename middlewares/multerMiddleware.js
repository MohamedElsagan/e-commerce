// import { upload } from "../config/multer.js";

// const multerMiddleware = (fieldName) => {
//   return [
//     upload.single(fieldName), // multer middleware هيتنفذ أول
//     (req, res, next) => {
//       console.log(req.file); // هنا req.file موجود بعد multer
//       if (!req.file) {

//         // return req.file = null;
//         // return res.status(400).json({ error: "Please Upload File" });
//       }
//       next();
//     }
//   ];
// };

// export { multerMiddleware };
