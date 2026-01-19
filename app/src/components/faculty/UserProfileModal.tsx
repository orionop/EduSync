import React from 'react';
import { X, Mail, Phone, Building, Hash, Briefcase, BookOpen, Award } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    institution?: string;
    accountType: string;
    photoUrl?: string;
    facultyId?: string;
    department?: string;
    designation?: string;
    specialization?: string;
  };
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600">
          <h2 className="text-lg font-bold text-white">Faculty Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {userInfo.photoUrl ? (
              <img 
                src={userInfo.photoUrl} 
                alt={userInfo.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100 dark:border-green-900"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-4xl font-bold">
                {userInfo.name.charAt(0)}
              </div>
            )}
            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{userInfo.name}</h3>
            <span className="px-3 py-1 mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
              Faculty
            </span>
          </div>
          
          <div className="space-y-3">
            {userInfo.facultyId && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Hash className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Faculty ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.facultyId}</p>
                </div>
              </div>
            )}

            {userInfo.designation && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Designation</p>
                  <p className="font-bold text-green-700 dark:text-green-400">{userInfo.designation}</p>
                </div>
              </div>
            )}

            {userInfo.department && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.department}</p>
                </div>
              </div>
            )}

            {userInfo.specialization && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Specialization</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.specialization}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{userInfo.email}</p>
              </div>
            </div>
            
            {userInfo.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.phone}</p>
                </div>
              </div>
            )}
            
            {userInfo.institution && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <Building className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Institution</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.institution}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
