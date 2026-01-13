import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js"; //
import { authorizeRole } from "../middleware/roleMiddleware.js"; //
import {
  createCourse,
  deleteCourseWithChapters,
  getAllCourse,
  getOneCourse,
  updateCourse,
  uploadCourseThumbnail,
} from "../controllers/courseController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Define which files we expect from Postman
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// The route definition
router.post(
  "/create-course",
  verifyToken,
  authorizeRole("admin"),
  cpUpload,
  createCourse
);

router.get(
  "/get-all-course",
  verifyToken,
  authorizeRole("admin", "student"),
  getAllCourse
);


router.get(
  "/one-course/:id",
  verifyToken,
  authorizeRole("admin", "student"),
  getOneCourse
);

router.patch(
  "/update-course/:id",
  verifyToken,
  authorizeRole("admin"),
  updateCourse
);

router.post(
  "/update-course-media",
  verifyToken,
  authorizeRole("admin"),
  uploadCourseThumbnail
);


router.delete(
  "/delete-course/:id",
  verifyToken,
  authorizeRole("admin"),
  deleteCourseWithChapters
);

export default router;
