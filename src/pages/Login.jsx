import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Hash, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAttendance();
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(studentID, password)) {
      navigate('/home');
    } else {
      setError('Invalid Student ID or Password');
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Welcome Back</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your student portal.</p>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center mb-6 text-sm border border-red-100 dark:border-red-900/50">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Student ID"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors mt-4 shadow-lg shadow-blue-500/30"
        >
          Login
        </button>
      </form>
      
      <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
        Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
