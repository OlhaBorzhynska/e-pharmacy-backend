import { Router } from "express";
import { getProducts, getProductById } from "../controllers/productController";
import { getProductReviews } from "../controllers/productReviewController";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/reviews", getProductReviews);

export default router;
