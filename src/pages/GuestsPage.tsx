import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  CreditCard,
  FileText,
  Crown,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Guest } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const GuestsPage: React.FC = () => {
  const { guests, reservations, addGuest, deleteGuest } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGuestForHistory, setSelectedGuestForHistory] = useState<Guest | null>(null);

  // New guest form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [nationality, setNationality] = useState('French');
  const [address, setAddress] = useState('');
  const [vipStatus, setVipStatus] = useState(false);

  const filteredGuests = guests.filter((g) => {
    const term = searchQuery.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(term) ||
      g.lastName.toLowerCase().includes(term) ||
      g.email.toLowerCase().includes(term) ||
      g.nationality.toLowerCase().includes(term)
    );
  });

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    addGuest({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+33 6 00 00 00 00',
      idCardNumber: idCardNumber.trim() || `ID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      nationality,
      address: address.trim() || 'Paris, France',
      vipStatus,
    });

    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIdCardNumber('');
    setAddress('');
    setVipStatus(false);
    setIsAddModalOpen(false);
  };

  const guestBookings = selectedGuestForHistory
    ? reservations.filter((r) => r.guestId === selectedGuestForHistory.id)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Guest Profiles & CRM
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain guest histories, loyalty preferences, and contact records.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Guest
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or nationality..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Showing {filteredGuests.length} of {guests.length} guest records
        </div>
      </div>

      {/* Guest Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {guest.firstName[0]}
                    {guest.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {guest.firstName} {guest.lastName}
                      </h4>
                      {guest.vipStatus && (
                        <span className="p-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600" title="VIP Guest">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      {guest.nationality}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {guest.totalVisits} {guest.totalVisits === 1 ? 'Stay' : 'Stays'}
                </span>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 my-3">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{guest.address}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>ID: {guest.idCardNumber}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Lifetime Value
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white block">
                  ${guest.totalSpent.toLocaleString()}
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedGuestForHistory(guest)}
                icon={<Calendar className="w-3.5 h-3.5" />}
              >
                View Stays
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Hotel Guest"
        description="Add a traveler to the hotel property CRM and reservation directory."
      >
        <form onSubmit={handleCreateGuest} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Laurent"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Blanc"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="laurent.blanc@example.com"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. French, British, American"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                ID / Passport Number
              </label>
              <input
                type="text"
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                placeholder="e.g. FR-829104"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 12 Rue de la Paix, Paris, France"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="vipCheck"
              checked={vipStatus}
              onChange={(e) => setVipStatus(e.target.checked)}
              className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="vipCheck" className="font-bold text-slate-700 dark:text-slate-200">
              Designate as VIP Guest (Priority perks & special welcome amenities)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Guest
            </Button>
          </div>
        </form>
      </Modal>

      {/* Guest Stays History Modal */}
      {selectedGuestForHistory && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGuestForHistory(null)}
          title={`Booking History — ${selectedGuestForHistory.firstName} ${selectedGuestForHistory.lastName}`}
          description={`Registered ID: ${selectedGuestForHistory.idCardNumber} • Total Stays: ${selectedGuestForHistory.totalVisits}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {guestBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active reservations currently registered for this guest.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {guestBookings.map((b) => (
                  <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {b.bookingNumber}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-white">
                          Room {b.roomNumber} ({b.roomTypeName})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {b.checkInDate} to {b.checkOutDate} • {b.status.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-800 dark:text-white block">
                        ${b.totalAmount.toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          b.isPaid ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {b.isPaid ? 'Paid in Full' : 'Folio Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedGuestForHistory(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
