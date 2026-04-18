import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import Fingerprint from './pages/Fingerprint';
import RFIDTransmit from './pages/RFIDTransmit';
import Success from './pages/Success';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAttendance();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fingerprint"
        element={
          <ProtectedRoute>
            <Fingerprint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rfid"
        element={
          <ProtectedRoute>
            <RFIDTransmit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AttendanceProvider>
      <Router>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </AttendanceProvider>
  );
}

export default App;
