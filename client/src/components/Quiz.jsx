// src/components/Quiz.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [String(questionId)]: answer.trim().toLowerCase()
    }));
  };
  

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("userid",id);
      const response  = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit-quiz`, { id, answers });
      alert(`"You got ${response.data.score}`);
      navigate('/');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
    setIsSubmitting(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Skills Assessment Quiz
            </h2>
            <div className="text-xl font-semibold text-indigo-600">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center"
                  >
                    <button
                      onClick={() => handleAnswer(questions[currentQuestion]._id, option)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        answers[questions[currentQuestion]._id] === option
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
              className={`px-6 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition-colors ${
                currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1))}
                className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;