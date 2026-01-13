import express from "express";
import { createLesson } from "../controllers/lessonController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);



router.post("/create-lesson/:chapterId", createLesson);

export default router;
