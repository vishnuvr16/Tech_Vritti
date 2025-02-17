import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Upload, AlertCircle } from 'lucide-react';


const Registration = () => {
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
  const [errors, setErrors] = useState({});
  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      if (!formData.about) newErrors.about = 'About is required';
    } else if (step === 2) {
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    } else if (step === 3) {
      if (!formData.knownSkills) newErrors.knownSkills = 'Technical skills are required';
      // if (!formData.resume) newErrors.resume = 'Resume is required';
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData",formData);
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/students/register`, formDataToSend);
        if (response.data.success) {
          navigate(`/quiz/${response.data.studentId}`);
        }
      } catch (error) {
        setErrors({ submit: 'Error submitting form. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Student Registration Form
            </h1>
            
            <div className="mt-6 space-y-2">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className={currentStep >= 1 ? 'text-indigo-600 font-medium' : ''}>
                  Personal Info
                </span>
                <span className={currentStep >= 2 ? 'text-indigo-600 font-medium' : ''}>
                  Education
                </span>
                <span className={currentStep >= 3 ? 'text-indigo-600 font-medium' : ''}>
                  Skills & Experience
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.mobile ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+91 (555) 000-0000"
                        />
                        {errors.mobile && (
                          <p className="text-sm text-red-500">{errors.mobile}</p>
                        )}
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          About You
                        </label>
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Qualification
                        </label>
                        <select
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.qualification ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Qualification</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's">Bachelor's</option>
                          <option value="Master's">Master's</option>
                          <option value="PhD">PhD</option>
                        </select>
                        {errors.qualification && (
                          <p className="text-sm text-red-500">{errors.qualification}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Graduation Year
                        </label>
                        <input
                          type="number"
                          name="graduationYear"
                          min="2000"
                          max="2030"
                          value={formData.graduationYear}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="YYYY"
                        />
                        {errors.graduationYear && (
                          <p className="text-sm text-red-500">{errors.graduationYear}</p>
                        )}
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Certifications
                        </label>
                        <textarea
                          name="certifications"
                          value={formData.certifications}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
                          placeholder="List your professional certifications..."
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Project Details
                        </label>
                        <textarea
                          name="projectDetails"
                          value={formData.projectDetails}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-40"
                          placeholder="Describe your key projects..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Technical Skills
                        </label>
                        <textarea
                          name="knownSkills"
                          value={formData.knownSkills}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                            errors.knownSkills ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="List your technical skills (e.g., Programming languages, frameworks)..."
                        />
                        {errors.knownSkills && (
                          <p className="text-sm text-red-500">{errors.knownSkills}</p>
                        )}
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Known Software
                        </label>
                        <textarea
                          name="knownSoftware"
                          value={formData.knownSoftware}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          placeholder="List software tools you're proficient in..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Experience (years)
                        </label>
                        <input
                          type="number"
                          name="experience"
                          min="0"
                          max="50"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Years of experience"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Soft Skills
                        </label>
                        <textarea
                          name="softSkills"
                          value={formData.softSkills}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          placeholder="Communication, leadership, etc..."
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Resume
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            name="resume"
                            onChange={handleInputChange}
                            accept=".pdf,.doc,.docx"
                            className={`w-full file:mr-4 file:py-2 file:px-4 
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-indigo-50 file:text-indigo-700
                              hover:file:bg-indigo-100
                              ${errors.resume ? 'border-red-500' : ''}`}
                          />
                          {errors.resume && (
                            <p className="text-sm text-red-500 mt-1">{errors.resume}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.submit}</p>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Submit
                    <Upload className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;