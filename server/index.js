import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import lessonRoute from "./routes/lessonRoute.js";

// ... imports ...

const app = express();

//enable express to automatically pass incoming json data in req.body
app.use(express.json());

// app.use(cors());
// to enable cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:5173", // Your Frontend URL
    credentials: true, // Allow cookies (Refresh Token) --- for sending cookies fron frontend to backend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// 1. DEFINE ROUTES FIRST
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/chapter", chapterRoutes);
app.use("/api/v1/lesson", lessonRoute);

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
