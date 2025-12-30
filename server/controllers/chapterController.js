import Chapter from "../models/chapter.js";
import Course from "../models/course.js";

export const createChapter = async (req, res) => {
  try {
    
    const { title, description, order } = req.body;
    const { courseId } = req.params;
    console.log(courseId)

    if (!title || !description || !order ) {
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
