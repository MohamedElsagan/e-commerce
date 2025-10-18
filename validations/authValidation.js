import { body } from "express-validator";
import { UserModel } from "../models/userModel.js";

// REGISTER
const setName = (field) => {
    return body(field)
      .notEmpty().withMessage((value, { req }) => req.t("validation.name.empty"))
      .isString().withMessage((value, { req }) => req.t("validation.name.type"))
      .isLength({ min: 3 }).withMessage((value, { req }) => req.t("validation.name.min"))
      .isLength({ max: 9 }).withMessage((value, { req }) => req.t("validation.name.max"))
      .escape();
}


const setEmail = (field) => {
    return body(field)
      .notEmpty().withMessage((value, { req }) => req.t("validation.email.empty"))
      .isEmail().withMessage((value, { req }) => req.t("validation.email.invalid"))
      .custom(async (field, { req }) => {
        if (await UserModel.findEmail({email:field})) {
          throw new Error(req.t("validation.email.exists"));
        }
        return true;
      })
      .normalizeEmail();

}

const setPassword = (field) => {
    return body(field)
      .notEmpty().withMessage((value, { req }) => req.t("validation.password.empty"))
      .isLength({ min: 8 }).withMessage((value, { req }) => req.t("validation.password.short"))
      .isLength({ max: 16 }).withMessage((value, { req }) => req.t("validation.password.long"))
      .escape();

}

// LOGIN
const checkEmail = (field)=>{
    return body(field)
    .notEmpty().withMessage((value ,{req}) => req.t("validation.email.empty"))
    .isEmail().withMessage((value ,{req}) => req.t("validation.email.invalid"))
    .escape()
    .escape()
    .custom(async(field , {req})=>{
        if (!await UserModel.findEmail({email:field })) throw new Error(req.t("validation.email.invalid"))
        return true;
    })
    .normalizeEmail();
}

const checkPassword = (field) =>{
    return body(field)
    .notEmpty().withMessage((value, { req }) => req.t("validation.password.empty"))
    .escape();
}



export{setName ,setEmail,setPassword ,checkEmail ,checkPassword};

