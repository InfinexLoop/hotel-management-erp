import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  Building,
  RotateCcw,
  CheckCircle2,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useHotel } from '@/context/HotelContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { role, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAllNotificationsRead, resetDemoData, settings, stats } = useHotel();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetModal, setResetModal] = useState(false);
  const navigate = useNavigate();

  const unreadCount = stats.unreadNotificationsCount;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/reservations?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Property Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-slate-800 dark:text-white block sm:inline">
                {settings.hotelName}
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500 ml-2 font-medium">
                • 5-Star Resort PMS
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative flex-1 max-w-md mx-4"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, guests, or room #..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-hidden transition-all duration-200"
          />
        </form>

        {/* Right: Quick actions, notifications, theme toggle, role pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Indicator Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
            {role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="capitalize">{role === 'admin' ? 'Admin Access' : 'Manager Access'}</span>
          </div>

          {/* Reset Demo Data button (Admin only) */}
          {role === 'admin' && (
            <button
              onClick={() => setResetModal(true)}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Alerts & Activities</h4>
                      <p className="text-[11px] text-slate-400">{unreadCount} unread notices</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar Mini */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-100 dark:ring-blue-900/60">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {role === 'admin' ? 'Administrator' : 'Manager'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Reset Demo Data */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setResetModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-fade-in text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Demo Data?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will reset all rooms, bookings, guests, invoices, and employee records back to the pristine InfinexLoop demonstration seed dataset.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setResetModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
