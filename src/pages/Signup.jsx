import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Smartphone, Lock, User, Hash } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAttendance();
  const [formData, setFormData] = useState({
    fullName: '',
    studentID: '',
    password: '',
    device: 'iPhone 15 Pro'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signup(formData)) {
      navigate('/login');
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Create Account</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Sign up once to bind your identity to this device.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Student ID (RUN/CMP/22/12888)"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            value={formData.studentID}
            onChange={(e) => setFormData({...formData, studentID: e.target.value})}
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white appearance-none"
            value={formData.device}
            onChange={(e) => setFormData({...formData, device: e.target.value})}
          >
            <option value="iPhone 15 Pro">iPhone 15 Pro</option>
            <option value="Samsung Galaxy S24">Samsung Galaxy S24</option>
            <option value="Google Pixel 8">Google Pixel 8</option>
            <option value="OnePlus 12">OnePlus 12</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors mt-4 shadow-lg shadow-blue-500/30"
        >
          Create Account
        </button>
      </form>
      
      <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Log In</Link>
      </p>
    </div>
  );
};

export default Signup;
