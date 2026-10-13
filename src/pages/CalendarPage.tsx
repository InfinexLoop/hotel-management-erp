import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  BedDouble,
  User,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const CalendarPage: React.FC = () => {
  const { rooms, reservations } = useHotel();
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  // Focus on October 2026 days (demo reference timeline Oct 8 to Oct 22)
  const days = Array.from({ length: 15 }, (_, i) => i + 8); // Oct 8 to Oct 22

  const getReservationForRoomAndDay = (roomNumber: string, day: number) => {
    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return reservations.find((r) => {
      if (r.roomNumber !== roomNumber) return false;
      return dateStr >= r.checkInDate && dateStr <= r.checkOutDate && r.status !== 'cancelled';
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'confirmed':
        return 'bg-blue-600 text-white border-blue-700';
      case 'checked_out':
        return 'bg-slate-500 text-white border-slate-600';
      default:
        return 'bg-amber-600 text-white border-amber-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Interactive Room Tape Calendar
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual room rack and booking timeline for October 2026 occupancy management.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-600" />
            <span className="text-slate-600 dark:text-slate-300">Checked In (Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-blue-600" />
            <span className="text-slate-600 dark:text-slate-300">Confirmed (Upcoming)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-500" />
            <span className="text-slate-600 dark:text-slate-300">Checked Out (Past)</span>
          </div>
        </div>
      </div>

      {/* Gantt Calendar Rack Card */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
              October 2026 — High Season
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Today: Oct 13
            </span>
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            {rooms.length} Rooms • Scroll horizontally to inspect dates
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[950px]">
            {/* Days Header */}
            <div className="grid grid-cols-[160px_repeat(15,1fr)] bg-slate-100/80 dark:bg-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <div className="p-3 border-r border-slate-200 dark:border-slate-700 flex items-center">
                Room Number
              </div>
              {days.map((day) => {
                const isToday = day === 13;
                return (
                  <div
                    key={day}
                    className={`p-2.5 text-center border-r border-slate-200 dark:border-slate-700/60 ${
                      isToday
                        ? 'bg-blue-600 text-white font-black ring-2 ring-blue-500'
                        : ''
                    }`}
                  >
                    <span className="block text-[9px] uppercase tracking-wider opacity-70">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day % 7]}
                    </span>
                    <span className="block text-xs font-black">{day}</span>
                  </div>
                );
              })}
            </div>

            {/* Room Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="grid grid-cols-[160px_repeat(15,1fr)] hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Room Label */}
                  <div className="p-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60 sticky left-0 z-10">
                    <div>
                      <span className="font-black text-slate-900 dark:text-white">
                        Room {room.roomNumber}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate max-w-[100px]">
                        {room.roomType.name}
                      </span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.status === 'available'
                          ? 'bg-emerald-500'
                          : room.status === 'occupied'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                  </div>

                  {/* Days grid cells */}
                  {days.map((day) => {
                    const res = getReservationForRoomAndDay(room.roomNumber, day);
                    const isToday = day === 13;

                    return (
                      <div
                        key={day}
                        className={`h-14 border-r border-slate-100 dark:border-slate-800/60 p-1 flex items-center justify-center relative ${
                          isToday ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        {res ? (
                          <div
                            onClick={() => setSelectedReservation(res)}
                            className={`w-full h-full rounded-xl p-1.5 flex flex-col justify-center cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${getStatusColor(
                              res.status
                            )}`}
                            title={`${res.guestName} (${res.bookingNumber}) - $${res.totalAmount}`}
                          >
                            <span className="font-extrabold text-[10px] truncate block">
                              {res.guestName}
                            </span>
                            <span className="text-[9px] opacity-85 block truncate">
                              ${res.totalAmount}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Reservation Details Popover Modal */}
      {selectedReservation && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReservation(null)}
          title={`Booking Details: ${selectedReservation.bookingNumber}`}
          description={`Room ${selectedReservation.roomNumber} (${selectedReservation.roomTypeName})`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Guest Name:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedReservation.guestName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {selectedReservation.guestEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-In:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedReservation.checkInDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-Out:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedReservation.checkOutDate}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-bold">Total Folio:</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                  ${selectedReservation.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedReservation.specialRequests && (
              <p className="text-[11px] text-slate-500 italic p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                "{selectedReservation.specialRequests}"
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedReservation(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
