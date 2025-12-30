import multer from "multer";
import path from "path";

// 1. Set storage engine (Where to save files temporarily)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    // Save file with a unique name: timestamp + original name
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 2. File filter (Optional: Only allow images and videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and MP4 are allowed."), false);
  }
};

// 3. Initialize Multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB Limit
  fileFilter: fileFilter
});

