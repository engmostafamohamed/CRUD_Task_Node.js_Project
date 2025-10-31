import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("validation.name_required"),
  body("email")
    .notEmpty()
    .withMessage("validation.email_required")
    .isEmail()
    .withMessage("validation.email_invalid"),
  body("password")
    .notEmpty()
    .withMessage("validation.password_required")
    .isLength({ min: 6 })
    .withMessage("validation.password_min"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("validation.email_required")
    .isEmail()
    .withMessage("validation.email_invalid"),
  body("password")
    .notEmpty()
    .withMessage("validation.password_required"),
];
