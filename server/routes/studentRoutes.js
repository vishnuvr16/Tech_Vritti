import express from "express";
import Student from "../models/Student.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Register a student
router.post("/register", upload.single("resume"), async (req, res) => {
    try {
        const { fullName, email, mobile, qualification, graduationYear, about, certifications, projectDetails, knownSkills, knownSoftware, experience, softSkills } = req.body;

        const student = new Student({
            fullName,
            email,
            mobile,
            qualification,
            graduationYear,
            about,
            certifications,
            projectDetails,
            knownSkills,
            knownSoftware,
            resume: req.file ? req.file.path : null, 
            experience,
            softSkills
        });

        await student.save();
        res.status(201).json({ message: "Student registered successfully!" ,studentId: student._id,success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get("/", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

export default router;
