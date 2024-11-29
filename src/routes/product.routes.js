import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { autorization } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { productDto, updateProductDto } from "../dto/product.dto.js";

const router = Router();

router.post("/", passportCall("jwt"), autorization(["admin"]), validate(productDto), productController.addProduct);
router.put(
  "/:id",
  passportCall("jwt"),
  autorization(["admin"]),
  validate(updateProductDto),
  productController.updateProduct
);
router.get("/:id", productController.getById);
router.delete("/:id", passportCall("jwt"), autorization(["admin"]), productController.deleteProduct);
router.get("/", productController.paginate);

export default router;
