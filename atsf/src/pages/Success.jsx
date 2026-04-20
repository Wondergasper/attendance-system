import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { CheckCircle, Clock, User, ArrowRight, Calendar } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const { lastAttendance } = useAttendance();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex-1 flex flex-col p-8 text-center justify-center animate-fade-in">
      {/* Success Icon with Animation */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30 transform rotate-3 relative z-10">
            <CheckCircle size={64} className="text-white" />
          </div>
          {/* Floating Particles */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-50"></div>
          <div className="absolute bottom-4 -left-2 w-3 h-3 bg-emerald-500 rounded-full animate-bounce opacity-40"></div>
          <div className="absolute -top-2 left-6 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 bg-green-400/20 rounded-3xl animate-pulse"></div>
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Attendance Recorded</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs mx-auto">
        Your presence has been verified and recorded for today's lecture.
      </p>
      
      {/* Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft mb-8">
        <div className="space-y-5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mr-4">
              <User size={22} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Student Name</p>
              <p className="text-slate-800 dark:text-white font-semibold text-lg">{lastAttendance?.name || 'Loading...'}</p>
            </div>
          </div>
          
          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-cyan/10 dark:bg-accent-cyan/5 rounded-xl flex items-center justify-center mr-4">
              <Clock size={22} className="text-accent-cyan" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Time Recorded</p>
              <p className="text-slate-800 dark:text-white font-semibold text-lg">{lastAttendance?.time || 'Loading...'}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mr-4">
              <Calendar size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Date</p>
              <p className="text-slate-800 dark:text-white font-semibold text-lg">{today}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Done Button */}
      <button 
        onClick={() => navigate('/home')}
        className="btn-primary flex items-center justify-center group"
      >
        Done
        <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default Success;
