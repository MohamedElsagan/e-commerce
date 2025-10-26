import { body } from "express-validator"

const productVaildation = {

    setPrice(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.price.empty");
            })
            .isFloat({ min: 1 })
            .withMessage((field, { req }) => {
                return req.t("validation.product.price.invalid");
            })
            .toFloat()
    },

    setCategoryId(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.category_id.empty")
            })
            .isInt({ min: 1 })
            .withMessage((field, { req }) => {
                return req.t("validation.product.category_id.invalid")
            })
            .toInt()

    },
    setStock(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.product.category_id.empty")
            })
            .isInt({ min: 1 })
            .withMessage((field, { req }) => {
                return req.t("validation.product.category_id.invalid")
            })
            .toInt()

    },

    setTranslation(field) {
        return body(field)
            .customSanitizer((value) => {
                if (typeof value === "string")
                    return JSON.parse(value);
                return value;
            })
            .isArray()
            .custom((value) => {
                if (!Array.isArray(value)) {
                    throw new Error("Translations must be an array");
                }

                if (value.length < 2) {
                    throw new Error("Translations must contain at least 2 items");
                }

                if (value.length > 2) {
                    throw new Error("Translations cannot contain more than 2 items");
                }

                return true;
            });
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

export { productVaildation };