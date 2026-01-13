import Chapter from "../models/chapter.js";
import Course from "../models/course.js";

//! create a chapters
export const createChapter = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const { courseId } = req.params;
    console.log(courseId);

    if (!title || !description || !order) {
      return res.status(400).json({
        message: "All field is required",
      });
    }
    const newChapter = new Chapter({
      title,
      description,
      order,
      course: courseId,
    });

    await newChapter.save();
    await Course.findByIdAndUpdate(courseId, {
      $push: { chapters: newChapter._id },
    });
    res.status(201).json({
      message: "chapter sucessfully created",
      newChapter,
    });
  } catch (error) {
    console.log(`Registration Error ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//! get all chapter in a course
export const getChapterByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const chapters = await Chapter.find({ course: courseId });
    if (chapters.length === 0) {
      return res.status(400).json({
        message: "No chapter available for this course",
      });
    }
    res.status(200).json({
      message: "success",
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    console.log(`Registration Error ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//! get single chapter
export const getSingleChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    res.status(200).json({
      message: "chapter retrieved successfully",
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch courses",
      error: error.message,
    });
  }
};

//! get-all-chapters

export const getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find();
    if (chapters.length === 0) {
      return res.status(404).json({
        message: "No chapters available",
      });
    }

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    console.error("Get All Chapters Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


//! updating a chapter



export const updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, description, order } = req.body;

    if (!chapterId) {
      return res.status(400).json({
        message: "Chapter ID is required",
      });
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { title, description, order },
      { new: true, runValidators: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedChapter,
    });
  } catch (error) {
    console.error("Update Chapter Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


//! Delete a chapter



export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findByIdAndDelete(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chapter Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

