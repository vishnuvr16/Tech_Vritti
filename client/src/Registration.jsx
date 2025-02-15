// src/components/AssessmentForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    qualification: '',
    graduationYear: '',
    about: '',
    certifications: '',
    projectDetails: '',
    knownSkills: '',
    knownSoftware: '',
    resume: null,
    experience: '',
    softSkills: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post('/api/submit-assessment', formDataToSend);
      if (response.data.success) {
        navigate('/quiz');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Student Assessment Form
          </h2>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Personal Info</span>
              <span>Education</span>
              <span>Skills & Experience</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                {/* Add more fields for step 1 */}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Education related fields */}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Skills and experience fields */}
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className={`px-6 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition-colors ${
                  currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))}
                  className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentForm;