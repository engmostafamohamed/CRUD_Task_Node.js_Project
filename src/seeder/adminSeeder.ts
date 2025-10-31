import connectDB from "../config/database";
import { hashPassword } from "../utils/bcrypt";

const seedAdmin = async () => {
  try {
    const [rows]: any = await connectDB.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    if (rows.length > 0) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashed = await hashPassword("Admin@123");

    await connectDB.query(
      "INSERT INTO users (name, email, password, role, is_active, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
      ["Super Admin", "admin@example.com", hashed, "admin", true, true]
    );

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Admin seeding failed:", err);
    process.exit(1);
  }
};

seedAdmin();
