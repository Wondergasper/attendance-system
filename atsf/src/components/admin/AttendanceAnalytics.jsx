import React from 'react';
import { useAdmin } from '../context/AdminContext';

const AttendanceAnalytics = () => {
  const { stats } = useAdmin();

  // Use real weekly data from backend; fall back to empty 7-day skeleton
  const weeklyData = stats.weeklyData && stats.weeklyData.length > 0
    ? stats.weeklyData
    : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({ day, count: 0 }));

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1); // avoid division by 0

  const totalWeek    = weeklyData.reduce((s, d) => s + d.count, 0);
  const busiestEntry = weeklyData.reduce((a, b) => a.count >= b.count ? a : b, weeklyData[0]);
  const todayFlagged = stats.flaggedToday   || 0;
  const todayPresent = stats.activeSessions || 0;
  const anomalyRate  = todayPresent + todayFlagged > 0
    ? ((todayFlagged / (todayPresent + todayFlagged)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Attendance Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last 7 days — live data from database</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-xs text-slate-500">
            <div className="w-3 h-3 bg-brand-500 rounded-full mr-2"></div>
            <span>Present</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 flex items-end justify-between px-2">
        {/* Y-Axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 -ml-2 translate-y-2">
          <span>{maxCount}</span>
          <span>{Math.round(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        {/* Chart Bars */}
        {weeklyData.map((data, index) => (
          <div key={index} className="relative flex-1 flex flex-col items-center group">
            <div className="w-full max-w-[40px] flex flex-col-reverse items-center gap-1 z-10">
              {/* Present Bar */}
              <div
                className="w-full bg-brand-500/80 rounded-t-lg transition-all duration-700 hover:bg-brand-500 relative"
                style={{ height: `${(data.count / maxCount) * 160}px`, minHeight: data.count > 0 ? '4px' : '0' }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity z-20">
                  {data.count} present
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-4 font-medium">{data.day}</span>
          </div>
        ))}
      </div>

      {/* Footer Info — all computed from live data */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Week Total</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{totalWeek}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Busiest Day</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
              {busiestEntry.count > 0 ? busiestEntry.day : '—'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Today&apos;s Anomaly Rate</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{anomalyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
