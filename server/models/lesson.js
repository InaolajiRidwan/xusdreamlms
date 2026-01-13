import mongoose from "mongoose"

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true }, // seconds
    order: { type: Number, default: 0 },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lesson =  mongoose.model("Lesson", LessonSchema);

export default Lesson
