import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Smartphone, Lock, User, Hash, AtSign, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAttendance();
  const [formData, setFormData] = useState({
    fullName:  '',
    studentID: '',
    email:     '',
    password:  '',
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signup({
      full_name:  formData.fullName,
      email:      formData.email,
      student_id: formData.studentID,
      password:   formData.password
    });

    if (result.success) {
      navigate('/home');  // go straight to home after registration
    } else {
      setError(result.error || 'Registration failed. ID or email might already exist.');
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
        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400">Sign up to bind your identity to this device.</p>
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
          {/* Full Name */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="input-field pl-12"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <User className="input-icon" size={20} />
          </div>

          {/* Student ID */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Student ID (e.g., RUN/CMP/22/12888)"
              required
              className="input-field pl-12"
              value={formData.studentID}
              onChange={(e) => setFormData({ ...formData, studentID: e.target.value })}
            />
            <Hash className="input-icon" size={20} />
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="input-field pl-12"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <AtSign className="input-icon" size={20} />
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              className="input-field pl-12"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Lock className="input-icon" size={20} />
          </div>

          {/* Device info notice */}
          <div className="flex items-start p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800/30 text-sm text-brand-700 dark:text-brand-400">
            <Smartphone size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>This device will be securely bound to your account. Attendance can only be marked from this device.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
