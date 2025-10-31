import { User } from "../../models/userModel";

export class AuthResource {
  static registerResponse(user: User, token: string) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
      },
      token,
    };
  }

  static loginResponse(user: User, token: string) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
      },
      token,
    };
  }
}
