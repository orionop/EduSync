import React from 'react';
import { X, Mail, Phone, Building, UserCircle, GraduationCap, BookOpen, Hash, Award } from 'lucide-react';

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
    studentId?: string;
    rollNumber?: string;
    course?: string;
    semester?: string;
    division?: string;
    cgpa?: number;
  };
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="
        relative max-w-2xl w-full max-h-[90vh] overflow-hidden
        bg-white/90 backdrop-blur-xl
        border border-white/20
        rounded-2xl shadow-2xl shadow-slate-900/20
        flex flex-col
      ">
        {/* Glass header */}
        <div className="
          relative p-5 border-b border-slate-200/50
          bg-gradient-to-r from-slate-600/90 to-slate-700/90 backdrop-blur-md
          flex justify-between items-center
        ">
          <h2 className="text-xl font-bold text-white">Student Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50/50 to-white">
          {/* Profile Header with Glass Effect */}
          <div className="relative mb-6">
            <div className="
              relative p-6 rounded-xl overflow-hidden
              bg-gradient-to-br from-white/80 via-white/60 to-slate-50/80
              backdrop-blur-md
              border border-white/40
              shadow-lg shadow-slate-200/50
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative flex flex-col items-center">
                {userInfo.photoUrl ? (
                  <div className="relative mb-4">
                    <img 
                      src={userInfo.photoUrl} 
                      alt={userInfo.name} 
                      className="w-28 h-28 rounded-full object-cover border-4 border-white/80 shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white/80 mb-4">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{userInfo.name}</h3>
                <span className="px-4 py-1.5 bg-slate-600/10 backdrop-blur-sm text-slate-700 rounded-full text-sm font-medium border border-slate-300/50">
                  Student
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {userInfo.studentId && (
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                  <Hash className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Student ID</p>
                  <p className="font-semibold text-slate-800">{userInfo.studentId}</p>
                </div>
              </div>
            )}

            {userInfo.rollNumber && (
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-purple-100/80 backdrop-blur-sm">
                  <UserCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Roll Number</p>
                  <p className="font-semibold text-slate-800">{userInfo.rollNumber}</p>
                </div>
              </div>
            )}

            {userInfo.course && (
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-emerald-100/80 backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Course</p>
                  <p className="font-semibold text-slate-800">{userInfo.course}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {userInfo.semester && (
                <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2.5 rounded-lg bg-amber-100/80 backdrop-blur-sm">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-0.5">Semester</p>
                    <p className="font-semibold text-slate-800">{userInfo.semester}</p>
                  </div>
                </div>
              )}

              {userInfo.division && (
                <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2.5 rounded-lg bg-rose-100/80 backdrop-blur-sm">
                    <Hash className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-0.5">Division</p>
                    <p className="font-semibold text-slate-800">{userInfo.division}</p>
                  </div>
                </div>
              )}
            </div>

            {userInfo.cgpa !== undefined && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 backdrop-blur-sm rounded-xl border border-amber-200/60 shadow-md">
                <div className="p-2.5 rounded-lg bg-amber-100/80 backdrop-blur-sm">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 mb-0.5">Current CGPA</p>
                  <p className="font-bold text-2xl text-amber-700">{userInfo.cgpa.toFixed(2)}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                <Mail className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="font-semibold text-slate-800 text-sm break-all">{userInfo.email}</p>
              </div>
            </div>
            
            {userInfo.phone && (
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                  <Phone className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="font-semibold text-slate-800">{userInfo.phone}</p>
                </div>
              </div>
            )}
            
            {userInfo.institution && (
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                  <Building className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Institution</p>
                  <p className="font-semibold text-slate-800">{userInfo.institution}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200/50">
            <button
              onClick={onClose}
              className="
                w-full py-3 px-4
                bg-gradient-to-r from-slate-600 to-slate-700
                hover:from-slate-700 hover:to-slate-800
                text-white font-medium rounded-xl
                shadow-md shadow-slate-300/50
                hover:shadow-lg hover:shadow-slate-400/50
                transition-all duration-200
              "
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
