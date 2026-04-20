import React from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
      {/* Logo/Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center mb-8 shadow-glow-lg">
        <Fingerprint size={48} className="text-white" />
      </div>
      
      {/* Brand Text */}
      <h1 className="text-4xl font-bold mb-3 text-slate-800 dark:text-white">
        Smart <span className="text-gradient">Attendance</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xs">
        The secure, touchless way to mark your attendance at university.
      </p>
      
      {/* Action Buttons */}
      <div className="w-full space-y-4">
        <Link 
          to="/signup" 
          className="btn-primary flex items-center justify-center"
        >
          Get Started
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link 
          to="/login" 
          className="btn-secondary flex items-center justify-center"
        >
          Log In
        </Link>
      </div>

      {/* Footer hint */}
      <p className="mt-12 text-xs text-slate-400 dark:text-slate-500">
        🔒 Biometric verification • Device binding • Real-time tracking
      </p>
      
      {/* Admin Link */}
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        <Link to="/admin/login" className="hover:text-brand-500 transition-colors">
          Admin Portal →
        </Link>
      </p>
      </div>
    </div>
  );
};

export default Landing;
