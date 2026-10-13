import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  Printer,
  CheckCircle2,
  FileText,
  Building,
  CreditCard,
  Plus,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Invoice } from '@/types';
import { Card } from '@/components/common/Card';
import { InvoiceStatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { BRANDING } from '@/config/branding';

export const InvoicesPage: React.FC = () => {
  const { invoices, markInvoicePaid, addInvoice, settings, stats } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New invoice state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('101');
  const [subtotal, setSubtotal] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState<
    'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer'
  >('Credit Card');

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.guestName.toLowerCase().includes(q) ||
      inv.bookingNumber.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const tax = Math.round(subtotal * (settings.taxRate / 100));
    const totalAmount = subtotal + tax;

    addInvoice({
      reservationId: `manual-${Date.now()}`,
      bookingNumber: `RES-${Math.floor(2000 + Math.random() * 8000)}`,
      guestId: `manual-guest`,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || 'guest@hotel.com',
      roomNumber,
      subtotal,
      tax,
      totalAmount,
      paymentMethod,
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    });

    setGuestName('');
    setIsCreateModalOpen(false);
  };

  const totalCollected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, curr) => sum + curr.totalAmount, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, curr) => sum + curr.totalAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Invoices & Billing Folios
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track collected room revenues, outstanding incidentals, and guest tax invoices.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          Create Manual Folio
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Revenue Collected
          </p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Paid invoices in system</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending Folio Balances
          </p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.pendingInvoicesCount} invoices pending</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Invoices Issued
          </p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {invoices.length} Folios
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Generated via ERP</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, guest, or booking..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Guest Name</th>
                <th className="px-6 py-4">Booking & Room</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400 text-sm">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{inv.guestName}</div>
                    <div className="text-[11px] text-slate-400">{inv.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Room {inv.roomNumber}
                    </span>
                    <div className="text-[11px] text-slate-400">{inv.bookingNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{inv.issueDate}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {inv.paymentMethod}
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-sm">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => markInvoicePaid(inv.id)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Mark Invoice Paid"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settle
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Print / View Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View & Print Receipt Modal */}
      {selectedInvoiceForPrint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoiceForPrint(null)}
          title="Hotel Folio Receipt"
          description={`Official Statement: ${selectedInvoiceForPrint.invoiceNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs p-2">
            {/* Printable Receipt Paper Card */}
            <div className="border border-slate-200 dark:border-slate-700 p-6 sm:p-8 rounded-3xl bg-slate-50/60 dark:bg-slate-900/60 space-y-6">
              {/* Hotel Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {settings.hotelName}
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">{settings.address}</p>
                  <p className="text-slate-500 text-[11px]">
                    Tel: {settings.phone} • Email: {settings.email}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                    {selectedInvoiceForPrint.status === 'paid' ? 'Paid Receipt' : 'Invoice Due'}
                  </span>
                  <p className="text-slate-400 text-[10px] mt-1.5 font-bold">
                    {selectedInvoiceForPrint.invoiceNumber}
                  </p>
                </div>
              </div>

              {/* Guest & Reservation Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Billed To:
                  </span>
                  <p className="font-black text-slate-900 dark:text-white text-sm">
                    {selectedInvoiceForPrint.guestName}
                  </p>
                  <p className="text-slate-500 text-[11px]">{selectedInvoiceForPrint.guestEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Stay Details:
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Room {selectedInvoiceForPrint.roomNumber} • {selectedInvoiceForPrint.bookingNumber}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Issue Date: {selectedInvoiceForPrint.issueDate}
                  </p>
                </div>
              </div>

              {/* Folio Items Table */}
              <div className="border rounded-2xl overflow-hidden border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Qty / Nights</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800 dark:text-white">
                        Room Accommodation & Luxury Resort Amenities
                      </td>
                      <td className="p-3 text-right text-slate-500">1 Stay</td>
                      <td className="p-3 text-right font-bold text-slate-800 dark:text-white">
                        ${selectedInvoiceForPrint.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800 dark:text-white">
                        Hospitality City Tax & Service ({settings.taxRate}%)
                      </td>
                      <td className="p-3 text-right text-slate-500">12%</td>
                      <td className="p-3 text-right font-bold text-slate-800 dark:text-white">
                        ${selectedInvoiceForPrint.tax.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col items-end gap-1">
                <div className="flex justify-between w-48 text-xs text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-bold">${selectedInvoiceForPrint.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 text-xs text-slate-500">
                  <span>Tax ({settings.taxRate}%):</span>
                  <span className="font-bold">${selectedInvoiceForPrint.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${selectedInvoiceForPrint.totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Payment Method: {selectedInvoiceForPrint.paymentMethod}
                </p>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedInvoiceForPrint(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print Official Folio
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Manual Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Custom Hotel Billing Folio"
        description="Issue an itemized charge folio for room incidentals or event services."
      >
        <form onSubmit={handleCreateCustomInvoice} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Guest Full Name *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Jean Dupont"
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Guest Email
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="101"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Subtotal Amount ($) *
              </label>
              <input
                type="number"
                min="1"
                value={subtotal}
                onChange={(e) => setSubtotal(Number(e.target.value))}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Folio
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
