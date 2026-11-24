import { Router } from "express";
import { getCustomerReviews } from "../controllers/reviewController";

const router = Router();

router.get("/", getCustomerReviews);

export default router;
