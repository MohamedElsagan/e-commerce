import { body } from "express-validator"

const categoryVaildation = {
    setTranslation(field) {
        return body(field)
            .customSanitizer((value) => {
                if (typeof value === "string") {
                    return JSON.parse(value);
                }
                return value;
            })
            .isArray()
            .isLength();
    },

    setName(field) {
        return body(field)
            .notEmpty()
            .withMessage((field, { req }) => {
                return req.t("validation.category.name.empty")
            }
            )
            .isString()
            .withMessage((field, { req }) => {
                return req.t("validation.category.name.empty")
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
                return req.t("validation.category.description.empty")
            })
            .isString()
    }

}

export { categoryVaildation };