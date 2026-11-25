import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
  logoutUser,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-info", authenticate, getUserInfo);
router.get("/logout", authenticate, logoutUser);

export default router;
