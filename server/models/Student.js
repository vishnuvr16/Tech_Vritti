import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    mobile: String,
    qualification: String,
    graduationYear: Number,
    about: String,
    certifications: String,
    projects: String,
    skills: String,
    software: String,
    resume: String,
    experience: Number,
    softSkills: String,
}, { timestamps: true });

const Student = mongoose.model("Student", StudentSchema);

export default Student;