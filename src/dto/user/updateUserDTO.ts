export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.is_active = data.is_active;
    this.is_verified = data.is_verified;
  }
}
