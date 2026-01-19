import React from 'react';

// Base skeleton with shimmer animation
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

// Card skeleton
export const SkeletonCard: React.FC = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

// Stat card skeleton
export const SkeletonStat: React.FC = () => (
  <div className="card p-5">
    <div className="flex justify-between items-start mb-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="w-10 h-10 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-12" />
  </div>
);

// Table row skeleton
export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Table skeleton
export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div className="card overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
      <Skeleton className="h-5 w-40" />
    </div>
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-800/50">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="px-5 py-3">
              <Skeleton className="h-3 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

// List item skeleton
export const SkeletonListItem: React.FC = () => (
  <div className="flex items-center gap-4 px-5 py-4">
    <Skeleton className="w-10 h-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

// Avatar skeleton
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return <Skeleton className={`${sizes[size]} rounded-full`} />;
};

// Text skeleton
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
      />
    ))}
  </div>
);
