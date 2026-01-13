import Lesson from "../models/lesson.js";


export const createLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Lesson video is required" });
    }

    const lesson = await Lesson.create({
      title,
      description,
      chapter: chapterId,
      order,
      videoUrl: req.file.path,
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

