import express from "express";
import { body } from "express-validator";
import { productController } from "../controllers/productController.js";
import { productVaildation } from "../validations/productValidation.js";
const productRouter = express.Router({ mergeParams: true });

productRouter.post(
    "/",
    [
        body("img")
            .isString()
            .notEmpty(),
        productVaildation.setPrice("price"),
        productVaildation.setCategoryId("category_id"),
        productVaildation.setTranslation("translations"),
        productVaildation.setLang("translations.*.lang"),
        productVaildation.setName("translations.*.name"),
        productVaildation.setDescription("translations.*.description")
    ],
    productController.create
)
productRouter.get("/:id",productController.getSingle);
productRouter.get("/",productController.getAll);
productRouter.put("/:id" ,
    [
        body("img")
            .isString()
            .notEmpty(),
        productVaildation.setPrice("price"),
        productVaildation.setCategoryId("category_id"),
        productVaildation.setTranslation("translations"),
        productVaildation.setLang("translations.*.lang"),
        productVaildation.setName("translations.*.name"),
        productVaildation.setDescription("translations.*.description")
    ],productController.update
);
productRouter.delete("/:id", productController.deleteById);
productRouter.delete("/", productController.deleteAll);

export { productRouter };