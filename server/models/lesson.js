const mongoose = require("mongoose");

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

module.exports = mongoose.model("Lesson", LessonSchema);
