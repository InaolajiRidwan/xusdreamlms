import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import chapterRoutes from "./routes/chapterRoutes.js";

// ... imports ...

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// 1. DEFINE ROUTES FIRST
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/chapter", chapterRoutes);


// 2. START SERVER LAST
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`Server is running! ${PORT}`);
});
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
