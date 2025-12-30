import express from "express";
import {
  register,
  login,
  getUserProfile,
  updateProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/sign-up", register);
router.post("/login", login);
router.get("/get-profile", verifyToken, getUserProfile);
router.patch(
  "/update-profile",
  verifyToken,
  upload.single("avatar"),
  updateProfile
);

export default router;
