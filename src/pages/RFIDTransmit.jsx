import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';
import { Wifi, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const RFIDTransmit = () => {
  const navigate = useNavigate();
  const { recordAttendance, isFingerprintVerified } = useAttendance();
  const [status, setStatus] = useState('idle'); // idle, sending, success

  // Security check: must have verified fingerprint first
  if (!isFingerprintVerified && status !== 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Required</h2>
        <p className="text-slate-500 mb-8">Please verify your fingerprint before transmitting RFID data.</p>
        <button 
          onClick={() => navigate('/fingerprint')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold"
        >
          Go Back to Verify
        </button>
      </div>
    );
  }

  const handleTransmit = () => {
    setStatus('sending');
    // Simulate RFID transmission
    setTimeout(() => {
      setStatus('success');
      recordAttendance();
      setTimeout(() => {
        navigate('/success');
      }, 1000);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ml-2">RFID Transmission</h2>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-12 relative">
          <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === 'sending' ? 'bg-blue-600 text-white animate-pulse shadow-2xl shadow-blue-500/50' : 
            status === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          }`}>
            {status === 'sending' ? (
              <Wifi size={60} className="animate-ping" />
            ) : status === 'success' ? (
              <CheckCircle size={60} />
            ) : (
              <Wifi size={60} />
            )}
          </div>
          
          {status === 'sending' && (
            <div className="absolute -inset-4 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-2xl font-bold transition-colors ${
            status === 'success' ? 'text-green-600' : 'text-slate-800 dark:text-white'
          }`}>
            {status === 'idle' && 'Tap to Attend'}
            {status === 'sending' && 'Sending...'}
            {status === 'success' && 'Data Sent!'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {status === 'idle' && 'Click the button below to transmit your unique RFID signal.'}
            {status === 'sending' && 'Your secure RFID signal is being transmitted to the reader.'}
            {status === 'success' && 'Your attendance data has been successfully sent.'}
          </p>
        </div>
        
        {status === 'idle' && (
          <button 
            onClick={handleTransmit}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center mt-12"
          >
            <Send size={20} className="mr-2" />
            TAP TO ATTEND
          </button>
        )}
      </div>
    </div>
  );
};

export default RFIDTransmit;
