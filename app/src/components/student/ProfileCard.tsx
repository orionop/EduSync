import React, { useState } from 'react';
import { GraduationCap, Award, Hash, Eye, Mail, Phone, Building, UserCircle, BookOpen, X, LogOut } from 'lucide-react';

interface ProfileCardProps {
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
  onClose?: () => void;
  onSignOut?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userInfo, onClose, onSignOut }) => {
  const [showFullProfile, setShowFullProfile] = useState(false);

  const handleViewProfile = () => {
    setShowFullProfile(true);
  };

  return (
    <div className="relative group">
      <div className={`
        relative overflow-hidden rounded-xl
        bg-white/90 backdrop-blur-xl
        border border-white/30
        shadow-2xl shadow-slate-900/20
        transition-all duration-300
        ${showFullProfile ? 'max-h-[600px] overflow-y-auto' : 'max-h-[400px]'}
      `}>
        {/* Glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 p-4">
          {!showFullProfile ? (
            // Preview Mode
            <>
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                {userInfo.photoUrl ? (
                  <div className="relative">
                    <img 
                      src={userInfo.photoUrl} 
                      alt={userInfo.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-white/50">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                
                {/* Name and Role */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800 truncate">{userInfo.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Student</p>
                  {userInfo.studentId && (
                    <p className="text-xs text-slate-400 mt-1">ID: {userInfo.studentId}</p>
                  )}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {userInfo.course && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                    <GraduationCap className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate">{userInfo.course}</span>
                  </div>
                )}
                {userInfo.semester && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                    <Hash className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-xs text-slate-700">Sem {userInfo.semester}</span>
                  </div>
                )}
              </div>

              {/* CGPA Badge */}
              {userInfo.cgpa !== undefined && (
                <div className="mb-4 p-2.5 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-lg border border-amber-200/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Current CGPA</span>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-lg font-bold text-amber-700">{userInfo.cgpa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View Profile Button */}
              <button
                onClick={handleViewProfile}
                className="
                  w-full py-2.5 px-4
                  bg-gradient-to-r from-slate-600 to-slate-700
                  hover:from-slate-700 hover:to-slate-800
                  text-white text-sm font-medium
                  rounded-lg
                  shadow-md shadow-slate-300/50
                  hover:shadow-lg hover:shadow-slate-400/50
                  transition-all duration-200
                  flex items-center justify-center gap-2
                  group/btn
                "
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>View Full Profile</span>
              </button>

              {/* Sign Out Button */}
              {onSignOut && (
                <button
                  onClick={async () => {
                    onSignOut();
                    onClose?.();
                  }}
                  className="
                    w-full py-2.5 px-4
                    bg-white border border-red-200
                    hover:bg-red-50
                    text-red-600 text-sm font-medium
                    rounded-lg
                    shadow-sm
                    hover:shadow-md
                    transition-all duration-200
                    flex items-center justify-center gap-2
                    group/signout
                  "
                >
                  <LogOut className="w-4 h-4 group-hover/signout:scale-110 transition-transform" />
                  <span>Sign Out</span>
                </button>
              )}
            </>
          ) : (
            // Full Profile Mode
            <>
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50">
                <h3 className="text-lg font-bold text-slate-800">Student Profile</h3>
                <button
                  onClick={() => setShowFullProfile(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col items-center mb-6">
                {userInfo.photoUrl ? (
                  <div className="relative mb-3">
                    <img 
                      src={userInfo.photoUrl} 
                      alt={userInfo.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white/80 mb-3">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-800 mb-2">{userInfo.name}</h3>
                <span className="px-3 py-1 bg-slate-600/10 backdrop-blur-sm text-slate-700 rounded-full text-xs font-medium border border-slate-300/50">
                  Student
                </span>
              </div>

              {/* Full Profile Details */}
              <div className="space-y-3">
                {userInfo.studentId && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                      <Hash className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Student ID</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.studentId}</p>
                    </div>
                  </div>
                )}

                {userInfo.rollNumber && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-purple-100/80 backdrop-blur-sm">
                      <UserCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Roll Number</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.rollNumber}</p>
                    </div>
                  </div>
                )}

                {userInfo.course && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-emerald-100/80 backdrop-blur-sm">
                      <GraduationCap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Course</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.course}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {userInfo.semester && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                      <div className="p-2 rounded-lg bg-amber-100/80 backdrop-blur-sm">
                        <BookOpen className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-0.5">Semester</p>
                        <p className="font-semibold text-slate-800 text-sm">{userInfo.semester}</p>
                      </div>
                    </div>
                  )}

                  {userInfo.division && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                      <div className="p-2 rounded-lg bg-rose-100/80 backdrop-blur-sm">
                        <Hash className="h-4 w-4 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-0.5">Division</p>
                        <p className="font-semibold text-slate-800 text-sm">{userInfo.division}</p>
                      </div>
                    </div>
                  )}
                </div>

                {userInfo.cgpa !== undefined && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 backdrop-blur-sm rounded-xl border border-amber-200/60 shadow-md">
                    <div className="p-2 rounded-lg bg-amber-100/80 backdrop-blur-sm">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-0.5">Current CGPA</p>
                      <p className="font-bold text-xl text-amber-700">{userInfo.cgpa.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                  <div className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                    <Mail className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="font-semibold text-slate-800 text-sm break-all">{userInfo.email}</p>
                  </div>
                </div>
                
                {userInfo.phone && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                      <Phone className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.phone}</p>
                    </div>
                  </div>
                )}
                
                {userInfo.institution && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                      <Building className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Institution</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.institution}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
