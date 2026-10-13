import React, { useState } from 'react';
import {
  LogOut,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Search,
  Sparkles,
  DollarSign,
  Coffee,
  Printer,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const CheckOutPage: React.FC = () => {
  const { reservations, checkOutReservation, markInvoicePaid, invoices } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResForCheckOut, setSelectedResForCheckOut] = useState<any | null>(null);
  const [settleFolio, setSettleFolio] = useState(true);

  // Active in-house stays
  const activeStays = reservations.filter((r) => r.status === 'checked_in');

  const filteredStays = activeStays.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.guestName.toLowerCase().includes(q) ||
      r.bookingNumber.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q)
    );
  });

  const handleConfirmCheckOut = () => {
    if (!selectedResForCheckOut) return;

    // Check out reservation
    checkOutReservation(selectedResForCheckOut.id);

    // If settleFolio is checked, find invoice and mark paid
    if (settleFolio) {
      const inv = invoices.find(
        (i) =>
          i.reservationId === selectedResForCheckOut.id ||
          i.bookingNumber === selectedResForCheckOut.bookingNumber
      );
      if (inv && inv.status !== 'paid') {
        markInvoicePaid(inv.id);
      }
    }

    setSelectedResForCheckOut(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <LogOut className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Front Desk Departure & Check-Out
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review guest incidentals, settle final folios, and dispatch turnover housekeeping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-blue-600 font-black text-sm mr-1.5">{activeStays.length}</span>
            Active In-House Stays
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
            placeholder="Search active guest, room number, or folio..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Auto-dispatches room cleaning on departure
        </div>
      </div>

      {/* Active Stays List */}
      {filteredStays.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-blue-500 mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              No Current In-House Guests Pending Checkout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              All active guests are either checked out or arriving in future slots.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStays.map((res) => {
            const isDueToday = res.checkOutDate <= '2026-10-15';

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
                        {res.roomTypeName}
                      </span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Scheduled Departure:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {res.checkOutDate}{' '}
                        {isDueToday && (
                          <span className="text-[10px] text-rose-500 font-black ml-1">
                            (Due Today)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Folio Total:</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        ${res.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Folio Balance Status:</span>
                      <span
                        className={`font-black text-[10px] uppercase px-2 py-0.5 rounded-md ${
                          res.isPaid
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700'
                        }`}
                      >
                        {res.isPaid ? 'Paid in Full' : 'Payment Due at Desk'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => setSelectedResForCheckOut(res)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    Process Check-Out & Folio
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Check-Out Review Modal */}
      {selectedResForCheckOut && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedResForCheckOut(null)}
          title={`Process Departure: ${selectedResForCheckOut.guestName}`}
          description={`Room ${selectedResForCheckOut.roomNumber} • Booking Folio ${selectedResForCheckOut.bookingNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Room Stay Charges:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ${(selectedResForCheckOut.totalAmount * 0.88).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Taxes & Resort Hospitality Fee (12%):</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ${(selectedResForCheckOut.totalAmount * 0.12).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-sm font-black">
                <span className="text-slate-900 dark:text-white">Total Final Folio:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ${selectedResForCheckOut.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 text-orange-800 dark:text-orange-200 text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
              <span>
                Room {selectedResForCheckOut.roomNumber} will automatically transition to{' '}
                <strong>"Cleaning"</strong> and trigger a high-priority housekeeping turnover task.
              </span>
            </div>

            {!selectedResForCheckOut.isPaid && (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20">
                <input
                  type="checkbox"
                  id="chkSettle"
                  checked={settleFolio}
                  onChange={(e) => setSettleFolio(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-blue-600"
                />
                <label htmlFor="chkSettle" className="cursor-pointer">
                  <span className="font-bold text-slate-800 dark:text-white block">
                    Collect Balance & Mark Folio Paid
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Process card on file for ${selectedResForCheckOut.totalAmount.toFixed(2)} and issue
                    receipt.
                  </span>
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedResForCheckOut(null)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleConfirmCheckOut}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Check-Out & Release Room
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
