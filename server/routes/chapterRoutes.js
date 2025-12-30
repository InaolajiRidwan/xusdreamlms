import express from "express";
import {createChapter}  from "../controllers/chapterController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

 const router = express.Router();

router.post(
  "/create-chapter/:courseId",
  createChapter
);

export default router

