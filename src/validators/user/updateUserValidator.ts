import { body } from "express-validator";

export const updateUserValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage((value, { req }) => req.t("user.name_required")),

  body("email")
    .optional()
    .isEmail()
    .withMessage((value, { req }) => req.t("user.email_invalid")),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("user.password_min_length")),
];
