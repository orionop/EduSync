import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Clock,
  CheckSquare,
  GraduationCap,
  LogOut,
  BookOpen,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/student/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      path: '/student/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/student/prerequisites',
      icon: FileText,
      label: 'Prerequisites'
    },
    {
      path: '/student/timetable',
      icon: Clock,
      label: 'Exam Timetable'
    },
    {
      path: '/student/hall-ticket',
      icon: FileCheck,
      label: 'Hall Ticket'
    },
    {
      path: '/student/subjects',
      icon: BookOpen,
      label: 'My Subjects'
    },
    {
      path: '/student/grievances',
      icon: AlertCircle,
      label: 'Grievances'
    },
    {
      path: '/student/results',
      icon: CheckSquare,
      label: 'Results'
    }
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span>EduSync Student</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;