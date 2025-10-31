import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import userRoutes from "../routes/user/userRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;