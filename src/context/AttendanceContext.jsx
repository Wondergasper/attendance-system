import React, { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFingerprintVerified, setIsFingerprintVerified] = useState(false);
  const [lastAttendance, setLastAttendance] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('attendance_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = (userData) => {
    setUser(userData);
    localStorage.setItem('attendance_user', JSON.stringify(userData));
    return true;
  };

  const login = (studentID, password) => {
    if (user && user.studentID === studentID && user.password === password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsFingerprintVerified(false);
  };

  const verifyFingerprint = () => {
    setIsFingerprintVerified(true);
  };

  const recordAttendance = () => {
    const timestamp = new Date().toLocaleTimeString();
    setLastAttendance({
      name: user.fullName,
      time: timestamp
    });
    setIsFingerprintVerified(false); // Reset for next time
    return { name: user.fullName, time: timestamp };
  };

  return (
    <AttendanceContext.Provider value={{
      user,
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
