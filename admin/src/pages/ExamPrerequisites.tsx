import React, { useState } from 'react';
import { FileText, Ticket, FileCheck, ArrowRight, Clock, Search, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import TimetableModal from '../components/modals/TimetableModal';
import HallTicketModal from '../components/modals/HallTicketModal';
import ApplicationsModal from '../components/modals/ApplicationsModal';

interface DutySwapLog {
  id: string;
  date: string;
  time: string;
  facultyName: string;
  oldSlot: string;
  newSlot: string;
  swappedWith: string;
}

const ExamPrerequisites: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'timetable' | 'hallTickets' | 'applications' | null>(null);

  const [dutyLogs] = useState<DutySwapLog[]>([
    {
      id: '1',
      date: '2025-03-15',
      time: '09:30 AM',
      facultyName: 'Dr. Sarah Johnson',
      oldSlot: 'Room 101 (9:00 AM)',
      newSlot: 'Room 203 (2:00 PM)',
      swappedWith: 'Prof. Robert Wilson'
    },
    {
      id: '2',
      date: '2025-03-15',
      time: '10:15 AM',
      facultyName: 'Prof. Michael Chen',
      oldSlot: 'Room 202 (11:00 AM)',
      newSlot: 'Room 105 (3:00 PM)',
      swappedWith: 'Dr. Lisa Anderson'
    },
    {
      id: '3',
      date: '2025-03-16',
      time: '08:45 AM',
      facultyName: 'Dr. Emily Brown',
      oldSlot: 'Room 303 (10:00 AM)',
      newSlot: 'Room 401 (1:00 PM)',
      swappedWith: 'Prof. James Taylor'
    }
  ]);

  const features = [
    {
      id: 'timetable',
      title: 'Exam Timetable Generation',
      description: 'Create and manage examination schedules with automatic conflict detection and resolution.',
      icon: FileText,
      modalType: 'timetable' as const,
      stats: {
        label: 'Upcoming Exams',
        value: '12'
      }
    },
    {
      id: 'hall-tickets',
      title: 'Hall Ticket Generation',
      description: 'Generate and distribute hall tickets with QR codes for secure verification.',
      icon: Ticket,
      modalType: 'hallTickets' as const,
      stats: {
        label: 'Pending Generation',
        value: '45'
      }
    },
    {
      id: 'applications',
      title: 'Manage Applications',
      description: 'Review and process examination applications with bulk actions and status tracking.',
      icon: FileCheck,
      modalType: 'applications' as const,
      stats: {
        label: 'Pending Review',
        value: '28'
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam Prerequisites
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage essential pre-examination tasks and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="relative group cursor-pointer"
                onClick={() => setActiveModal(feature.modalType)}
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>

                <div className="mt-auto">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.stats.label}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.stats.value}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Duty Swap Logs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View recent duty swap requests and changes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Faculty Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Original Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    New Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Swapped With
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dutyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {log.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.facultyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {log.oldSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {log.newSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.swappedWith}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <TimetableModal
        isOpen={activeModal === 'timetable'}
        onClose={() => setActiveModal(null)}
      />
      
      <HallTicketModal
        isOpen={activeModal === 'hallTickets'}
        onClose={() => setActiveModal(null)}
      />
      
      <ApplicationsModal
        isOpen={activeModal === 'applications'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default ExamPrerequisites;