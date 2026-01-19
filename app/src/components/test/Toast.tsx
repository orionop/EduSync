import React from 'react';
import toast, { Toaster as HotToaster, Toast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

// Custom toast renderer
const CustomToast: React.FC<{ t: Toast; message: string; type: 'success' | 'error' | 'info' | 'warning' }> = ({ 
  t, 
  message, 
  type 
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const backgrounds = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  };

  return (
    <div
      className={`
        ${t.visible ? 'animate-enter' : 'animate-leave'}
        max-w-sm w-full ${backgrounds[type]} border rounded-lg shadow-lg pointer-events-auto
        flex items-center gap-3 px-4 py-3
      `}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom toast functions
export const showToast = {
  success: (message: string) => {
    toast.custom((t) => <CustomToast t={t} message={message} type="success" />, {
      duration: 3000,
    });
  },
  error: (message: string) => {
    toast.custom((t) => <CustomToast t={t} message={message} type="error" />, {
      duration: 4000,
    });
  },
  info: (message: string) => {
    toast.custom((t) => <CustomToast t={t} message={message} type="info" />, {
      duration: 3000,
    });
  },
  warning: (message: string) => {
    toast.custom((t) => <CustomToast t={t} message={message} type="warning" />, {
      duration: 4000,
    });
  },
};

// Custom Toaster component
export const TestToaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  );
};
