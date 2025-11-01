import { Request, Response } from "express";
import { UserService } from "./../../services/user/userService";
import { ApiResponse } from "../../utils/responseHandler";
import { AuthRequest } from "../../middleware/authMiddleware";
import { UserCollection } from "../../resource/user/userCollection";
import { UserResource } from "../../resource/user/userResource";
const service = new UserService();

export class UserController {
  async index(req: AuthRequest, res: Response) {
    try {
      const{name, email, verification_status, start_date, end_date, page, per_page } = req.query;
      const filter={
        name: name as string | undefined,
        email: email as string | undefined,
        verification_status: verification_status as string | undefined,
        start_date: start_date as string | undefined,
        end_date: end_date as string | undefined,
      }
      const pagination={
        page: page ? parseInt(page as string, 10) : 1,
        per_page: per_page ? parseInt(per_page as string, 10) : 10,
      };
      const data = await service.getAll(filter, pagination);

      if (!data || !data.users) {
        return ApiResponse.error(res, req.t("retrieve_failed"),null, 500);
      }

    return ApiResponse.success(res, req.t("retrieved_successfully"), {
      users: UserCollection.list(data.users),
      pagination: data.pagination,
      total_registered_users: data.total_registered_users,
      total_verified_users: data.total_verified_users,
    });
    } catch (err: any) {
      return ApiResponse.error(res, req.t("retrieve_failed"), null, 500);
    }
  }

  async show(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await service.getById(id);
      // service.getById may return { error: string } — handle that before passing to UserResource
      if (!user || (user as any).error) {
        const message =
          user && (user as any).error
            ? (req.t(`${(user as any).error}`) || req.t("auth.not_found"))
            : req.t("auth.not_found");
        return ApiResponse.error(res, message, null, 404);
      }
      return ApiResponse.success(res, req.t("retrieved_successfully"), UserResource.toResponse(user as any));
    } catch (err: any) {
      return ApiResponse.error(res, req.t("retrieve_failed"), null, 500);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const user = await service.create(req.body, req.user.role);
      return ApiResponse.success(res, req.t("created_successfully"), user);
    } catch (err: any) {
      return ApiResponse.error(res, req.t(`${err.message}`) || req.t("create_failed"), null, 400);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await service.update(id, req.body);
      if (!user || (user as any).error) {
        const message =
          user && (user as any).error
            ? (req.t(`${(user as any).error}`) || req.t("auth.not_found"))
            : req.t("auth.not_found");
        return ApiResponse.error(res, message, null, 200);
      }
      return ApiResponse.success(res, req.t("updated_successfully"), user);
    } catch (err: any) {
      return ApiResponse.error(res, req.t(`${err.message}`) || req.t("update_failed"), null, 400);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const data =await service.delete(id);
      if (data && (data as any).error) {
        const message =
          data && (data as any).error
            ? (req.t(`${(data as any).error}`) || req.t("auth.not_found"))
            : req.t("auth.not_found");
        return ApiResponse.error(res, message, 200);
      }
      return ApiResponse.success(res, req.t("deleted_successfully"));
    } catch (err: any) {
      return ApiResponse.error(res, req.t(`${err.message}`) || req.t("delete_failed"), null, 400);
    }
  }
  async getTop3Users(req: Request, res: Response) {
    try {
      console.log('test');
      const users = await service.getTopUsers();
      if (!users) {
        return ApiResponse.error(res, req.t("retrieve_failed"), null, 400);
      }
      return ApiResponse.success(res, req.t("retrieved_successfully"), users);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
      return ApiResponse.error(res, req.t("retrieve_failed"), null, 400);
    }
  }

  async getInactiveUsers(req: Request, res: Response) {
    try {
      const hours = Number(req.query.hours) || 1;
      const users = await service.getInactiveUsers(hours);
      if (!users) {
        return ApiResponse.error(res, req.t("retrieve_failed"), null, 400);
      }
      return ApiResponse.success(res, req.t("retrieved_successfully"), users);
    } catch (err: any) {
      return ApiResponse.error(res, req.t("retrieve_failed"), null, 400);
    }
  }
  async changeActivation(req: Request, res: Response) {
    const id = Number(req.params.id);

    const result = await service.changeUserActivation(id);

    if ("error" in result) {
      const message =
        typeof (result as any).error === "string"
          ? req.t((result as any).error)
          : req.t("auth.not_found");
      return ApiResponse.error(res, message, 200);
    }

    const message =
      req.t(
        result.message === "user_activated_successfully"
          ? "user_activated_successfully"
          : "user_deactivated_successfully"
      ) || req.t("updated_successfully");

    return ApiResponse.success(res, message);
  }
}
