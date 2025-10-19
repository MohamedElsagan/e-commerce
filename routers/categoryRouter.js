import express from "express";
import { categoryVaildation } from "../validations/categoryValidation.js";
import { body } from "express-validator";
import { categoryController } from "../controllers/categoryController.js";
const categoryRouter = express.Router({ mergeParams: true });

categoryRouter.post(
    "/",
    [
        body("img")
            .isString()
            .notEmpty(),
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
        body("img")
            .isString()
            .notEmpty(),
        categoryVaildation.setTranslation("translations"),
        categoryVaildation.setLang("translations.*.lang"),
        categoryVaildation.setName("translations.*.name"),
        categoryVaildation.setDescription("translations.*.description"),
    ],
    categoryController.update
)
categoryRouter.delete("/:id", categoryController.deleteById);

categoryRouter.delete("/", categoryController.deleteAll);

export {categoryRouter}
