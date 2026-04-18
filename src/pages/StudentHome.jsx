import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Fingerprint, Smartphone, LogOut, Hash } from 'lucide-react';

const StudentHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAttendance();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Student ID</h2>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        {/* Virtual ID Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 mb-8">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Hash size={24} />
            </div>
            <div className="text-right">
              <span className="text-xs text-white/60 uppercase tracking-widest font-semibold">Verified Device</span>
              <div className="flex items-center justify-end text-sm">
                <Smartphone size={14} className="mr-1" />
                {user?.device}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">{user?.fullName}</h3>
            <p className="text-blue-100 font-mono tracking-widest">{user?.studentID}</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Fingerprint size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Ready to mark attendance?</h4>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Verification required to prevent impersonation.</p>
          
          <button 
            onClick={() => navigate('/fingerprint')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center"
          >
            <Fingerprint size={20} className="mr-2" />
            Verify Fingerprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
