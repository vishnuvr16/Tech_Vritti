import express from "express";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizResult from "../models/QuizResult.js";

const router = express.Router();

router.post("/add-questions", async (req, res) => {
    try {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Invalid input format" });
        }

        await QuizQuestion.insertMany(questions);
        res.status(201).json({ message: "Questions added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get 10 random quiz questions
router.get("/questions", async (req, res) => {
    try {
        const questions = await QuizQuestion.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz results
router.post("/submit-quiz", async (req, res) => {
    try {
        const { id: studentId, answers } = req.body;

        console.log("Received answers:", answers); // Debug log

        if (!studentId || !answers || Object.keys(answers).length === 0) {
            return res.status(400).json({ message: "Missing studentId or answers" });
        }

        // Ensure question IDs are strings
        const questionIds = Object.keys(answers).map(id => id.toString());

        // Fetch correct answers from DB
        const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

        let score = 0;
        const results = questions.map(q => {
            const questionId = q._id.toString(); 
            const userAnswer = answers[questionId];

            console.log(`Q: ${q.question} | Correct: ${q.answer} | User: ${userAnswer}`);

            const isCorrect = q.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
            if (isCorrect) score += 1;

            return {
                question: q.question,
                selectedAnswer: userAnswer,
                correctAnswer: q.answer,
                isCorrect
            };
        });

        // Save results to database
        const newResult = new QuizResult({
            studentId,
            score,
            results
        });

        await newResult.save();

        console.log(`Final Score: ${score}`);

        res.status(200).json({ message: "Quiz submitted successfully", score, results });
    } catch (error) {
        console.error("Error in quiz submission:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
