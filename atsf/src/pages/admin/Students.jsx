import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../components/context/AdminContext';
import {
  Search,
  Users,
  Smartphone,
  Calendar,
  ClipboardCheck,
  Trash2,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Students = () => {
  const { students, deactivateStudent, reactivateStudent } = useAdmin();
  const [searchQuery,      setSearchQuery]      = useState('');
  const [currentPage,      setCurrentPage]      = useState(1);
  const [confirmModal,     setConfirmModal]      = useState(null); // { student, action }
  const [actionLoading,    setActionLoading]     = useState(false);
  const itemsPerPage = 10;

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirm = async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    const { student, action } = confirmModal;
    if (action === 'deactivate') {
      await deactivateStudent(student.studentId);
    } else {
      await reactivateStudent(student.studentId);
    }
    setActionLoading(false);
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage registered student accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
            <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
              {students.length} Total Students
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, student ID, or email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Device</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Date Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Attendance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      student.isActive === 0
                        ? 'opacity-50 bg-slate-50/50 dark:bg-slate-800/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 rounded-xl flex items-center justify-center">
                          <Users size={20} className="text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{student.studentId}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Smartphone size={16} />
                        <span className="text-sm font-mono">{student.device || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{student.dateJoined}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ClipboardCheck size={16} className="text-emerald-500" />
                        <span className="font-medium text-slate-800 dark:text-white">{student.totalAttendance}</span>
                        <span className="text-slate-400 text-sm">records</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.isActive === 0 ? (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {student.isActive !== 0 ? (
                          <button
                            onClick={() => setConfirmModal({ student, action: 'deactivate' })}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Deactivate student"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ student, action: 'reactivate' })}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="Reactivate student"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {students.length === 0 ? 'No students registered yet.' : 'No students match your search.'}
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
                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                confirmModal.action === 'deactivate'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                {confirmModal.action === 'deactivate'
                  ? <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                  : <RotateCcw size={24} className="text-emerald-600 dark:text-emerald-400" />
                }
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {confirmModal.action === 'deactivate' ? 'Deactivate Student' : 'Reactivate Student'}
                </h3>
                <p className="text-sm text-slate-500">This will update the database immediately</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to{' '}
              <span className="font-semibold text-slate-800 dark:text-white">
                {confirmModal.action}
              </span>{' '}
              <span className="font-semibold text-slate-800 dark:text-white">
                {confirmModal.student.name}
              </span>{' '}
              ({confirmModal.student.studentId})?
              {confirmModal.action === 'deactivate'
                ? ' They will no longer be able to mark attendance.'
                : ' They will regain access to mark attendance.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={actionLoading}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className={`flex-1 py-3 px-4 text-white font-medium rounded-xl transition-colors disabled:opacity-50 ${
                  confirmModal.action === 'deactivate'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {actionLoading ? 'Processing...' : (confirmModal.action === 'deactivate' ? 'Deactivate' : 'Reactivate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;