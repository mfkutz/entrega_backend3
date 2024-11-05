import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cartDto } from "../dto/cart.dto.js";
import { cartQuantityDto } from "../dto/cart.dto.js";
import { autorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", cartController.addCart);
router.get("/", cartController.getAll);
router.get("/:cid", cartController.getById);
router.post("/:cid/product/:pid", validate(cartQuantityDto), cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/product/:pid", cartController.updateQuantity);
router.delete("/:cid", cartController.emptyCart);
router.delete("/", autorization(["admin"]), cartController.deleteAllCarts);
router.post("/:cid/purchase", cartController.purchase);

export default router;
