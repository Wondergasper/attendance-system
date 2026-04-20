import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { AdminProvider, useAdmin } from './components/context/AdminContext';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import Fingerprint from './pages/Fingerprint';
import RFIDTransmit from './pages/RFIDTransmit';
import Success from './pages/Success';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AttendanceLogs from './pages/admin/AttendanceLogs';
import Students from './pages/admin/Students';
import FlaggedRecords from './pages/admin/FlaggedRecords';
import SettingsPage from './pages/admin/Settings';
import AdminLayout from './components/admin/AdminLayout';

const StudentApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden min-h-[650px] flex flex-col border border-slate-200 dark:border-slate-800">
        <Outlet />
      </div>
    </div>
  );
};

// Admin route wrapper
const AdminRoutes = () => {
  const { isAuthenticated } = useAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="attendance" element={<AttendanceLogs />} />
        <Route path="students" element={<Students />} />
        <Route path="flagged" element={<FlaggedRecords />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
};

function App() {
  return (
    <AdminProvider>
      <AttendanceProvider>
        <Router>
          <Routes>
            {/* Student app routes - mobile container */}
            <Route element={<StudentApp />}>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              
              {/* Private Student Routes */}
              <Route path="/home" element={<StudentProtectedRoute><StudentHome /></StudentProtectedRoute>} />
              <Route path="/fingerprint" element={<StudentProtectedRoute><Fingerprint /></StudentProtectedRoute>} />
              <Route path="/rfid" element={<StudentProtectedRoute><RFIDTransmit /></StudentProtectedRoute>} />
              <Route path="/success" element={<StudentProtectedRoute><Success /></StudentProtectedRoute>} />
            </Route>
            
            {/* Admin routes - full web layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </Router>
      </AttendanceProvider>
    </AdminProvider>
  );
}

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAttendance();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;
