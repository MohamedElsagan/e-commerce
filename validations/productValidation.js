import { body } from "express-validator"

const productVaildation = {

    setPrice(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.price.empty");
            })
            .isFloat({ min: 0 })
            .withMessage((field, { req }) => {
                return req.t("validation.product.price.invalid");
            })
    },

    setCategoryId (field){
        return body(field)
        .notEmpty()
        .withMessage((field , {req}) =>{
            return req.t("validation.product.category_id.empty")
        })
        .isInt()
        .withMessage((field , {req}) =>{
            return req.t("validation.product.category_id.invalid")
        })
    },

    setTranslation(field) {
        return body(field)
            .isArray()
            .isLength({ min: 1 });
    },

    setName(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.name.empty")
            }
            )
            .isString()
            .withMessage((field, { req }) => {
                return req.t("validation.product.name.empty")
            }
            );
    },

    setLang(field) {
        return body(field)
            .isIn(["en", "ar"])
            .withMessage((field, { req }) => {
                return req.t("validation.language.invalid")
            }
            )
    },

    setDescription(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.description.empty")
            })
            .isString()
    }

}

export {productVaildation};