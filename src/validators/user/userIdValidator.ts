import { param } from "express-validator";

export const userIdValidator = [
  param("id")
    .notEmpty()
    .withMessage((value, { req }) => req.t("user.id_required"))
    .isInt({ gt: 0 })
    .withMessage((value, { req }) => req.t("user.id_invalid")),
];
