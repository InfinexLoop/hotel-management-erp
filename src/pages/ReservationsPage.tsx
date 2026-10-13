import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  LogIn,
  LogOut,
  XCircle,
  CreditCard,
  User,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { ReservationStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { ReservationStatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const ReservationsPage: React.FC = () => {
  const {
    reservations,
    rooms,
    guests,
    addReservation,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
  } = useHotel();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New reservation form state
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (guests.length > 0 && !selectedGuestId) {
      setSelectedGuestId(guests[0].id);
    }
    if (rooms.length > 0 && !selectedRoomId) {
      const avail = rooms.find((r) => r.status === 'available') || rooms[0];
      setSelectedRoomId(avail.id);
    }
  }, [guests, rooms, selectedGuestId, selectedRoomId]);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const guestObj = guests.find((g) => g.id === selectedGuestId);
    const roomObj = rooms.find((r) => r.id === selectedRoomId);
    if (!guestObj || !roomObj) return;

    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const totalAmount = Math.round(
      nights * roomObj.basePricePerNight * (1 + roomObj.taxPercentage / 100)
    );

    addReservation({
      roomId: roomObj.id,
      roomNumber: roomObj.roomNumber,
      roomTypeName: roomObj.roomType.name,
      guestId: guestObj.id,
      guestName: `${guestObj.firstName} ${guestObj.lastName}`,
      guestEmail: guestObj.email,
      guestPhone: guestObj.phone,
      checkInDate,
      checkOutDate,
      totalAmount,
      status: 'confirmed',
      isPaid,
      adults: Number(adults),
      children: Number(childrenCount),
      specialRequests: specialRequests || 'Standard guest booking',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Reservations & Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming arrivals, confirmed stays, and active guest bookings.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          New Reservation
        </Button>
      </div>

      {/* Control Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by booking #, guest name, or room #..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Booking #</th>
                <th className="px-6 py-4">Guest Information</th>
                <th className="px-6 py-4">Room & Type</th>
                <th className="px-6 py-4">Stay Dates</th>
                <th className="px-6 py-4">Total Folio</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
              {filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400 text-sm">
                    {res.bookingNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{res.guestName}</div>
                    <div className="text-[11px] text-slate-400">{res.guestEmail}</div>
                    <div className="text-[10px] text-slate-400">{res.guestPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Room {res.roomNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">{res.roomTypeName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700 dark:text-slate-300 font-semibold">
                      {res.checkInDate} → {res.checkOutDate}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {res.adults} Adults {res.children > 0 ? `, ${res.children} Kids` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 dark:text-white">
                    ${res.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {res.isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <ReservationStatusBadge status={res.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => checkInReservation(res.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                          title="Check In Guest"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Check-In
                        </button>
                      )}

                      {res.status === 'checked_in' && (
                        <button
                          onClick={() => checkOutReservation(res.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                          title="Check Out Guest"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Check-Out
                        </button>
                      )}

                      {res.status !== 'cancelled' && res.status !== 'checked_out' && (
                        <button
                          onClick={() => cancelReservation(res.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          title="Cancel Reservation"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Reservation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Guest Reservation"
        description="Select guest profile and assign room from available hotel inventory."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Guest *
            </label>
            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.firstName} {g.lastName} ({g.nationality}) - {g.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Room *
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - {r.roomType.name} (${r.basePricePerNight}/night) [
                  {r.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Check-In Date *
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Check-Out Date *
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Adults
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Children
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Special Requests
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Quiet room, airport pickup, late check-in..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPaidRes"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPaidRes" className="font-bold text-slate-700 dark:text-slate-200">
              Collect Pre-Payment Now (Marks Folio Paid & Generates Paid Receipt)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Book & Confirm Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
