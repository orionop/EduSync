import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertCircle,
  LogOut,
  GraduationCap,
  Upload,
  Calendar,
  Briefcase
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
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span>EduSync</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/exam-prerequisites"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/exam-prerequisites')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Pre Exam</span>
        </Link>

        <Link
          to="/exam-timetable"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/exam-timetable')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Exam Timetable</span>
        </Link>

        <Link
          to="/results"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/results')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <GraduationCap className="h-5 w-5" />
          <span>Results</span>
        </Link>

        <Link
          to="/kt-section"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/kt-section')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <AlertCircle className="h-5 w-5" />
          <span>KT Section</span>
        </Link>

        <Link
          to="/submissions"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/submissions')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Upload className="h-5 w-5" />
          <span>Submissions</span>
        </Link>

        <Link
          to="/placement-eligibility"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/placement-eligibility')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Briefcase className="h-5 w-5" />
          <span>Placement Eligibility</span>
        </Link>
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