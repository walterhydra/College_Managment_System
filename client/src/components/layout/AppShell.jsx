import React, { useState } from 'react';
import { Menu, X, Bell, User } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AIChatbot from '../AIChatbot';

const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-navy text-white h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-slate-800 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-xl tracking-tight">University ERP</div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            onChange={handleLanguageChange} 
            value={i18n.language}
            className="bg-slate-800 text-white text-sm border-none rounded-md px-2 py-1 outline-none hidden sm:block"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-parulRed rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">
                {user?.profile?.firstName ? `Hi, ${user.profile.firstName}` : `Hi, ${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}`}
              </p>
              <p className="text-xs text-slate-400">
                {user?.profile?.enrollmentNo || user?.email || ''}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity select-none uppercase">
              {user?.profile?.firstName ? user.profile.firstName.charAt(0) : <User size={20} />}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-950 w-64 border-r border-slate-200 dark:border-slate-800 shadow-sm z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <span className="font-bold text-navy dark:text-white">Menu</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1">
              {user && (user.role === 'admin' || user.role === 'staff') ? (
                [
                  { name: 'Admin Dashboard', path: '/' },
                  { name: 'Student Directory', path: '/directory' },
                  { name: 'Attendance Panel', path: '/attendance-panel' },
                  { name: 'Manage Courses', path: '/manage-courses' },
                  { name: 'Grievance Inbox', path: '/grievances-inbox' },
                  { name: 'Audit Logs', path: '/audit-logs' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block px-3 py-2.5 rounded-md hover:bg-parulRed/10 hover:text-parulRed font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {t(item.name)}
                  </Link>
                ))
              ) : (
                [
                  { name: 'Dashboard', path: '/' },
                  { name: 'Profile', path: '/profile' },
                  { name: 'ID Card', path: '/id-card' },
                  { name: 'Timetable', path: '/timetable' },
                  { name: 'Academic Calendar', path: '/calendar' },
                  { name: 'Academics & Study', path: '/academics' },
                  { name: 'Examinations', path: '/exams' },
                  { name: 'Placements & Career', path: '/placements' },
                  { name: 'Internship Portal', path: '/internships' },
                  { name: 'Fees & Finance', path: '/fees' },
                  { name: 'Hostel & Mess', path: '/hostel' },
                  { name: 'Transport', path: '/transport' },
                  { name: 'Helpdesk & Ops', path: '/helpdesk' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block px-3 py-2.5 rounded-md hover:bg-teal/10 hover:text-teal font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {t(item.name)}
                  </Link>
                ))
              )}
            </nav>
            
            <div className="mt-auto pt-6 pb-2 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={logoutUser}
                className="w-full px-3 py-2 text-left rounded-md hover:bg-parulRed/10 hover:text-parulRed font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
      
      {/* Global Floating Components */}
      {user && user.role !== 'admin' && <AIChatbot />}
    </div>
  );
};

export default AppShell;
