import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3030;

async function startServer() {
  try {
    // Test DB connection
    await connectDB.query("SELECT 1");
    console.log("Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("ailed to connect to database:", error);
    process.exit(1);
  }
}

startServer();
