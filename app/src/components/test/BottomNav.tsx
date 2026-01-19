import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Award,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';

interface BottomNavProps {
  onMoreClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onMoreClick }) => {
  const location = useLocation();

  const navItems = [
    { path: '/test/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/test/exam-timetable', icon: Calendar, label: 'Schedule' },
    { path: '/test/results', icon: Award, label: 'Results' },
    { path: '/test/kt-section', icon: RefreshCw, label: 'KT' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-lg
                transition-colors duration-150
                ${active ? 'text-slate-900' : 'text-slate-400'}
              `}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-slate-100' : ''}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-lg text-slate-400"
        >
          <div className="p-1.5 rounded-lg">
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
