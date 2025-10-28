import express from "express";
import { body } from "express-validator";
import { productController } from "../controllers/productController.js";
import { productVaildation } from "../validations/productValidation.js";
import { isAllowedMiddleware } from "../middlewares/isAllowedMiddleware.js";
import { roleUtlis } from "../utils/roleUtils.js";
// import { upload } from "../config/multer.js";
import { uploadCloudinary } from "../config/cloudinary.js";
import { ProductTranslationsController } from "../controllers/ProductTranslationsController.js";
import { productImgsController } from "../controllers/productImgsController.js";
const productRouter = express.Router({ mergeParams: true });

productRouter.post(
    "/",
    isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER),
    [
        uploadCloudinary.array("img"),
        productVaildation.setStock("stock"),
        productVaildation.setPrice("price"),
        productVaildation.setCategoryId("category_id"),
        productVaildation.setTranslation("translations"),
        productVaildation.setLang("translations.*.lang"),
        productVaildation.setName("translations.*.name"),
        productVaildation.setDescription("translations.*.description")
    ],
    productController.create
)

productRouter.get("/:id", productController.getSingle);
productRouter.get("/", productController.getAll);


productRouter.put("/:id",
    isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER),
    [
        productVaildation.setPrice("price"),
        productVaildation.setCategoryId("category_id"),
        productVaildation.setStock("stock"),
    ], productController.update
);
productRouter.put(
    "/:id/product-translations",
    isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER),
    [
        productVaildation.setTranslation("translations"),
        productVaildation.setLang("translations.*.lang"),
        productVaildation.setName("translations.*.name"),
        productVaildation.setDescription("translations.*.description")
    ], ProductTranslationsController.update
);
productRouter.put(
    "/:id/product-imgs",
    isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER),
    uploadCloudinary.array("img"),
    productImgsController.update
);


productRouter.delete("/:id", isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER), productController.deleteById);
productRouter.delete("/:id/product-imgs/:imgId", isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER), productImgsController.deleteById);

productRouter.delete("/", isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER), productController.deleteAll);
productRouter.delete("/:id/product-translations", isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER), ProductTranslationsController.deleteAll);
productRouter.delete("/:id/product-imgs", isAllowedMiddleware(roleUtlis.ADMIN, roleUtlis.MANGER), productImgsController.deleteAll);


export { productRouter };