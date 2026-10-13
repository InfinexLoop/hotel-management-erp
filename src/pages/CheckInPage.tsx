import React, { useState } from 'react';
import {
  LogIn,
  Key,
  CheckCircle2,
  Calendar,
  BedDouble,
  User,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const CheckInPage: React.FC = () => {
  const { reservations, rooms, checkInReservation } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResForCheckIn, setSelectedResForCheckIn] = useState<any | null>(null);
  const [keyCardIssued, setKeyCardIssued] = useState(true);
  const [idVerified, setIdVerified] = useState(true);

  // Expected check-ins: confirmed reservations
  const pendingCheckIns = reservations.filter((r) => r.status === 'confirmed');

  const filteredCheckIns = pendingCheckIns.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.guestName.toLowerCase().includes(q) ||
      r.bookingNumber.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q)
    );
  });

  const handleConfirmCheckIn = () => {
    if (!selectedResForCheckIn) return;
    checkInReservation(selectedResForCheckIn.id);
    setSelectedResForCheckIn(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <LogIn className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Front Desk Arrival & Check-In
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Validate guest credentials, assign digital keys, and register active room occupancy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-emerald-600 font-black text-sm mr-1.5">
              {pendingCheckIns.length}
            </span>
            Arrivals Pending
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search arriving guest, room number, or booking #..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Ready for one-click keycard dispatch
        </div>
      </div>

      {/* Arrival Cards */}
      {filteredCheckIns.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              All Expected Arrivals Processed!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              There are currently no remaining confirmed arrivals waiting for check-in.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCheckIns.map((res) => {
            const roomObj = rooms.find((r) => r.id === res.roomId || r.roomNumber === res.roomNumber);
            const isRoomReady = roomObj?.status === 'available';

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                        {res.bookingNumber}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                        {res.guestName}
                      </h4>
                      <p className="text-xs text-slate-400">{res.guestEmail}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white block">
                        Room {res.roomNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Floor {roomObj?.floor || 1}
                      </span>
                    </div>
                  </div>

                  {/* Room status check pill */}
                  <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Room Turnover State:</span>
                      <span
                        className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-md ${
                          isRoomReady
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700'
                        }`}
                      >
                        {roomObj?.status || 'Available'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Duration of Stay:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {res.checkInDate} → {res.checkOutDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Folio Balance:</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        ${res.totalAmount.toFixed(2)}{' '}
                        <span className={res.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                          ({res.isPaid ? 'Paid' : 'Due'})
                        </span>
                      </span>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-[11px] text-blue-700 dark:text-blue-300 italic mb-4">
                      "{res.specialRequests}"
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => setSelectedResForCheckIn(res)}
                    variant="gradient"
                    size="sm"
                    className="w-full"
                    icon={<Key className="w-4 h-4" />}
                  >
                    Proceed With Check-In
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Check-In Modal */}
      {selectedResForCheckIn && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedResForCheckIn(null)}
          title={`Confirm Guest Arrival: ${selectedResForCheckIn.guestName}`}
          description={`Booking ${selectedResForCheckIn.bookingNumber} • Assigned to Room ${selectedResForCheckIn.roomNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Room Assigned:</span>
                <span className="font-black text-blue-700 dark:text-blue-300 text-sm">
                  Room {selectedResForCheckIn.roomNumber} ({selectedResForCheckIn.roomTypeName})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Stay Duration:</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {selectedResForCheckIn.checkInDate} to {selectedResForCheckIn.checkOutDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Folio Amount:</span>
                <span className="font-black text-slate-900 dark:text-white">
                  ${selectedResForCheckIn.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="chkId"
                  checked={idVerified}
                  onChange={(e) => setIdVerified(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-blue-600"
                />
                <label htmlFor="chkId" className="cursor-pointer">
                  <span className="font-bold text-slate-800 dark:text-white block">
                    Verify Guest ID / Passport
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Guest photo identification matched against reservation records.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="chkKey"
                  checked={keyCardIssued}
                  onChange={(e) => setKeyCardIssued(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-blue-600"
                />
                <label htmlFor="chkKey" className="cursor-pointer">
                  <span className="font-bold text-slate-800 dark:text-white block">
                    Encode & Issue RFID Keycards
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Issue 2 contactless room keycards with guest elevator permissions.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedResForCheckIn(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmCheckIn}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Check-In & Hand Keys
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
