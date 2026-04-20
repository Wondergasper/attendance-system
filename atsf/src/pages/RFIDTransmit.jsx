import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Wifi, ArrowLeft, Send, CheckCircle, Shield, Lock } from 'lucide-react';

const RFIDTransmit = () => {
  const navigate = useNavigate();
  const { recordAttendance, isFingerprintVerified } = useAttendance();
  const [status, setStatus] = useState('idle');

  if (!isFingerprintVerified && status !== 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Verification Required</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
          Please verify your fingerprint before transmitting RFID data.
        </p>
        <button 
          onClick={() => navigate('/fingerprint')}
          className="btn-primary px-8"
        >
          Go Back to Verify
        </button>
      </div>
    );
  }

  const handleTransmit = async () => {
    setStatus('sending');
    
    // Simulate radio handshake
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await recordAttendance();
    
    if (result.success || result.status === 'PRESENT' || result.status === 'FLAGGED') {
      setStatus('success');
      setTimeout(() => {
        navigate('/success');
      }, 1500);
    } else {
      setStatus('idle');
      alert(result.reason || "Attendance transmission failed.");
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'sending':
        return 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/30';
      case 'success':
        return 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-2xl shadow-green-500/30';
      default:
        return 'bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/10 text-brand-600 dark:text-brand-400 shadow-glow-lg';
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
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ml-2">RFID Transmission</h2>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* RFID Button */}
        <div className="mb-10 relative">
          {status === 'sending' && (
            <>
              <div className="absolute -inset-6 border-2 border-brand-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -inset-10 border border-brand-400 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.2s' }}></div>
            </>
          )}
          
          <button
            onClick={handleTransmit}
            disabled={status !== 'idle'}
            className={`w-40 h-40 rounded-3xl flex items-center justify-center transition-all duration-500 ${getStatusStyles()} 
              ${status === 'idle' ? 'hover:scale-105' : ''} 
              disabled:transform-none`}
          >
            {status === 'sending' ? (
              <Wifi size={56} className="animate-pulse" />
            ) : status === 'success' ? (
              <CheckCircle size={56} />
            ) : (
              <Wifi size={56} />
            )}
          </button>
        </div>
        
        {/* Status Text */}
        <div className="space-y-3 mb-8">
          <h3 className={`text-2xl font-bold transition-colors ${
            status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-white'
          }`}>
            {status === 'idle' && 'Tap to Attend'}
            {status === 'sending' && 'Transmitting...'}
            {status === 'success' && 'Data Sent!'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {status === 'idle' && 'Click below to transmit your unique RFID signal.'}
            {status === 'sending' && 'Your secure RFID signal is being transmitted to the reader.'}
            {status === 'success' && 'Your attendance data has been successfully recorded.'}
          </p>
        </div>
        
        {status === 'idle' && (
          <button 
            onClick={handleTransmit}
            className="btn-primary flex items-center justify-center"
          >
            <Send size={20} className="mr-2" />
            TAP TO ATTEND
          </button>
        )}
      </div>
      
      {/* Security Info */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Shield size={16} className="text-brand-600 dark:text-brand-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your RFID signal is encrypted and tied to your verified device identity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RFIDTransmit;
