import { User } from "../../models/userModel";

export class UserResource {
  static toResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: !!user.is_active,
      is_verified: !!user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
