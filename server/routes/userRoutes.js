import express from "express";
import { getMe, updateMe, updatePassword } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// 2️⃣ Define a GET route at /me
router.get("/me", verifyToken, authorizeRole("admin", "student"), getMe);

router.patch(
  "/me/update-me",
  verifyToken,
  authorizeRole("admin", "student"),
  upload.single("profilePicture"),
  updateMe
);


router.patch("/me/update-password", verifyToken, updatePassword);

export default router;
