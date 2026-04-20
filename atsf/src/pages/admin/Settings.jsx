import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../components/context/AdminContext';
import {
  Settings,
  Lock,
  Clock,
  Gauge,
  LogOut,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, saveSettings, changeAdminPassword, logout, admin, refreshData } = useAdmin();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  '',
  });
  const [settingsForm, setSettingsForm] = useState({
    attendanceWindowStart: settings.attendanceWindowStart || '07:00',
    attendanceWindowEnd:   settings.attendanceWindowEnd   || '19:00',
    anomalySensitivity:    settings.anomalySensitivity    || 'medium',
  });

  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });
  const [pwLoading,   setPwLoading]   = useState(false);
  const [stLoading,   setStLoading]   = useState(false);

  // Keep settingsForm in sync if parent settings load later
  React.useEffect(() => {
    setSettingsForm({
      attendanceWindowStart: settings.attendanceWindowStart || '07:00',
      attendanceWindowEnd:   settings.attendanceWindowEnd   || '19:00',
      anomalySensitivity:    settings.anomalySensitivity    || 'medium',
    });
  }, [settings]);

  // ── Password change ────────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPwLoading(true);
    const result = await changeAdminPassword(passwordForm.currentPassword, passwordForm.newPassword);
    setPwLoading(false);

    if (result.success) {
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMsg({ type: 'error', text: result.error || 'Password change failed' });
    }
  };

  // ── Settings save ──────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setStLoading(true);
    setSettingsMsg({ type: '', text: '' });
    const ok = await saveSettings(settingsForm);
    setStLoading(false);
    if (ok) {
      setSettingsMsg({ type: 'success', text: 'Settings saved to database successfully' });
    } else {
      setSettingsMsg({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sensitivityOptions = [
    { value: 'low',    label: 'Low',    description: 'Only flag obvious anomalies'                         },
    { value: 'medium', label: 'Medium', description: 'Balance between security and false positives'        },
    { value: 'high',   label: 'High',   description: 'Aggressive detection, may flag false positives'      },
  ];

  const MessageBanner = ({ msg }) => msg.text ? (
    <div className={`p-4 rounded-xl flex items-center ${
      msg.type === 'success'
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50'
    }`}>
      {msg.type === 'success'
        ? <CheckCircle size={18} className="mr-2 flex-shrink-0" />
        : <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
      }
      {msg.text}
    </div>
  ) : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure system preferences</p>
        </div>
        <button
          onClick={refreshData}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Refresh data"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Admin Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center">
            <Settings size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{admin?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{admin?.role} • {admin?.email}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Change Password</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Password is verified against the database</p>
          </div>
        </div>

        <MessageBanner msg={passwordMsg} />

        <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
              placeholder="Enter current password"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pwLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {pwLoading ? (
              <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</>
            ) : (
              <><Save size={18} className="mr-2" />Update Password</>
            )}
          </button>
        </form>
      </div>

      {/* Attendance Window */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Attendance Window</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Set valid hours for attendance marking</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
            <input
              type="time"
              value={settingsForm.attendanceWindowStart}
              onChange={(e) => setSettingsForm({ ...settingsForm, attendanceWindowStart: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Time</label>
            <input
              type="time"
              value={settingsForm.attendanceWindowEnd}
              onChange={(e) => setSettingsForm({ ...settingsForm, attendanceWindowEnd: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Anomaly Sensitivity */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <Gauge size={20} className="text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Anomaly Sensitivity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">ML model detection aggressiveness</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensitivityOptions.map((option) => (
            <label
              key={option.value}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settingsForm.anomalySensitivity === option.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="anomalySensitivity"
                value={option.value}
                checked={settingsForm.anomalySensitivity === option.value}
                onChange={(e) => setSettingsForm({ ...settingsForm, anomalySensitivity: e.target.value })}
                className="sr-only"
              />
              <div className="text-center">
                <p className="font-semibold text-slate-800 dark:text-white">{option.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.description}</p>
              </div>
              {settingsForm.anomalySensitivity === option.value && (
                <CheckCircle size={20} className="absolute top-3 right-3 text-brand-500" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Settings message */}
      {settingsMsg.text && (
        <MessageBanner msg={settingsMsg} />
      )}

      {/* Save Settings */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={stLoading}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {stLoading
            ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>
            : <><Save size={18} className="mr-2" />Save Settings</>
          }
        </button>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/30 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <LogOut size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Logout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sign out of your admin account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;