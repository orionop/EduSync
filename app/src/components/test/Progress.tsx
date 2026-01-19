import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'default',
  showLabel = false,
  label,
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    default: 'bg-slate-600 dark:bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {label || 'Progress'}
          </span>
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-progress-stripe' : ''
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = 'default',
  showValue = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: 'stroke-slate-600 dark:stroke-slate-400',
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    error: 'stroke-red-500',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colors[color]} transition-all duration-500 ease-out`}
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-semibold text-slate-800 dark:text-slate-200">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

interface StepsProgressProps {
  steps: string[];
  currentStep: number;
}

export const StepsProgress: React.FC<StepsProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-colors duration-300
                    ${isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                        ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${isCurrent ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}
                `}>
                  {step}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-20px]">
                  <div
                    className={`h-full transition-colors duration-300 ${
                      index < currentStep 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
