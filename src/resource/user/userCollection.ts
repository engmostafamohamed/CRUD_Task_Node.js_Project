import { User } from "../../models/userModel";
import { UserResource } from "./userResource";

export class UserCollection {
  static paginated(users: User[], total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((u) => UserResource.toResponse(u)),
      pagination: {
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
      },
    };
  }

  static list(users: User[]) {
    return users.map((u) => UserResource.toResponse(u));
  }
}
