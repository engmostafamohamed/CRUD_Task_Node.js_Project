import { Router } from "express";
import { AuthController } from "../../controllers/auth/authController";
import { registerValidator, loginValidator } from "../../validators/authValidator";
import { validateRequest } from "../../middleware/validateRequest";
const router = Router();
const controller = new AuthController();

router.post("/register", registerValidator, validateRequest, controller.register);
router.post("/login", loginValidator, validateRequest, controller.login);

export default router;
