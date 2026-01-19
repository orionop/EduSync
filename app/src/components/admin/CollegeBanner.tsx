import React from 'react';

interface CollegeBannerProps {
  collegeName?: string;
  logoUrl?: string;
}

const CollegeBanner: React.FC<CollegeBannerProps> = ({ 
  collegeName = 'EdVantage University', 
  logoUrl = '/images/uni-logo.png'
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-600/90 to-purple-800/90 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt={`${collegeName} Logo`} 
            className="h-10 w-10 object-contain bg-white rounded-lg p-1"
          />
          <div>
            <h1 className="text-xl font-bold">{collegeName}</h1>
            <p className="text-xs text-purple-100">Admin Portal</p>
          </div>
        </div>
        
        <div className="hidden md:block text-right">
          <p className="text-sm text-purple-100">Academic Year 2025-2026</p>
          <p className="text-xs text-purple-200">Spring Semester</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeBanner;
