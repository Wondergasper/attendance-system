import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Fingerprint as FingerprintIcon, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Fingerprint = () => {
  const navigate = useNavigate();
  const { verifyFingerprint } = useAttendance();
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (status === 'scanning') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            setTimeout(() => {
              verifyFingerprint();
              navigate('/rfid');
            }, 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [status, verifyFingerprint, navigate]);

  const handleMouseDown = () => {
    if (status === 'idle') {
      setStatus('scanning');
    }
  };

  const handleMouseUp = () => {
    if (status === 'scanning') {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ml-2">Verify Identity</h2>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-12 relative">
          {/* Progress ring */}
          <svg className="absolute -inset-4 w-44 h-44 -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="80"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="88"
              cy="88"
              r="80"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
              className="text-blue-600 transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
              status === 'success' ? 'bg-green-500 text-white' : 
              status === 'error' ? 'bg-red-500 text-white' : 
              'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            } ${status === 'scanning' ? 'scale-95 shadow-inner' : 'hover:scale-105 shadow-xl shadow-blue-500/10'}`}
          >
            {status === 'success' ? (
              <CheckCircle size={60} />
            ) : status === 'error' ? (
              <AlertCircle size={60} />
            ) : (
              <FingerprintIcon size={60} className={status === 'scanning' ? 'animate-pulse' : ''} />
            )}
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-2xl font-bold transition-colors ${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 
            'text-slate-800 dark:text-white'
          }`}>
            {status === 'idle' && 'Hold to Scan'}
            {status === 'scanning' && 'Analyzing...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Retry Scanning'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {status === 'idle' && 'Press and hold the circle to begin scanning your fingerprint.'}
            {status === 'scanning' && 'Keep holding until the process is complete.'}
            {status === 'success' && 'Identity confirmed. Proceeding to RFID transmission.'}
            {status === 'error' && 'Authentication failed. Please hold firmly and try again.'}
          </p>
        </div>
      </div>
      
      <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center border border-slate-100 dark:border-slate-800 text-sm">
        <AlertCircle size={18} className="text-blue-500 mr-3 flex-shrink-0" />
        <p className="text-slate-600 dark:text-slate-400">Fingerprint authentication prevents students from marking attendance for others.</p>
      </div>
    </div>
  );
};

export default Fingerprint;
