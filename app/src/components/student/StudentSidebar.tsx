import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck,
  Calendar, 
  Award,
  RefreshCw,
  Upload,
  GraduationCap,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/exam-prerequisites', icon: FileCheck, label: 'Exam Prerequisites' },
    { path: '/student/exam-timetable', icon: Calendar, label: 'Exam Timetable' },
    { path: '/student/results', icon: Award, label: 'Results' },
    { path: '/student/kt-section', icon: RefreshCw, label: 'KT Section' },
    { path: '/student/submissions', icon: Upload, label: 'Submissions' },
    { path: '/student/placement-eligibility', icon: GraduationCap, label: 'Placement Section' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 
          bg-white border-r border-slate-200
          flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center">
            <img 
              src="/images/dark-mode.png" 
              alt="EduSync" 
              className="h-8 w-8 mr-3"
            />
            <div>
              <span className="text-base font-semibold text-slate-800 tracking-tight">EduSync</span>
              <span className="block text-[11px] text-slate-500 -mt-0.5">Student Portal</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={user?.photoUrl || '/images/default-avatar.png'} 
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-slate-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.course} • Sem {user?.semester}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin" role="navigation" aria-label="Main navigation">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
                      ${active 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 text-white/60" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

      </aside>
    </>
  );
};

export default StudentSidebar;
