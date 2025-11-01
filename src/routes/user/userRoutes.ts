import { Router } from "express";
import { UserController } from "../../controllers/user/userController";
import { authenticate } from "../../middleware/authMiddleware";
import { authorize } from "../../middleware/roleMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import {createUserValidator,updateUserValidator,userIdValidator,} from "../../validators/user";
const router = Router();
const controller = new UserController();

// Admin only
router.get("/", authenticate, authorize(["admin"]), controller.index);
router.delete("/:id", authenticate, authorize(["admin"]),userIdValidator,validateRequest, controller.delete);

// Both admin & user can create users
router.get("/:id", authenticate,  userIdValidator,validateRequest,controller.show);
// router.post("/", authenticate,createUserValidator,validateRequest, controller.create);
router.put("/:id", authenticate,userIdValidator,updateUserValidator,validateRequest, controller.update);

// Top 3 users by login frequency
router.get("/log/top3", controller.getTop3Users);

// Inactive users (default 1 hour)
router.get("/log/inactive", controller.getInactiveUsers);

router.patch("/:id/activation", controller.changeActivation);
export default router;
