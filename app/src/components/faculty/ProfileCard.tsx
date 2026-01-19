import React, { useState } from 'react';
import { GraduationCap, Hash, Eye, Mail, Phone, Building, BookOpen, Briefcase, X, LogOut } from 'lucide-react';

interface ProfileCardProps {
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
  onClose?: () => void;
  onSignOut?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userInfo, onSignOut }) => {
  const [showFullProfile, setShowFullProfile] = useState(false);

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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-white/50">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                
                {/* Name and Role */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800 truncate">{userInfo.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Faculty</p>
                  {userInfo.facultyId && (
                    <p className="text-xs text-slate-400 mt-1">ID: {userInfo.facultyId}</p>
                  )}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {userInfo.department && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                    <GraduationCap className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate">{userInfo.department}</span>
                  </div>
                )}
                {userInfo.designation && (
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                    <Briefcase className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate">{userInfo.designation}</span>
                  </div>
                )}
              </div>

              {/* View Profile Button */}
              <button
                onClick={() => setShowFullProfile(true)}
                className="
                  w-full py-2.5 px-4
                  bg-gradient-to-r from-emerald-600 to-emerald-700
                  hover:from-emerald-700 hover:to-emerald-800
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
                <h3 className="text-lg font-bold text-slate-800">Faculty Profile</h3>
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white/80 mb-3">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-800 mb-2">{userInfo.name}</h3>
                <span className="px-3 py-1 bg-emerald-600/10 backdrop-blur-sm text-slate-700 rounded-full text-xs font-medium border border-emerald-300/50">
                  Faculty
                </span>
              </div>

              {/* Full Profile Details */}
              <div className="space-y-3">
                {userInfo.facultyId && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                      <Hash className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Faculty ID</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.facultyId}</p>
                    </div>
                  </div>
                )}

                {userInfo.department && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-emerald-100/80 backdrop-blur-sm">
                      <GraduationCap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Department</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.department}</p>
                    </div>
                  </div>
                )}

                {userInfo.designation && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-blue-100/80 backdrop-blur-sm">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Designation</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.designation}</p>
                    </div>
                  </div>
                )}

                {userInfo.specialization && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 rounded-lg bg-purple-100/80 backdrop-blur-sm">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">Specialization</p>
                      <p className="font-semibold text-slate-800 text-sm">{userInfo.specialization}</p>
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
