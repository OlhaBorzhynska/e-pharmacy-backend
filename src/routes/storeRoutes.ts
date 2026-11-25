import { Router } from "express";
import { getStores, getNearestStores } from "../controllers/storeController";

const router = Router();

router.get("/nearest", getNearestStores);
router.get("/", getStores);

export default router;
