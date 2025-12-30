import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js"

// ... imports ...

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// 1. DEFINE ROUTES FIRST
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/chapter", chapterRoutes);

app.get("/", (req, res) => {
  res.send(`Server is running!`);
});

// 2. START SERVER LAST
const PORT = process.env.PORT || 5000;
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
