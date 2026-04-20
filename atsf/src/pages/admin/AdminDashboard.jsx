import React from 'react';
import { useAdmin } from '../../components/context/AdminContext';
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AttendanceAnalytics from '../../components/admin/AttendanceAnalytics';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={28} className="text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const {
    getTotalStudents,
    getTodayAttendanceCount,
    getTodayFlaggedCount,
    getActiveSessions,
    getRecentActivity,
    stats,
    loadingData,
    refreshData
  } = useAdmin();

  const cards = [
    { icon: Users,          label: 'Total Students',      value: getTotalStudents(),         color: 'bg-gradient-to-br from-brand-500 to-brand-600'   },
    { icon: ClipboardCheck, label: "Today's Attendance",  value: getTodayAttendanceCount(),  color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { icon: AlertTriangle,  label: 'Flagged Today',       value: getTodayFlaggedCount(),     color: 'bg-gradient-to-br from-amber-500 to-amber-600'    },
    { icon: Activity,       label: 'Present Sessions',    value: getActiveSessions(),        color: 'bg-gradient-to-br from-cyan-500 to-cyan-600'      },
  ];

  const recentActivity = getRecentActivity();

  const getStatusIcon = (status) => {
    if (status === 'Normal')    return <CheckCircle size={18} className="text-emerald-500" />;
    if (status === 'Suspicious') return <XCircle    size={18} className="text-amber-500"   />;
    return                              <Clock      size={18} className="text-slate-400"   />;
  };

  const getStatusBadge = (status) => {
    const map = {
      Normal:     'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      Suspicious: 'bg-amber-100  dark:bg-amber-900/30   text-amber-700   dark:text-amber-400',
      Reviewed:   'bg-blue-100   dark:bg-blue-900/30    text-blue-700    dark:text-blue-400',
      Escalated:  'bg-red-100    dark:bg-red-900/30     text-red-700     dark:text-red-400',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${map[status] || map.Normal}`}>
        {status}
      </span>
    );
  };

  // Real flagging reasons from stats
  const flaggingReasons = stats.flaggingReasons || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of the attendance system</p>
        </div>
        <button
          onClick={refreshData}
          className={`p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${loadingData ? 'animate-spin' : ''}`}
          title="Refresh data"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => <StatCard key={i} {...card} />)}
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <h3 className="font-bold text-slate-800 dark:text-white">System Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">ML Model</span>
              <span className="text-emerald-500 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">API Status</span>
              <span className="text-emerald-500 font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Database</span>
              <span className="text-emerald-500 font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Auth</span>
              <span className="text-emerald-500 font-medium">JWT ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics + Flagging Reasons */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceAnalytics />
        </div>

        {/* Live Flagging Reasons from backend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Flagging Reasons</h3>
          {flaggingReasons.length > 0 ? (
            <div className="space-y-5">
              {flaggingReasons.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="text-slate-800 dark:text-white">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${['bg-amber-500','bg-brand-500','bg-emerald-500'][i % 3]}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-slate-400 dark:text-slate-600">
              <AlertTriangle size={32} className="mb-2" />
              <p className="text-sm">No flagged records yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Monitoring */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Live Monitoring</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time stream of today&apos;s attendance scans</p>
            </div>
          </div>
          <Link
            to="/admin/attendance"
            className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl"
          >
            Full Log
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentActivity.map((record, index) => (
              <div
                key={record.id}
                className={`p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  record.status === 'Suspicious' ? 'bg-red-50/50 dark:bg-red-900/10' :
                  index === 0 ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        {getStatusIcon(record.status)}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-800 dark:text-white">{record.studentName}</p>
                        {index === 0 && (
                          <span className="text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{record.studentId} • {record.device}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">{record.time}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Today</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No attendance scans today</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/attendance" className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-lg transition-all group">
          <ClipboardCheck size={32} className="text-brand-600 dark:text-brand-400 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">View All Logs</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse complete attendance history</p>
        </Link>
        <Link to="/admin/flagged" className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-lg transition-all group">
          <AlertTriangle size={32} className="text-amber-600 dark:text-amber-400 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">Review Flagged</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check suspicious attendance records</p>
        </Link>
        <Link to="/admin/students" className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-lg transition-all group">
          <Users size={32} className="text-emerald-600 dark:text-emerald-400 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Manage Students</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage student accounts</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;