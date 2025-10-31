import { Validators } from './../../node_modules/express-validator/lib/chain/validators.d';
import { Response, NextFunction } from "express";
import { ApiResponse } from "../utils/responseHandler";
import { AuthRequest } from "./authMiddleware";

export const authorize =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, req.t("validation.forbidden_insufficient_permissions"), 403);
    }
    next();
  };
