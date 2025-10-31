export class RegisterDTO {
  name!: string;
  email!: string;
  password!: string;

  constructor(data: any) {
    // if (!data.name) throw new Error("Name is required");
    // if (!data.email) throw new Error("Email is required");
    // if (!data.password) throw new Error("Password is required");

    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
}
