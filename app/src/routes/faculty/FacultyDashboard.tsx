import { useAuth } from '../../context/AuthContext';
import { BookOpen } from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name || 'Faculty'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Faculty Dashboard - Placeholder Page
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Supervisory Duties
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View assigned exam duties
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Grading
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Evaluate and grade submissions
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Question Papers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submit question papers
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ This is a placeholder page. Full faculty portal functionality will be migrated in Phase 3.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
