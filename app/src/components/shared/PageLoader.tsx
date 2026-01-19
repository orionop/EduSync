import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
