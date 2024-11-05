import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

export default router;
