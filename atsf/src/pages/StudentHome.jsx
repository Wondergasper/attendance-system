import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Fingerprint, Smartphone, LogOut, Hash, Shield, Clock } from 'lucide-react';

const StudentHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAttendance();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <Hash size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Student ID</h2>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        {/* Enhanced Virtual ID Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-2xl mb-8 border border-slate-700/50">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-cyan/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Hash size={24} />
              </div>
              <div className="text-right">
                <span className="flex items-center justify-end text-xs text-brand-400 uppercase tracking-widest font-semibold mb-1">
                  <Shield size={12} className="mr-1" />
                  Verified Device
                </span>
                <div className="flex items-center justify-end text-sm text-slate-400">
                  <Smartphone size={14} className="mr-1" />
                  {user?.device}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight">{user?.fullName}</h3>
              <p className="text-brand-400 font-mono tracking-widest text-lg">{user?.studentID}</p>
            </div>
          </div>
        </div>
        
        {/* Action Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <div className="mb-6 p-5 bg-gradient-to-br from-brand-50 to-accent-cyan/10 dark:from-brand-900/20 dark:to-accent-cyan/5 rounded-2xl">
            <Fingerprint size={48} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Ready to mark attendance?</h4>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
            Verification required to prevent impersonation and ensure accurate records.
          </p>
          
          <button 
            onClick={() => navigate('/fingerprint')}
            className="btn-primary flex items-center justify-center"
          >
            <Fingerprint size={20} className="mr-2" />
            Verify Fingerprint
          </button>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Clock size={16} className="text-brand-600 dark:text-brand-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Attendance is recorded once per day. Multiple attempts will be flagged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
