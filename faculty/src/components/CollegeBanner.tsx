import React from 'react';
import { GraduationCap } from 'lucide-react';

interface CollegeBannerProps {
  collegeName: string;
  logoUrl?: string;
}

const CollegeBanner: React.FC<CollegeBannerProps> = ({ 
  collegeName, 
  logoUrl 
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${collegeName} Logo`} 
              className="h-10 w-auto"
            />
          ) : (
            <div className="p-2 bg-white/20 rounded-full">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{collegeName}</h1>
            <p className="text-xs text-blue-100">Faculty Dashboard</p>
          </div>
        </div>
        
        <div className="hidden md:block text-right">
          <p className="text-sm text-blue-100">Academic Year 2025-2026</p>
          <p className="text-xs text-blue-200">Spring Semester</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeBanner;