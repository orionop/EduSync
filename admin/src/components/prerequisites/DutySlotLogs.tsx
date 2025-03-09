import React, { useState } from 'react';
import { Download, Search, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../ui/Card';

interface DutyLog {
  id: string;
  facultyName: string;
  date: string;
  oldDuty: string;
  newDuty: string;
  reason: string;
  changedBy: string;
  timestamp: string;
}

const DutySlotLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortField, setSortField] = useState<keyof DutyLog>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [logs] = useState<DutyLog[]>([
    {
      id: '1',
      facultyName: 'Dr. Sarah Johnson',
      date: '2025-03-15',
      oldDuty: 'Room 101',
      newDuty: 'Room 203',
      reason: 'Schedule conflict',
      changedBy: 'Admin',
      timestamp: '2025-03-14T15:30:00'
    },
    {
      id: '2',
      facultyName: 'Prof. Michael Chen',
      date: '2025-03-16',
      oldDuty: 'Room 202',
      newDuty: 'Room 105',
      reason: 'Medical emergency',
      changedBy: 'Coordinator',
      timestamp: '2025-03-15T09:45:00'
    },
    {
      id: '3',
      facultyName: 'Dr. Emily Brown',
      date: '2025-03-17',
      oldDuty: 'Room 303',
      newDuty: 'Room 401',
      reason: 'Department meeting',
      changedBy: 'Admin',
      timestamp: '2025-03-16T11:20:00'
    }
  ]);

  const handleSort = (field: keyof DutyLog) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredLogs = logs
    .filter(log =>
      (log.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedDate || log.date === selectedDate)
    )
    .sort((a, b) => {
      const compareValue = sortDirection === 'asc' ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * compareValue;
      if (a[sortField] > b[sortField]) return 1 * compareValue;
      return 0;
    });

  const handleExport = (format: 'csv' | 'pdf') => {
    // Implement export logic
    console.log(`Exporting as ${format}`);
  };

  return (
    <Card className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Duty Slot Change Logs
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by faculty name or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {[
                { key: 'date', label: 'Date' },
                { key: 'facultyName', label: 'Faculty Name' },
                { key: 'oldDuty', label: 'Old Duty' },
                { key: 'newDuty', label: 'New Duty' },
                { key: 'reason', label: 'Reason' },
                { key: 'changedBy', label: 'Changed By' },
                { key: 'timestamp', label: 'Timestamp' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof DutyLog)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    {label}
                    <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAndFilteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(log.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {log.facultyName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {log.oldDuty}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {log.newDuty}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {log.reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {log.changedBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(log.timestamp), 'hh:mm a')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DutySlotLogs;