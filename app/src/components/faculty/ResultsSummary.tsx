import React from 'react';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

interface ResultsSummaryProps {
  recentResults: {
    id: string;
    classroom: string;
    date: string;
    status: 'published' | 'draft';
  }[];
  downloadRequests: {
    total: number;
    completed: number;
    pending: number;
  };
  onViewMore: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  recentResults,
  downloadRequests,
  onViewMore
}) => {
  return (
    <SummaryPanel 
      title="Results Section" 
      icon={<FileText className="h-5 w-5" />}
      color="green"
      onViewMore={onViewMore}
    >
      <div className="flex flex-col h-full">
        {/* Recent Results */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Results</h4>
          
          {recentResults.length > 0 ? (
            <div className="space-y-2 max-h-[120px] overflow-y-auto">
              {recentResults.map(result => (
                <div 
                  key={result.id}
                  className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{result.classroom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{result.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    result.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {result.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              No recent results
            </p>
          )}
        </div>
        
        {/* Result Statistics */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pass Rate</h4>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">92%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">28% Distinction</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
              <div className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Download Requests */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Download Requests</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{downloadRequests.total}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{downloadRequests.completed}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">
              <div className="flex justify-center">
                <XCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{downloadRequests.pending}</p>
            </div>
          </div>
        </div>
      </div>
    </SummaryPanel>
  );
};

export default ResultsSummary;