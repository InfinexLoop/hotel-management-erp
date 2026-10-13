import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BedDouble,
  LogIn,
  LogOut,
  Sparkles,
  Receipt,
  Briefcase,
  BarChart3,
  CalendarDays,
  Bell,
  Settings,
  Hotel,
  Power,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useHotel } from '@/context/HotelContext';
import { BRANDING } from '@/config/branding';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { role, user, logout } = useAuth();
  const { stats, settings } = useHotel();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Reservations',
      path: '/reservations',
      icon: CalendarCheck,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Guests',
      path: '/guests',
      icon: Users,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Rooms',
      path: '/rooms',
      icon: BedDouble,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Check-In',
      path: '/check-in',
      icon: LogIn,
      roles: ['admin', 'manager'],
      badge: stats.todayCheckIns > 0 ? stats.todayCheckIns : undefined,
    },
    {
      name: 'Check-Out',
      path: '/check-out',
      icon: LogOut,
      roles: ['admin', 'manager'],
      badge: stats.todayCheckOuts > 0 ? stats.todayCheckOuts : undefined,
    },
    {
      name: 'Housekeeping',
      path: '/housekeeping',
      icon: Sparkles,
      roles: ['admin', 'manager'],
      badge: stats.cleaningRooms > 0 ? stats.cleaningRooms : undefined,
    },
    {
      name: 'Invoices',
      path: '/invoices',
      icon: Receipt,
      roles: ['admin', 'manager'],
      badge: stats.pendingInvoicesCount > 0 ? stats.pendingInvoicesCount : undefined,
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: Briefcase,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: CalendarDays,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      roles: ['admin', 'manager'],
      badge: stats.unreadNotificationsCount > 0 ? stats.unreadNotificationsCount : undefined,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['admin'], // ONLY ADMIN has access to Settings!
    },
  ];

  const visibleItems = navItems.filter((item) => role && item.roles.includes(role));

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div
      style={{
        background: settings.sidebarGradient || 'linear-gradient(to bottom, #2563EB, #7C3AED)',
      }}
      className="h-full text-white shadow-2xl flex flex-col justify-between select-none"
    >
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-lg tracking-tight block truncate">
                {BRANDING.appName}
              </span>
              <span className="text-[10px] font-semibold text-blue-200 tracking-wider uppercase block">
                {BRANDING.brandName} Demo
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="py-5 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)] custom-scrollbar">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner font-bold'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0 opacity-90" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm uppercase ring-2 ring-white/20 shrink-0">
            {user?.firstName?.[0] || (role === 'admin' ? 'A' : 'M')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Demo User'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-blue-100 font-medium capitalize">
                {role === 'admin' ? 'Administrator' : 'Property Manager'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600/90 text-white text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs"
        >
          <Power className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-64 hidden md:flex md:flex-col h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
