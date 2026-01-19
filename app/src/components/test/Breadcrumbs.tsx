import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  'test': 'Home',
  'dashboard': 'Dashboard',
  'exam-prerequisites': 'Exam Prerequisites',
  'exam-timetable': 'Exam Timetable',
  'results': 'Results',
  'kt-section': 'KT Section',
  'submissions': 'Submissions',
  'placement-eligibility': 'Placement Eligibility',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length <= 2 && pathnames.includes('dashboard')) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm">
        <li>
          <Link 
            to="/test/dashboard" 
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathnames.slice(1).map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;
          const label = routeLabels[name] || name;

          return (
            <li key={name} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-slate-300" aria-hidden="true" />
              {isLast ? (
                <span className="font-medium text-slate-800">{label}</span>
              ) : (
                <Link to={routeTo} className="text-slate-500 hover:text-slate-700 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
