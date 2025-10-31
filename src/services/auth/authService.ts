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
    if (!user) return{error:"invalid_credentials"};

    const match = await comparePassword(password, user.password);
    if (!match) return{error:"invalid_credentials"};

    const token = generateToken(user);
    return { user, token };
  }
}
