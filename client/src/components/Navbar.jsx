import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-cyan-100 hover:text-white transition-all duration-300 flex items-center">
              <span className="mr-2 animate-pulse">✦</span>
              PROYUJ
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <a
              href="/"
              className="group relative px-3 py-2 text-cyan-100 hover:text-white font-medium transition-colors duration-300"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-in-out 
                before:absolute before:top-0 before:left-0 before:w-0.5 before:h-0 before:bg-cyan-400 group-hover:before:h-full before:transition-all before:duration-150 before:delay-300
                after:absolute after:top-0 after:right-0 after:w-0.5 after:h-0 after:bg-cyan-400 group-hover:after:h-full after:transition-all after:duration-150 after:delay-300"></span>
            </a>
            <a
              href="/admin"
              className="group relative px-3 py-2 text-cyan-100 hover:text-white font-medium transition-colors duration-300"
            >
              <span>Admin</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-in-out
                before:absolute before:top-0 before:left-0 before:w-0.5 before:h-0 before:bg-cyan-400 group-hover:before:h-full before:transition-all before:duration-150 before:delay-300
                after:absolute after:top-0 after:right-0 after:w-0.5 after:h-0 after:bg-cyan-400 group-hover:after:h-full after:transition-all after:duration-150 after:delay-300"></span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;