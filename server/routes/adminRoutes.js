import express from "express";
import Student from "../models/Student.js";
import QuizResult from "../models/QuizResult.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if email exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
          return res.status(401).json({ message: "Invalid credentials", success: false });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials", success: false });
      }

      // Generate and send JWT
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({ message: "Logged in successfully", token, success: true }); // Ensure function exits here

  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error", success: false });
  }
});

// Admin registration
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    // Generate and send JWT
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  });

// Get all students and their quiz results
router.get("/students", async (req, res) => {
    try {
      const students = await Student.find();
      const studentData = await Promise.all(
        students.map(async (student) => {
          const results = await QuizResult.find({ studentId: student._id });
          return { ...student.toObject(), quizResults: results };
        })
      );
      res.json(studentData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Get quiz results
router.get("/quiz-results", async (req, res) => {
    try {
        const results = await QuizResult.find().populate("studentId");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
