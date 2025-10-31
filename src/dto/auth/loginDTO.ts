export class LoginDTO {
  email!: string;
  password!: string;

  constructor(data: any) {
    // if (!data.email) throw new Error("Email is required");
    // if (!data.password) throw new Error("Password is required");

    this.email = data.email;
    this.password = data.password;
  }
}
