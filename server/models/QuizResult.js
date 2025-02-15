import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  score: { type: Number, required: true },
  results: [
    {
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("QuizResult", QuizResultSchema);
