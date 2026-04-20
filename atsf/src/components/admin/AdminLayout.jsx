import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  ChevronLeft
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/attendance', icon: ClipboardList, label: 'Attendance Logs' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/flagged', icon: AlertTriangle, label: 'Flagged Records' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col glass transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:flex`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Shield size={22} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white">Admin</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <ChevronLeft size={20} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={22} />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {sidebarOpen && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="font-medium text-slate-800 dark:text-white text-sm">{admin?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{admin?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center w-full py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
              sidebarOpen ? 'px-4' : 'px-0'
            }`}
          >
            <LogOut size={22} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">Admin</span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={22} />
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="font-medium text-slate-800 dark:text-white text-sm">{admin?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{admin?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={22} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 relative overflow-hidden ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Background decorative blobs */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sticky top-0 z-30">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-slate-800 dark:text-white">Admin Dashboard</span>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children || <Outlet />}
        </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;