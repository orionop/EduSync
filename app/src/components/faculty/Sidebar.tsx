import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileText, Shield, LogOut, Calendar, ClipboardCheck } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          <span>EduSync</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          to="/faculty/dashboard" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/dashboard') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/faculty/marks-calculation" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/marks-calculation') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Calculator className="h-5 w-5" />
          <span>Marks Calculation</span>
        </Link>
        
        <Link 
          to="/faculty/view-results" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/view-results') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>View Results</span>
        </Link>

        <Link 
          to="/faculty/end-semester-evaluation" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/end-semester-evaluation') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <ClipboardCheck className="h-5 w-5" />
          <span>End Semester Evaluation</span>
        </Link>
        
        <Link 
          to="/faculty/proctor-section" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/proctor-section') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Shield className="h-5 w-5" />
          <span>Proctor Section</span>
        </Link>

        <Link 
          to="/faculty/supervisor-duty" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/faculty/supervisor-duty') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Supervisor Duty</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={onLogout}
          className="flex w-full items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;