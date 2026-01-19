import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TestSidebar from './TestSidebar';
import BottomNav from './BottomNav';
import Breadcrumbs from './Breadcrumbs';
import { TestToaster } from './Toast';
import { Search, Bell, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TestLayoutProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const TestLayout: React.FC<TestLayoutProps> = ({ title, subtitle, children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <TestSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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

            {/* Page Title - mobile only */}
            <h1 className="text-base font-semibold text-slate-800 sm:hidden truncate">{title}</h1>

            {/* Search - desktop */}
            <div className="relative hidden sm:block">
              <label htmlFor="search" className="sr-only">Search</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input 
                id="search"
                type="search" 
                placeholder="Search..." 
                className="
                  w-56 lg:w-72 pl-9 pr-4 py-1.5 
                  bg-slate-50 border border-slate-200 rounded-lg 
                  text-sm text-slate-700 placeholder-slate-400 
                  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                  transition-shadow duration-150
                "
              />
            </div>
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
            
            {/* User */}
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <img 
                src={user?.photoUrl || '/images/default-avatar.png'} 
                alt=""
                className="w-7 h-7 rounded-full object-cover bg-slate-100"
              />
              <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[120px] truncate">{user?.name}</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-20 sm:pb-0 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page Title - desktop */}
            <div className="mb-6 hidden sm:block">
              <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>

            {/* Subtitle on mobile */}
            {subtitle && <p className="mb-4 text-sm text-slate-500 sm:hidden">{subtitle}</p>}

            {/* Page Content */}
            {children || <Outlet />}
          </div>
        </div>

        {/* Bottom Navigation - mobile only */}
        <BottomNav onMoreClick={() => setSidebarOpen(true)} />
      </main>

      {/* Custom Toaster */}
      <TestToaster />
    </div>
  );
};

export default TestLayout;
