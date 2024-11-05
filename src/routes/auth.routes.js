import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authDto } from "../dto/auth.dto.js";
import { userDto } from "../dto/user.dto.js";

const router = Router();

router.post("/login", validate(authDto), passportCall("login"), authController.login);
router.post("/register", validate(userDto), passportCall("register"), authController.register);
router.get("/current", passportCall("jwt"), authController.current);
router.get("/logout", passportCall("jwt"), authController.logout);

export default router;
