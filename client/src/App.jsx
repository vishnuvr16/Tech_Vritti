import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import Registration from './components/Registration';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;