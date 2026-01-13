import express from "express";
import {
  getSingleChapter,
  createChapter,
  getChapterByCourse,
  getAllChapters,
  updateChapter,
  deleteChapter,
} from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/create-chapter/:courseId",
  verifyToken,
  authorizeRole("admin"),
  createChapter
);

router.get(
  "/get-chapter-by-course/:courseId/chapters",
  verifyToken,
  authorizeRole("admin"),
  getChapterByCourse
);

router.get(
  "/get-single-chapter/:chapterId",
  verifyToken,
  authorizeRole("admin"),
  getSingleChapter
);

router.get(
  "/get-all-chapters",
  verifyToken,
  authorizeRole("admin", "users"),
  getAllChapters
);

router.put(
  "/update-chapter/:chapterId",
  verifyToken,
  authorizeRole("admin"),
  updateChapter
);

router.delete(
  "/delete-chapter/:chapterId",
  verifyToken,
  authorizeRole("admin"),
  deleteChapter
);

export default router;
