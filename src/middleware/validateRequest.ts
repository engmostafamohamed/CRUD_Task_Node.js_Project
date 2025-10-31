import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/responseHandler";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const translatedErrors = errors.array().map((err) => req.t(err.msg));
    return ApiResponse.error(res, req.t("validation.failed"), translatedErrors, 422);
  }
  next();
};
