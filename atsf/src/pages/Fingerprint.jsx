import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Fingerprint as FingerprintIcon, ArrowLeft, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const Fingerprint = () => {
  const navigate = useNavigate();
  const { verifyFingerprint } = useAttendance();
  const [status, setStatus] = useState('idle');
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
            }, 1200);
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

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'from-green-500 to-emerald-500';
      case 'error': return 'from-red-500 to-rose-500';
      case 'scanning': return 'from-brand-500 to-brand-600';
      default: return 'from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'success': return 'text-white';
      case 'error': return 'text-white';
      case 'scanning': return 'text-brand-600 dark:text-brand-400';
      default: return 'text-brand-600 dark:text-brand-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ml-2">Verify Identity</h2>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Fingerprint Button with Progress Ring */}
        <div className="mb-10 relative">
          <svg className="absolute inset-0 w-44 h-44 -rotate-90 pointer-events-none">
            <circle
              cx="88"
              cy="88"
              r="80"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="88"
              cy="88"
              r="80"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
              className={`text-brand-500 transition-all duration-75 ease-linear ${status === 'scanning' ? 'opacity-100' : 'opacity-0'}`}
              strokeLinecap="round"
            />
          </svg>
          
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={status === 'success' || status === 'error'}
            className={`w-36 h-36 rounded-3xl flex items-center justify-center transition-all duration-300 relative z-10 
              bg-gradient-to-br ${getStatusColor()} 
              ${status === 'scanning' ? 'scale-95 shadow-inner' : 'hover:scale-105 shadow-xl'}
              ${status === 'success' ? 'shadow-2xl shadow-green-500/30' : 'shadow-glow-lg'}
              disabled:transform-none`}
          >
            {status === 'scanning' && <div className="scanner-laser"></div>}
            {status === 'success' ? (
              <CheckCircle size={60} className={getIconColor()} />
            ) : status === 'error' ? (
              <AlertCircle size={60} className={getIconColor()} />
            ) : (
              <FingerprintIcon 
                size={56} 
                className={`${getIconColor()} ${status === 'scanning' ? 'animate-pulse' : ''}`} 
              />
            )}
          </button>
        </div>
        
        {/* Status Text */}
        <div className="space-y-3 mb-8">
          <h3 className={`text-2xl font-bold transition-colors ${
            status === 'success' ? 'text-green-600 dark:text-green-400' : 
            status === 'error' ? 'text-red-600 dark:text-red-400' : 
            'text-slate-800 dark:text-white'
          }`}>
            {status === 'idle' && 'Hold to Scan'}
            {status === 'scanning' && 'Analyzing...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Retry Scanning'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {status === 'idle' && 'Press and hold to scan your fingerprint.'}
            {status === 'scanning' && 'Keep holding until complete.'}
            {status === 'success' && 'Identity confirmed. Proceeding to RFID.'}
            {status === 'error' && 'Authentication failed. Try again.'}
          </p>
        </div>
      </div>
      
      {/* Security Info */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Shield size={16} className="text-brand-600 dark:text-brand-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Fingerprint verification prevents students from marking attendance for others.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fingerprint;
