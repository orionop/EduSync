import React from 'react';
import { Calculator, CheckCircle, Clock, BarChart3, FileCheck } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

interface GradingSummaryProps {
  totalMarksEntered: number;
  pendingMarkEntries: number;
  classPerformance: {
    averageMarks: number;
    gradeDistribution: {
      A: number;
      B: number;
      C: number;
      D: number;
      F: number;
    };
  };
  onViewMore: () => void;
}

const GradingSummary: React.FC<GradingSummaryProps> = ({
  totalMarksEntered,
  pendingMarkEntries,
  classPerformance,
  onViewMore
}) => {
  return (
    <SummaryPanel 
      title="Grading Section" 
      icon={<Calculator className="h-5 w-5" />}
      color="blue"
      onViewMore={onViewMore}
    >
      <div className="space-y-4 flex-1 flex flex-col">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Marks Entered</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalMarksEntered}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingMarkEntries}</p>
            </div>
          </div>
        </div>
        
        {/* Grade Submission Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Submission</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-base font-bold text-green-600 dark:text-green-400">28</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-base font-bold text-amber-600 dark:text-amber-400">11</p>
            </div>
          </div>
        </div>
        
        {/* Class Performance */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Performance</p>
          </div>
          
          <div className="flex items-center gap-1 h-4 mb-1">
            <div className="h-4 bg-green-500 rounded-l" style={{ width: `${classPerformance.gradeDistribution.A}%` }}></div>
            <div className="h-4 bg-blue-500" style={{ width: `${classPerformance.gradeDistribution.B}%` }}></div>
            <div className="h-4 bg-yellow-500" style={{ width: `${classPerformance.gradeDistribution.C}%` }}></div>
            <div className="h-4 bg-orange-500" style={{ width: `${classPerformance.gradeDistribution.D}%` }}></div>
            <div className="h-4 bg-red-500 rounded-r" style={{ width: `${classPerformance.gradeDistribution.F}%` }}></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Average: {classPerformance.averageMarks}%</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>A
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>B
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>C
              </span>
            </div>
          </div>
        </div>
      </div>
    </SummaryPanel>
  );
};

export default GradingSummary;