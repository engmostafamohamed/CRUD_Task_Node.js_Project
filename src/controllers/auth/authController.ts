import { Request, Response } from "express";
import { AuthService } from "../../services/auth/authService";
import { ApiResponse } from "../../utils/responseHandler";
import { AuthResource } from "../../resource/auth/authResource";
import { LoginDTO } from "../../dto/auth/loginDTO";
import { RegisterDTO } from "../../dto/auth/registerDTO";

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body;
      
      const result = await service.register(data);
      if (result.error) {
        return ApiResponse.error(res, req.t(result.error), 400);
      }
      
      if (!result.user) {
        return ApiResponse.error(res, req.t("auth.user_not_found"), 400);
      }
      return ApiResponse.success(
        res,
        req.t("auth.register_success"),
        AuthResource.registerResponse(result.user, result.token)
      );
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body;
      const result = await service.login(data.email, data.password);

      if (!result.user) {
        return ApiResponse.error(res, req.t("user_not_found"), 400);
      }

      return ApiResponse.success(
        res,
        req.t("login_success"),
        AuthResource.loginResponse(result.user, result.token)
      );
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
