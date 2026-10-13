import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-sm transition-all duration-200 backdrop-blur-xs ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};
