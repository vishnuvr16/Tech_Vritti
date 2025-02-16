import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('quizAnswers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('quizTimeLeft');
    return savedTime ? parseInt(savedTime) : 1800;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(() => {
    const savedVisited = localStorage.getItem('visitedQuestions');
    return new Set(savedVisited ? JSON.parse(savedVisited) : [0]);
  });
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        const newTime = prev - 1;
        localStorage.setItem('quizTimeLeft', newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('visitedQuestions', JSON.stringify([...visitedQuestions]));
  }, [visitedQuestions]);

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

  const handleQuestionChange = (index) => {
    setCurrentQuestion(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const handleNextQuestion = () => {
    const nextIndex = Math.min(currentQuestion + 1, questions.length - 1);
    setCurrentQuestion(nextIndex);
    setVisitedQuestions(prev => new Set([...prev, nextIndex]));
  };

  const handlePreviousQuestion = () => {
    const prevIndex = Math.max(currentQuestion - 1, 0);
    setCurrentQuestion(prevIndex);
    setVisitedQuestions(prev => new Set([...prev, prevIndex]));
  };

  const getQuestionStatus = (index) => {
    const questionId = questions[index]?._id;
    if (!questionId) return 'unvisited';
    if (answers[questionId]) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'unvisited';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit-quiz`, { id, answers });
      // Clear localStorage after submission
      localStorage.removeItem('quizAnswers');
      localStorage.removeItem('quizTimeLeft');
      localStorage.removeItem('visitedQuestions');
      setShowThankYou(true);
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

  const ThankYouModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your quiz has been submitted successfully. We appreciate your participation.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </button>
      </motion.div>
    </div>
  );

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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Question Navigation</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionChange(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'ring-2 ring-offset-2 ring-indigo-500 '
                      : ''
                  } ${
                    getQuestionStatus(index) === 'answered'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : getQuestionStatus(index) === 'visited'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
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
                        answers[questions[currentQuestion]._id] === option.trim().toLowerCase()
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
              onClick={handlePreviousQuestion}
              className={`px-6 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition-colors ${
                currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
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

      <AnimatePresence>
        {showThankYou && <ThankYouModal />}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;