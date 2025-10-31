import { body } from "express-validator";

export const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage((value, { req }) => req.t("user.name_required")),

  body("email")
    .notEmpty()
    .withMessage((value, { req }) => req.t("user.email_required"))
    .isEmail()
    .withMessage((value, { req }) => req.t("user.email_invalid")),

  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.t("user.password_required"))
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("user.password_min_length")),
];
