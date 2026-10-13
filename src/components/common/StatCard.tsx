import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  change,
  trend = 'neutral',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-4 ${
        onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500' : ''
      }`}
    >
      <div
        className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 tracking-tight truncate">
          {value}
        </h3>
        {change && (
          <p
            className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
              trend === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : trend === 'down'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
};
