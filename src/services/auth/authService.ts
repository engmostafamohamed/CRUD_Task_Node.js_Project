import { UserRepository } from "../../repository/user/userRepository";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/jwt";

const userRepo = new UserRepository();

export class AuthService {
  async register(data: any) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) return{error:"email_already_exists"};
    data.password = await hashPassword(data.password);

    const user = await userRepo.create(data);
    const token = generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) return{error:"user_not_found"};

    const match = await comparePassword(password, user.password);
    if (!match) return{error:"invalid_credentials"};

    // Log successful login (only log if user id is present)
    if (user.id != null) {
      await userRepo.logLogin(user.id);
    }

    const token = generateToken(user);
    return { user, token };
  }

}
