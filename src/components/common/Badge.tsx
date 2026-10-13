import React from 'react';
import { RoomStatus, ReservationStatus, InvoiceStatus, HousekeepingStatus } from '@/types';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
  };

  const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const RoomStatusBadge: React.FC<{ status: RoomStatus }> = ({ status }) => {
  switch (status) {
    case 'available':
      return <Badge variant="success" dot>Available</Badge>;
    case 'occupied':
      return <Badge variant="danger" dot>Occupied</Badge>;
    case 'cleaning':
      return <Badge variant="warning" dot>Cleaning</Badge>;
    case 'maintenance':
      return <Badge variant="purple" dot>Maintenance</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="info" dot>Confirmed</Badge>;
    case 'checked_in':
      return <Badge variant="success" dot>Checked In</Badge>;
    case 'checked_out':
      return <Badge variant="default" dot>Checked Out</Badge>;
    case 'cancelled':
      return <Badge variant="danger" dot>Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success" dot>Paid</Badge>;
    case 'pending':
      return <Badge variant="warning" dot>Pending</Badge>;
    case 'cancelled':
      return <Badge variant="danger" dot>Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const HousekeepingStatusBadge: React.FC<{ status: HousekeepingStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="warning" dot>Pending</Badge>;
    case 'cleaning':
      return <Badge variant="info" dot>Cleaning</Badge>;
    case 'completed':
      return <Badge variant="success" dot>Cleaned</Badge>;
    case 'inspected':
      return <Badge variant="purple" dot>Inspected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
