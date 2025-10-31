import { UserRepository } from "../../repository/user/userRepository";
import { hashPassword } from "../../utils/bcrypt";
import { User } from "../../models/userModel";

const repo = new UserRepository();

export class UserService {
  async getAll(
    filters: any,
    pagination: { page: number; per_page: number }
  ): Promise<{ users: User[]; pagination: any;total_registered_users: number;
    total_verified_users: number;}> {
      const usersData = await repo.findAll(filters, pagination);
      const stats = await repo.getUserStats();

    return {
      users: usersData.data,
      pagination: usersData.pagination,
      total_registered_users: stats.total_registered,
      total_verified_users: stats.total_verified,
    };
  }
  async getTopUsers() {
    return await repo.getTopUsersByLoginFrequency();
  }

  async getInactiveUsers(hours = 1) {
    return await repo.getInactiveUsers(hours);
  }

  async getById(id: number) {
    const user = await repo.findById(id);
    if (!user) return { error: "user_not_found" };
    return user;
  }

  async create(data: any, creatorRole: string) {
    // Force role assignment if creator is not admin
    if (creatorRole !== "admin") {
      data.role = "user";
    }

    // Check for duplicate email
    const existing = await repo.findByEmail(data.email);
    if (existing) return { error: "email_already_exists" };

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await repo.create({ ...data, password: hashedPassword });

    // Don’t return password
    delete (user as any).password;

    return user;
  }

  async update(id: number, data: any) {
    const user = await repo.findById(id);
    if (!user) return { error: "user_not_found" };

    // If password update is requested, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    return repo.update(id, data);
  }

  async delete(id: number) {
    const user = await repo.findById(id);
    if (!user) return { error: "user_not_found" };

    await repo.softDelete(id);
    return { success: true };
  }
}
