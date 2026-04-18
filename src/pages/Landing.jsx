import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
        <User size={40} className="text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Smart Attendance</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-12">The secure way to mark your attendance at university.</p>
      
      <div className="w-full space-y-4">
        <Link 
          to="/signup" 
          className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Get Started
        </Link>
        <Link 
          to="/login" 
          className="block w-full py-4 border border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Landing;
