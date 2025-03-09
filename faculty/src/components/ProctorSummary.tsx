import React from 'react';
import { Shield, AlertTriangle, Camera, Eye, MapPin } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

interface ProctorSummaryProps {
  recentIrregularities: {
    id: string;
    studentId: string;
    type: string;
    timestamp: string;
    status: 'reported' | 'pending' | 'dismissed';
    classroom: string;
  }[];
  activeCameraFeeds: number;
  onViewMore: () => void;
  onViewCameraFeed: () => void;
}

const ProctorSummary: React.FC<ProctorSummaryProps> = ({
  recentIrregularities,
  activeCameraFeeds,
  onViewMore,
  onViewCameraFeed
}) => {
  return (
    <SummaryPanel 
      title="Proctor Section" 
      icon={<Shield className="h-5 w-5" />}
      color="red"
      onViewMore={onViewMore}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex-1">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Alerts</h4>
          
          {recentIrregularities.length > 0 ? (
            <div className="space-y-2">
              {recentIrregularities.slice(0, 1).map(irregularity => (
                <div 
                  key={irregularity.id}
                  className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Student {irregularity.studentId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{irregularity.type}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{irregularity.classroom}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                    irregularity.status === 'reported' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                      : irregularity.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {irregularity.status === 'reported' ? 'Reported' : 
                     irregularity.status === 'pending' ? 'Pending' : 'Dismissed'}
                  </span>
                </div>
              ))}
              {recentIrregularities.length > 1 && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  +{recentIrregularities.length - 1} more alerts
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              No recent irregularities
            </p>
          )}
        </div>
        
        {/* Monitoring Status */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 flex-1">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monitoring Status</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Feeds</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{activeCameraFeeds}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Alerts Today</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Camera Feeds</p>
            </div>
            
            <button
              onClick={onViewCameraFeed}
              className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              View Live
            </button>
          </div>
        </div>
      </div>
    </SummaryPanel>
  );
};

export default ProctorSummary;