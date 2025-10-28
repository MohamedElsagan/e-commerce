import express from "express";
import { categoryVaildation } from "../validations/categoryValidation.js";
import { body } from "express-validator";
import { categoryController } from "../controllers/categoryController.js";
import { isAllowedMiddleware } from "../middlewares/isAllowedMiddleware.js";
import {roleUtlis} from "../utils/roleUtils.js";
// import { multerMiddleware } from "../middlewares/multerMiddleware.js";
import { uploadCloudinary } from "../config/cloudinary.js";
const categoryRouter = express.Router({ mergeParams: true });

categoryRouter.post(
    "/",
    isAllowedMiddleware(roleUtlis.ADMIN , roleUtlis.MANGER),
    [
        uploadCloudinary.single("url_cloudinary"),
        categoryVaildation.setTranslation("translations"),
        categoryVaildation.setLang("translations.*.lang"),
        categoryVaildation.setName("translations.*.name"),
        categoryVaildation.setDescription("translations.*.description"),
    ],
    categoryController.create
    
)


categoryRouter.get(
    "/:id",
    categoryController.getSingle
)
categoryRouter.get(
    "/",
    categoryController.getAll
)
categoryRouter.put(
    "/:id",
    [
        uploadCloudinary.single("url_cloudinary"),
        categoryVaildation.setTranslation("translations"),
        categoryVaildation.setLang("translations.*.lang"),
        categoryVaildation.setName("translations.*.name"),
        categoryVaildation.setDescription("translations.*.description"),
    ],
    categoryController.update
)
categoryRouter.delete("/:id", isAllowedMiddleware(roleUtlis.ADMIN , roleUtlis.MANGER), categoryController.deleteById);

categoryRouter.delete("/", isAllowedMiddleware(roleUtlis.ADMIN , roleUtlis.MANGER), categoryController.deleteAll);

export { categoryRouter }
