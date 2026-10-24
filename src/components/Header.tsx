import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Bell, 
  Search, 
  PlayCircle, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  LogOut,
  User
} from 'lucide-react';
import { Role, Institution, AppNotification, NavPage } from '../types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeInstitution: Institution;
  notifications: AppNotification[];
  onOpenWalkthrough: () => void;
  onOpenSearch: () => void;
  onNavigate: (page: NavPage) => void;
  currentUser?: any;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeInstitution,
  notifications,
  onOpenWalkthrough,
  onOpenSearch,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Topmost Official AICTE / SIH Banner */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-amber-400 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> SIH26265 PROTOTYPE
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Nidhi Track - Security Deposit & FDR Lifecycle Portal
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenWalkthrough}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded flex items-center space-x-1 font-medium transition shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>12-Step Walkthrough Guide</span>
          </button>
        </div>
      </div>

      {/* Main Header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          onClick={() => onNavigate(currentRole === 'institution' ? 'dashboard' : 'councilDashboard')}
          className="flex items-center space-x-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-700 flex items-center justify-center text-white shadow-md font-bold text-lg tracking-tighter">
            AICTE
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                <span className="text-indigo-700">Nidhi</span> Track
              </span>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              AICTE Security Deposit Management • Gov of India
            </p>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full text-xs pl-3 pr-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 flex items-center justify-between transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search FDR ref, Institution ID, Bank or Request...</span>
            </div>
            <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white font-mono">
              ⌘K
            </span>
          </button>
        </div>

        {/* Role Switcher & Persona Indicators */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Role Switcher Buttons - Only for council/admin */}
          {currentUser?.role !== 'institution' && (
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1 shadow-inner">
              <button
                onClick={() => onRoleChange('institution')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  currentRole === 'institution'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Institution View</span>
              </button>
              <button
                onClick={() => onRoleChange('council')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                  currentRole === 'council'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>AICTE Council</span>
              </button>
            </div>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications & Alerts
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    {notifications.length} Active
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto text-xs">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (notif.targetPage) onNavigate(notif.targetPage);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition flex items-start space-x-2.5"
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        ) : notif.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Profile Pill with Logout */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 hover:bg-slate-50 p-2 rounded-lg transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  currentRole === 'institution'
                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                    : 'bg-indigo-100 text-indigo-900 border-indigo-200'
                }`}
              >
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[150px]">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 capitalize">
                  {currentUser?.role || 'User'}
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-bold text-slate-900">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {currentUser?.email}
                  </div>
                  <div className="text-xs text-indigo-600 mt-1 capitalize">
                    {currentUser?.role} Account
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to profile page if exists
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
