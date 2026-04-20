import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../components/context/AdminContext';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpCircle,
  Clock,
  Smartphone,
  Calendar,
  Filter
} from 'lucide-react';

const FlaggedRecords = () => {
  const { attendanceLogs, markAsReviewed, escalateRecord } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('unreviewed');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter to only suspicious/reviewed/escalated records
  const flaggedRecords = useMemo(() => {
    return attendanceLogs.filter(log => 
      log.status === 'Suspicious' || 
      log.status === 'Reviewed' || 
      log.status === 'Escalated'
    );
  }, [attendanceLogs]);

  // Apply additional filters
  const filteredRecords = useMemo(() => {
    return flaggedRecords.filter(record => {
      // Search filter
      const matchesSearch = 
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'unreviewed') {
        matchesStatus = record.status === 'Suspicious';
      } else if (statusFilter === 'reviewed') {
        matchesStatus = record.status === 'Reviewed';
      } else if (statusFilter === 'escalated') {
        matchesStatus = record.status === 'Escalated';
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [flaggedRecords, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const styles = {
      Suspicious: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      Reviewed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      Escalated: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    if (status === 'Suspicious') {
      return <AlertTriangle size={18} className="text-amber-500" />;
    }
    if (status === 'Reviewed') {
      return <CheckCircle size={18} className="text-blue-500" />;
    }
    if (status === 'Escalated') {
      return <ArrowUpCircle size={18} className="text-red-500" />;
    }
    return null;
  };

  // Stats
  const unreviewedCount = flaggedRecords.filter(r => r.status === 'Suspicious').length;
  const reviewedCount = flaggedRecords.filter(r => r.status === 'Reviewed').length;
  const escalatedCount = flaggedRecords.filter(r => r.status === 'Escalated').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Flagged Records</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage suspicious attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Unreviewed</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{unreviewedCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Reviewed</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{reviewedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Escalated</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{escalatedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <ArrowUpCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="unreviewed">Unreviewed</option>
              <option value="reviewed">Reviewed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Student Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Device</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Date & Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Reason</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{record.studentName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{record.studentId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Smartphone size={16} />
                        <span className="text-sm">{record.device}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar size={14} />
                          <span>{record.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-500">
                          <Clock size={14} />
                          <span className="font-mono">{record.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                      {record.reason || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {record.status === 'Suspicious' && (
                          <>
                            <button
                              onClick={() => markAsReviewed(record.id)}
                              className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              Mark Reviewed
                            </button>
                            <button
                              onClick={() => escalateRecord(record.id)}
                              className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Escalate
                            </button>
                          </>
                        )}
                        {record.status === 'Reviewed' && (
                          <button
                            onClick={() => escalateRecord(record.id)}
                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Escalate
                          </button>
                        )}
                        {record.status === 'Escalated' && (
                          <span className="text-sm text-slate-400 dark:text-slate-500">Awaiting action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No flagged records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlaggedRecords;