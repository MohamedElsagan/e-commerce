import express from "express";
import { body } from "express-validator";
import {productController} from "../controllers/productController.js";
const productRouter = express.Router({mergeParams: true});

productRouter.post(
    "/", 
    [
        body("img")
        .isString()
        .notEmpty(),

        body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid positive number"),

        body("translations")
        .isArray()
        .isLength({min:1}),

        body("translations.*.name")
        .isString()
        .notEmpty()
        .withMessage("Translation name is required"),

        body("translations.*.lang")
        .isIn(["en" , "ar"])
        .withMessage("Invalid language code (must be 'en' or 'ar')"),

        body("translations.*.decription")
        .isString()
        .notEmpty()
        .withMessage("Translation decription is required"),
    ],
    productController.create
)
productRouter.get(
    "/:id",
    productController.getSingle
)
productRouter.get(
    "/",
    productController.getAll
)

export {productRouter};