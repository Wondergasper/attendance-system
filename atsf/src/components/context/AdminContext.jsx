import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext(null);
const API_URL = 'http://localhost:8000';

export function AdminProvider({ children }) {
  const [admin, setAdmin]               = useState(null);
  const [token, setToken]               = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents]         = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [stats, setStats]               = useState({
    totalStudents: 0,
    todayAttendance: 0,
    flaggedToday: 0,
    activeSessions: 0,
    weeklyData: [],
    flaggingReasons: []
  });
  const [settings, setSettings]         = useState({
    attendanceWindowStart: '07:00',
    attendanceWindowEnd: '19:00',
    anomalySensitivity: 'medium'
  });
  const [loadingData, setLoadingData]   = useState(false);

  // ─── Auth headers helper ────────────────────────────────────────────────────
  const authHeaders = (tok) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tok}`
  });

  // ─── Restore session ────────────────────────────────────────────────────────
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const savedToken = localStorage.getItem('admin_token');
    if (savedAdmin && savedToken) {
      try {
        setAdmin(JSON.parse(savedAdmin));
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  // ─── Fetch all admin data (stats + logs + students + settings) ──────────────
  const fetchAdminData = useCallback(async (tok) => {
    if (!tok) return;
    setLoadingData(true);
    try {
      const headers = authHeaders(tok);

      const [statsRes, logsRes, studentsRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`,    { headers }),
        fetch(`${API_URL}/admin/logs`,     { headers }),
        fetch(`${API_URL}/admin/students`, { headers }),
        fetch(`${API_URL}/admin/settings`, { headers }),
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      if (logsRes.ok) {
        const rawLogs = await logsRes.json();
        // Normalize backend status values to frontend display values
        setAttendanceLogs(rawLogs.map(log => ({
          ...log,
          // Map PRESENT → Normal, FLAGGED → Suspicious for display consistency
          status: log.status === 'PRESENT' ? 'Normal'
                : log.status === 'FLAGGED' ? 'Suspicious'
                : log.status
        })));
      }

      if (studentsRes.ok) {
        setStudents(await studentsRes.json());
      }

      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // ─── Poll when authenticated ─────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAdminData(token);
      const interval = setInterval(() => fetchAdminData(token), 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, fetchAdminData]);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_or_email: email, password })
      });

      const result = await response.json();

      if (response.ok) {
        const adminData = { name: result.name, email: result.email, role: result.role };
        setAdmin(adminData);
        setToken(result.token);
        setIsAuthenticated(true);
        localStorage.setItem('admin',       JSON.stringify(adminData));
        localStorage.setItem('admin_token', result.token);
        return { success: true };
      }
      return { success: false, error: result.detail || 'Invalid credentials' };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Connection failed' };
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setAdmin(null);
    setToken(null);
    setIsAuthenticated(false);
    setStudents([]);
    setAttendanceLogs([]);
    localStorage.removeItem('admin');
    localStorage.removeItem('admin_token');
  };

  // ─── Deactivate student (calls backend) ─────────────────────────────────────
  const deactivateStudent = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/admin/students/deactivate/${studentId}`, {
        method: 'POST',
        headers: authHeaders(token)
      });
      if (res.ok) {
        setStudents(prev => prev.map(s =>
          s.studentId === studentId ? { ...s, isActive: 0 } : s
        ));
        return true;
      }
    } catch (err) {
      console.error('Deactivate failed:', err);
    }
    return false;
  };

  // ─── Reactivate student (calls backend) ─────────────────────────────────────
  const reactivateStudent = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/admin/students/reactivate/${studentId}`, {
        method: 'POST',
        headers: authHeaders(token)
      });
      if (res.ok) {
        setStudents(prev => prev.map(s =>
          s.studentId === studentId ? { ...s, isActive: 1 } : s
        ));
        return true;
      }
    } catch (err) {
      console.error('Reactivate failed:', err);
    }
    return false;
  };

  // ─── Update settings (calls backend) ────────────────────────────────────────
  const saveSettings = async (newSettings) => {
    try {
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({
          attendance_window_start: newSettings.attendanceWindowStart,
          attendance_window_end:   newSettings.attendanceWindowEnd,
          anomaly_sensitivity:     newSettings.anomalySensitivity
        })
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        return true;
      }
    } catch (err) {
      console.error('Settings update failed:', err);
    }
    return false;
  };

  // ─── Change password (calls backend) ────────────────────────────────────────
  const changeAdminPassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/admin/change-password`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      const result = await res.json();
      if (res.ok) return { success: true };
      return { success: false, error: result.detail || 'Password change failed' };
    } catch (err) {
      return { success: false, error: 'Connection failed' };
    }
  };

  // ─── Local‑only flagged record actions ──────────────────────────────────────
  const markAsReviewed = (logId) => {
    setAttendanceLogs(prev => prev.map(log =>
      log.id === logId ? { ...log, status: 'Reviewed' } : log
    ));
  };

  const escalateRecord = (logId) => {
    setAttendanceLogs(prev => prev.map(log =>
      log.id === logId ? { ...log, status: 'Escalated' } : log
    ));
  };

  // ─── Computed helpers ────────────────────────────────────────────────────────
  const getTotalStudents       = () => stats.totalStudents;
  const getTodayAttendanceCount = () => stats.todayAttendance;
  const getTodayFlaggedCount    = () => stats.flaggedToday;
  const getActiveSessions       = () => stats.activeSessions;
  const getTodayDateStr         = () => new Date().toISOString().split('T')[0];

  const getRecentActivity = () =>
    attendanceLogs
      .filter(log => log.date === getTodayDateStr())
      .slice(0, 5);

  const getFlaggedRecords = () =>
    attendanceLogs.filter(log =>
      log.status === 'Suspicious' || log.status === 'Reviewed' || log.status === 'Escalated'
    );

  const value = {
    admin,
    token,
    isAuthenticated,
    students,
    attendanceLogs,
    stats,
    settings,
    loadingData,
    login,
    logout,
    saveSettings,
    changeAdminPassword,
    deactivateStudent,
    reactivateStudent,
    markAsReviewed,
    escalateRecord,
    getTotalStudents,
    getTodayAttendanceCount,
    getTodayFlaggedCount,
    getActiveSessions,
    getRecentActivity,
    getFlaggedRecords,
    refreshData: () => fetchAdminData(token)
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}