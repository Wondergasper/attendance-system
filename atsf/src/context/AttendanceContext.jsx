import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDeviceFingerprint } from '../utils/device';

const AttendanceContext = createContext();
const API_URL = 'http://localhost:8000';

export const AttendanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFingerprintVerified, setIsFingerprintVerified] = useState(false);
  const [lastAttendance, setLastAttendance] = useState(null);

  // Load user + token from localStorage on initial load
  useEffect(() => {
    const savedUser  = localStorage.getItem('attendance_user');
    const savedToken = localStorage.getItem('attendance_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          device_id: getDeviceFingerprint()
        })
      });

      const result = await response.json();

      if (response.ok) {
        const userObj = {
          fullName:  result.fullName,
          studentID: result.studentID,
          email:     result.email,
          device:    result.device
        };
        setUser(userObj);
        setToken(result.token);
        setIsAuthenticated(true);
        localStorage.setItem('attendance_user',  JSON.stringify(userObj));
        localStorage.setItem('attendance_token', result.token);
        return { success: true };
      }
      return { success: false, error: result.detail || 'Registration failed' };
    } catch (e) {
      console.error('Signup failed:', e);
      return { success: false, error: 'Connection failed' };
    }
  };

  const login = async (studentID, password) => {
    try {
      const response = await fetch(`${API_URL}/login/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_or_email: studentID, password })
      });

      const result = await response.json();

      if (response.ok) {
        const userObj = {
          fullName:  result.fullName,
          studentID: result.studentID,
          email:     result.email,
          device:    result.device
        };
        setUser(userObj);
        setToken(result.token);
        setIsAuthenticated(true);
        localStorage.setItem('attendance_user',  JSON.stringify(userObj));
        localStorage.setItem('attendance_token', result.token);
        return { success: true };
      }
      return { success: false, error: result.detail || 'Invalid credentials' };
    } catch (e) {
      console.error('Login failed:', e);
      return { success: false, error: 'Connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsFingerprintVerified(false);
    localStorage.removeItem('attendance_user');
    localStorage.removeItem('attendance_token');
  };

  const verifyFingerprint = () => {
    setIsFingerprintVerified(true);
  };

  const recordAttendance = async () => {
    // Compute a normalized clock-in time: seconds-since-midnight / 86400  (0–1 range matching training data)
    const now = new Date();
    const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const clockInTime = secondsSinceMidnight / 86400;

    try {
      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id:      user.studentID,
          device_id:       getDeviceFingerprint(),
          clock_in_time:   clockInTime,
          frequency_score: 0.5  // could be computed from historical data later
        })
      });

      const result = await response.json();
      const timestamp = now.toLocaleTimeString();

      setLastAttendance({
        name:   user.fullName,
        time:   timestamp,
        status: result.status,
        reason: result.reason
      });

      setIsFingerprintVerified(false);
      return { success: result.status === 'PRESENT', ...result, time: timestamp };
    } catch (e) {
      console.error('Attendance recording failed:', e);
      return { success: false, reason: 'Connection failed' };
    }
  };

  return (
    <AttendanceContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isFingerprintVerified,
      lastAttendance,
      signup,
      login,
      logout,
      verifyFingerprint,
      recordAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
