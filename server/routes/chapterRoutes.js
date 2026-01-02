import express from "express";
import {
  createChapter,
  getAllChapter,
} from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create-chapter/:courseId", createChapter);
router.get("/get-all-chapter", getAllChapter);

export default router;
