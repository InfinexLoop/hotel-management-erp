import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Building,
  RotateCcw,
  Save,
  CheckCircle2,
  Lock,
  Paintbrush,
  DollarSign,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const SettingsPage: React.FC = () => {
  const { role } = useAuth();
  const { settings, updateSettings, resetDemoData, stats, rooms, reservations, guests, invoices } =
    useHotel();

  // Role Restriction Check: If Manager attempts to open /settings
  if (role !== 'admin') {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Administrator Access Required
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The System Settings module is restricted to executive Administrators only. Property
          Managers have operational privileges across Front Desk, Housekeeping, Guests, and
          Invoicing.
        </p>
      </div>
    );
  }

  // Admin settings form state
  const [hotelName, setHotelName] = useState(settings.hotelName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [checkInTime, setCheckInTime] = useState(settings.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(settings.checkOutTime);
  const [sidebarGradient, setSidebarGradient] = useState(
    settings.sidebarGradient || 'linear-gradient(to bottom, #2563EB, #7C3AED)'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hotelName,
      tagline,
      address,
      phone,
      email,
      taxRate: Number(taxRate),
      checkInTime,
      checkOutTime,
      sidebarGradient,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const gradientOptions = [
    { label: 'Royal Blue & Violet (Default)', value: 'linear-gradient(to bottom, #2563EB, #7C3AED)' },
    { label: 'Deep Indigo & Blue', value: 'linear-gradient(to bottom, #1E3A8A, #2563EB)' },
    { label: 'Emerald Luxury & Teal', value: 'linear-gradient(to bottom, #047857, #0D9488)' },
    { label: 'Sleek Obsidian & Slate', value: 'linear-gradient(to bottom, #0F172A, #334155)' },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              System Settings & Property Configuration
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global enterprise configurations, branding aesthetics, and sales demonstration data.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Hotel Profile */}
        <Card
          title="Property Identity & Location"
          subtitle="Displayed across official folio receipts, guest confirmations, and top navigation"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Property Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Reservations Inquiries Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Operational & Financial Standards */}
        <Card
          title="Operational Parameters & Hospitality Taxes"
          subtitle="Standard daily check-in windows and VAT calculation rates"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Hospitality Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Standard Check-In Time
              </label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                placeholder="15:00"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Standard Check-Out Time
              </label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                placeholder="11:00"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </Card>

        {/* Branding & Visual Gradient Theme */}
        <Card
          title="Sidebar Aesthetic & Color Gradient"
          subtitle="Customize the sidebar look and feel for prospective client presentations"
        >
          <div className="space-y-4 text-xs">
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-2">
              Select Sidebar Palette Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gradientOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setSidebarGradient(opt.value)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    sidebarGradient === opt.value
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ background: opt.value }}
                      className="w-8 h-8 rounded-xl shadow-xs shrink-0"
                    />
                    <span className="font-bold text-slate-800 dark:text-white">{opt.label}</span>
                  </div>
                  {sidebarGradient === opt.value && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Save System Settings
          </Button>
        </div>
      </form>

      {/* Sales Demonstration Data Management Card */}
      <Card
        title="Demonstration Data & Reset Control"
        subtitle="Manage the client demonstration state in the current browser session"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white">
              Restore Factory Demo Seed Dataset
            </h4>
            <p className="text-slate-400 mt-1 max-w-lg leading-relaxed">
              If client walkthroughs have modified records, you can revert all 16 rooms, bookings,
              housekeeping tasks, staff, and folios back to the original demo values in 1 click.
            </p>
          </div>

          <Button
            onClick={() => setIsResetConfirmOpen(true)}
            variant="outline"
            className="text-rose-600 border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Demo Data
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Revert All Demo Records?"
          description="Confirm demo data reset for InfinexLoop Hotel Management ERP."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-center p-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This will overwrite any created rooms, reservations, or payments with the initial
              fictional seed data.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
              >
                Confirm Factory Reset
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
