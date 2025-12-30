import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    price: { type: Number, default: 0 },

    thumbnail: String,

    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);

export default Course;
