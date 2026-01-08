import express from "express";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getProfile,
  updateMe,
  updatePassword,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// 2️⃣ Define a GET route at /me

//student
router.get("/me", verifyToken, getMe);

router.patch(
  "/me/update-me",
  verifyToken,
  authorizeRole("admin", "student"),
  upload.single("profilePicture"),
  updateMe
);

router.patch("/me/update-password", verifyToken, updatePassword);

//admin
router.get("/all-users", verifyToken, authorizeRole("admin"), getAllUsers);
router.get("/one-user/:id", verifyToken, authorizeRole("admin"), getProfile)
router.put("/update-user/:id", verifyToken, authorizeRole("admin"), updateUser)
router.delete("/delete-user/:id", verifyToken, authorizeRole("admin"), deleteUser)



export default router;
