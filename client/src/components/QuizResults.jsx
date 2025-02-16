import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResults = () => {
  // Mock data - replace with actual data from your API
  const results = {
    score: 75,
    totalQuestions: 10,
    correctAnswers: 7.5,
    timeSpent: '8:45',
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        correctAnswer: 'paris',
        userAnswer: 'paris',
        options: ['london', 'paris', 'berlin', 'madrid']
      },
      {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        correctAnswer: 'mars',
        userAnswer: 'venus',
        options: ['jupiter', 'mars', 'venus', 'saturn']
      },
      // Add more questions as needed
    ]
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Score Summary Card */}
        <motion.div 
          {...fadeInUp}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Quiz Results</h1>
              <div className="text-xl">Time Spent: {results.timeSpent}</div>
            </div>
          </div>
          
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {results.score}%
                </div>
                <div className="text-gray-600">Overall Score</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {results.correctAnswers}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {results.totalQuestions}
                </div>
                <div className="text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Questions Review */}
        <div className="space-y-6">
          {results.questions.map((question, index) => (
            <motion.div
              key={question.id}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Question {index + 1}: {question.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-lg ${
                            option === question.correctAnswer
                              ? 'bg-green-50 border-2 border-green-500'
                              : option === question.userAnswer && option !== question.correctAnswer
                              ? 'bg-red-50 border-2 border-red-500'
                              : 'bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {question.userAnswer === question.correctAnswer ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                    <div className="mb-2 sm:mb-0">
                      <span className="font-medium text-gray-600">Your Answer: </span>
                      <span className={question.userAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                        {question.userAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Correct Answer: </span>
                      <span className="text-green-600">{question.correctAnswer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div 
          {...fadeInUp} 
          className="flex justify-center gap-4 mt-8"
        >
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Download Results
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResults;