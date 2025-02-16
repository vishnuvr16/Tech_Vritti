import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from "recharts";
import { User, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, credentials);
      setIsAuthenticated(response.data.success);
      if (response.data.success) {
        alert("Login successful");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log("error",error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ email: "", password: "" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Admin</span>
              <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-700">
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Student List</h2>
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-3 border text-center">ID</th>
      <th className="p-3 border text-center">Name</th>
      <th className="p-3 border text-center">Email</th>
      <th className="p-3 border text-center">Resume</th>
      <th className="p-3 border text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {students.map((student) => (
      <tr key={student._id} className="border-t">
        <td className="p-3 border text-center">{student._id.slice(-5)}</td>
        <td className="p-3 border text-center">{student.fullName}</td>
        <td className="p-3 border text-center">{student.email}</td>
        <td className="p-3 border text-center">
          <a href={student.resume} target="_blank" className="text-blue-600 hover:underline">Link</a>
        </td>
        <td className="p-3 border text-center">
          <button
            onClick={() => setSelectedStudent(student)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            View Results
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
        )}

        {selectedStudent && (
          <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold my-6">Quiz Results for {selectedStudent.fullName}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-red-600 hover:underline">
                Close
              </button>
            </div>

            {selectedStudent.quizResults.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedStudent.quizResults}>
                  <XAxis dataKey="createdAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="mt-4 text-gray-600">No quiz results available for this student.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
