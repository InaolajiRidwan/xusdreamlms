import cloudinary from "../config/cloudinary.js";
import Course from "../models/course.js";
import fs from "fs";


export const createCourse = async (req, res) => {
  
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({
        message: "All field is required",
      });
    }
    let thumbnailUrl = "";
    let videoUrl = "";

    // 1. Handle Thumbnail Upload (Image)
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "lms/courses/thumbnails",
      });
      thumbnailUrl = imageResult.secure_url;
      fs.unlinkSync(imageFile.path); // Clean up
    }

    

    const newCourse = new Course({
      title,
      description,
      price,
      thumbnail: thumbnailUrl,
      video: videoUrl, 
      instructor: req.user._id,
      isPublished: true,
    });



    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const allProductduct = await Course.find();
    if (allProductduct.length === 0) {
      return res.status(200).json({
        message: "No available product",
      });
    }
    res.status(200).json({
      message: "success",
      allProductduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch courses",
      error: error.message,
    });
  }
};

export const getOneCourse = async (req, res) => {
  
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    res.status(200).json({
      message: "course retrieved successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch courses",
      error: error.message,
    });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    // 1. Get ID from URL instead of body
    const { id } = req.params; 

    const coursedeleted = await Course.findByIdAndDelete(id);

    if (!coursedeleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course successfully deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};



// PATCH /:id - Update course info
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // We use { new: true } to return the updated document
    // We use runValidators to ensure the new data follows schema rules
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// POST /:id/upload-media (Handles Thumbnails OR Videos)
export const uploadCourseThumbnail = async (req, res) => {
  try {
    // 1️⃣ Check if a file was uploaded
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    // 2️⃣ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "lms/courses/thumbnails",
      resource_type: "image", // always image
    });

    // 3️⃣ Update course thumbnail
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { thumbnail: result.secure_url },
      { new: true }
    );

    // 4️⃣ Delete temp file from server
    fs.unlinkSync(req.file.path);

    // 5️⃣ Send response
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
