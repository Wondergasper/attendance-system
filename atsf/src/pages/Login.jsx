import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Hash, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAttendance();
  const [studentID, setStudentID] = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(studentID, password);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Invalid Student ID or Password');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Welcome Back</h2>
        <p className="text-slate-500 dark:text-slate-400">Sign in to your student portal.</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-8 pb-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center mb-6 text-sm border border-red-100 dark:border-red-800/50">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="input-group">
            <input
              type="text"
              placeholder="Student ID or Email"
              required
              className="input-field pl-12"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
            />
            <Hash className="input-icon" size={20} />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              className="input-field pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock className="input-icon" size={20} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
