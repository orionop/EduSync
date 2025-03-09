import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DevelopmentNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    setIsClosing(true);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-amber-100/90 border-b border-amber-200 backdrop-blur-sm text-amber-800 dark:bg-amber-900/90 dark:border-amber-800 dark:text-amber-200 px-4 py-3 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium">
              Development Preview — This application is currently in development stage and not ready for production use.
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentNotice;