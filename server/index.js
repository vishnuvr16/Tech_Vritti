import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(express.static("public"));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
const PORT = process.env.PORT || 8000;

app.get("/",(req,res)=>{
    res.send("Hello, World!");
})
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
