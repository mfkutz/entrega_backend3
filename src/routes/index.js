import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import mocks from "./mocks.router.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/cart", passportCall("jwt"), cartRoutes);
router.use("/mocks", mocks);

export default router;
