import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { autorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", passportCall("jwt"), autorization(["admin"]), userController.deleteUser);
router.put("/:id", userController.updateUser);

export default router;
