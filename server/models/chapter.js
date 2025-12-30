import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: { type: Number, default: 0 },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
