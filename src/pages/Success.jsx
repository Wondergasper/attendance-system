import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { CheckCircle, Clock, User, ArrowRight } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const { lastAttendance } = useAttendance();

  return (
    <div className="flex-1 flex flex-col p-8 text-center justify-center">
      <div className="mb-10 flex justify-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
          <CheckCircle size={56} />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Attendance Recorded</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-12">Thank you! Your presence has been verified and recorded for today's lecture.</p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-4 text-left">
        <div className="flex items-center">
          <User size={20} className="text-blue-500 mr-4" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Student Name</p>
            <p className="text-slate-800 dark:text-white font-semibold">{lastAttendance?.name || 'Loading...'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock size={20} className="text-blue-500 mr-4" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Time Recorded</p>
            <p className="text-slate-800 dark:text-white font-semibold">{lastAttendance?.time || 'Loading...'}</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/home')}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center mt-12 group"
      >
        Done
        <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default Success;
