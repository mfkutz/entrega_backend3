import { Router } from "express";
import { dataMock } from "../controllers/mocks.controller.js";

const router = Router();

router.get("/users/:n", dataMock.createUsers);
router.get("/products/:n", dataMock.createProducts);

export default router;
