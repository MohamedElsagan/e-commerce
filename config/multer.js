// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const UPLOADS_FOLDER = path.join(__dirname, '../uploads');
// if (!fs.existsSync(UPLOADS_FOLDER))
//     fs.mkdirSync(UPLOADS_FOLDER);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log(file);
        
//         cb(null, UPLOADS_FOLDER);
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split("/")[1];
//         const fileName = `img-${Date.now()}.${ext}`;
//         cb(null, fileName);
//     }
// });

// function fileFilter(req, file, cb) {
//     // const allowed = [
//     //     'image/png', 'image/jpg', 'image/jpeg', 'image/webp',
//     // ];
//     const allowed = [
//         'image/png', 'image/jpg', 'image/jpeg', 'image/webp',
//         'video/mp4', 'video/quicktime',
//         'application/pdf'
//     ];
//     if (allowed.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('file type is not allowed.'), false);
//     }
// }

// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 50 * 1024 * 1024
//     },
//     fileFilter
// });

// export { upload, UPLOADS_FOLDER };

