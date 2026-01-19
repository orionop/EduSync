import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Bell, PanelLeftClose, PanelLeft, LayoutDashboard, FileCheck, Calendar, ClipboardList, Award, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import ProfileCard from './ProfileCard';
import SearchBar from '../shared/SearchBar';

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-profile-card]')
      ) {
        setShowProfileCard(false);
      }
    };

    if (showProfileCard) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileCard]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Menu toggle button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>

            {/* University Logo and Name */}
            <div className="flex items-center gap-3">
              <img 
                src="/images/uni-logo.png" 
                alt="EdVantage University" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="hidden md:block">
                <h1 className="text-base font-bold text-slate-800 tracking-tight">EdVantage University</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Excellence in Education</p>
              </div>
            </div>
          </div>

          {/* Search - Center */}
          <div className="hidden sm:block">
            <SearchBar userRole="admin" />
          </div>
          
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <button 
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-label="New notifications"></span>
            </button>
            
            <div className="w-px h-6 mx-1 bg-slate-200 hidden sm:block" aria-hidden="true"></div>
            
            {/* User Profile Button */}
            <div className="relative">
              <button 
                ref={profileButtonRef}
                onClick={() => setShowProfileCard(!showProfileCard)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="View profile"
              >
                <img 
                  src={user?.photoUrl || '/images/default-avatar.png'} 
                  alt=""
                  className="w-7 h-7 rounded-full object-cover bg-slate-100"
                />
                <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[120px] truncate">{user?.name}</span>
              </button>

              {/* Profile Card Dropdown */}
              {showProfileCard && (
                <div 
                  data-profile-card
                  className="absolute top-full right-0 mt-2 z-50 w-80 sm:w-96"
                >
                  <ProfileCard 
                    userInfo={{
                      name: user?.name || 'Admin',
                      email: user?.email || '',
                      phone: user?.phone,
                      institution: user?.institution,
                      accountType: 'admin',
                      photoUrl: user?.photoUrl,
                      adminId: user?.adminId,
                      adminRole: user?.adminRole
                    }}
                    onClose={() => setShowProfileCard(false)}
                    onSignOut={signOut}
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-20 sm:pb-0 bg-slate-50">
          <Outlet />
        </div>

        {/* Bottom Navigation - mobile only */}
        <AdminBottomNav onMoreClick={() => setSidebarOpen(true)} />
      </main>

      {/* Toaster */}
      <Toaster position="top-right" />
    </div>
  );
};

// Bottom Navigation Component for Mobile
const AdminBottomNav: React.FC<{ onMoreClick: () => void }> = ({ onMoreClick }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/admin/exam-prerequisites', icon: FileCheck, label: 'Pre-Exam' },
    { path: '/admin/during-exam', icon: Calendar, label: 'Exams' },
    { path: '/admin/post-exam', icon: ClipboardList, label: 'Post-Exam' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-lg
                transition-colors duration-150
                ${active ? 'text-slate-900' : 'text-slate-400'}
              `}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-slate-100' : ''}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-lg text-slate-400"
        >
          <div className="p-1.5 rounded-lg">
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminLayout;
