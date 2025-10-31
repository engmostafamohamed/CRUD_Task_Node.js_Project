import { Response } from "express";

export class ApiResponse {
  static success(res: Response, message: string, data: any = null, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    errors: any = null,
    statusCode: number = 400
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      
    });
  }
}
