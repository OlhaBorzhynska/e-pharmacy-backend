import { Router } from "express";
import {
  getCart,
  updateCart,
  checkoutCart,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, getCart);
router.put("/update", authenticate, updateCart);
router.post("/checkout", authenticate, checkoutCart);

export default router;
