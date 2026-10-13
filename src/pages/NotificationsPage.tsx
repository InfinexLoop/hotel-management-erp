import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  CalendarCheck,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHotel();
  const [filter, setFilter] = useState<'all' | 'unread' | 'reservation' | 'housekeeping' | 'system'>(
    'all'
  );

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getIcon = (type: string, category: string) => {
    switch (category) {
      case 'reservation':
        return <CalendarCheck className="w-5 h-5 text-blue-500" />;
      case 'housekeeping':
        return <Sparkles className="w-5 h-5 text-orange-500" />;
      case 'billing':
        return <Receipt className="w-5 h-5 text-indigo-500" />;
      default:
        return type === 'urgent' ? (
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        ) : (
          <Info className="w-5 h-5 text-emerald-500" />
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Operational Alerts & Activity Feed
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time hotel PMS alerts, guest check-in updates, and automated notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={markAllNotificationsRead}
            variant="outline"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Mark All As Read
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'reservation', label: 'Reservations' },
          { id: 'housekeeping', label: 'Housekeeping' },
          { id: 'system', label: 'System & Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto opacity-40 mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No notifications matching current filter
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                !notif.isRead
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xs'
              }`}
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 shadow-xs">
                {getIcon(notif.type, notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
