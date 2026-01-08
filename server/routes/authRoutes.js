import express from "express";
import {
  register,
  login,
  // getUserProfile,
  // updateProfile,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import { upload } from "../middleware/multer.js";

const router = express.Router();  

router.post("/sign-up", register);
router.post("/resend-verification", resendVerification);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);





// router.get("/get-profile", verifyToken, getUserProfile);
// router.patch(
//   "/update-profile",
//   verifyToken,
//   upload.single("avatar"),
//   updateProfile
// );

export default router;
