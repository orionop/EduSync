import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SummaryPanelProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  onViewMore?: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  title,
  icon,
  color,
  children,
  onViewMore
}) => {
  // Define color classes based on the color prop
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconText: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-300',
          button: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          iconBg: 'bg-green-100 dark:bg-green-900/30',
          iconText: 'text-green-600 dark:text-green-400',
          title: 'text-green-800 dark:text-green-300',
          button: 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          iconBg: 'bg-purple-100 dark:bg-purple-900/30',
          iconText: 'text-purple-600 dark:text-purple-400',
          title: 'text-purple-800 dark:text-purple-300',
          button: 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
        };
      case 'red':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconText: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-300',
          button: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-gray-100 dark:bg-gray-700',
          iconText: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-800 dark:text-gray-200',
          button: 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        };
    }
  };
  
  const colorClasses = getColorClasses();
  
  return (
    <div className={`rounded-xl shadow-sm border p-4 ${colorClasses.bg} ${colorClasses.border} w-full h-full flex flex-col overflow-hidden`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${colorClasses.iconBg} ${colorClasses.iconText}`}>
            {icon}
          </div>
          <h3 className={`font-medium ${colorClasses.title}`}>{title}</h3>
        </div>
        
        {onViewMore && (
          <button 
            onClick={onViewMore}
            className={`text-sm flex items-center gap-1 ${colorClasses.button}`}
          >
            View More
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SummaryPanel;