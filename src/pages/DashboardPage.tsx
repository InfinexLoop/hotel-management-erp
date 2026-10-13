import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Users,
  CalendarCheck,
  Sparkles,
  DollarSign,
  ArrowRight,
  Plus,
  LogIn,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useHotel } from '@/context/HotelContext';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/common/Card';
import { ReservationStatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const DashboardPage: React.FC = () => {
  const { role, user } = useAuth();
  const { stats, reservations, rooms, guests, addReservation, settings } = useHotel();
  const navigate = useNavigate();

  // Quick New Reservation Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState(guests[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState(
    rooms.find((r) => r.status === 'available')?.id || rooms[0]?.id || ''
  );
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [adults, setAdults] = useState(2);
  const [isPaid, setIsPaid] = useState(false);

  // Chart Data
  const revenueChartData = [
    { day: 'Mon', revenue: 1420, occupancy: 68 },
    { day: 'Tue', revenue: 1850, occupancy: 75 },
    { day: 'Wed', revenue: 2100, occupancy: 82 },
    { day: 'Thu', revenue: 2450, occupancy: 88 },
    { day: 'Fri', revenue: 3200, occupancy: 94 },
    { day: 'Sat', revenue: 3650, occupancy: 100 },
    { day: 'Sun', revenue: 2890, occupancy: 85 },
  ];

  const occupancyDistData = [
    { name: 'Standard', occupied: 4, available: 2 },
    { name: 'Deluxe', occupied: 5, available: 1 },
    { name: 'Luxury', occupied: 2, available: 2 },
  ];

  const handleCreateQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const guestObj = guests.find((g) => g.id === selectedGuestId);
    const roomObj = rooms.find((r) => r.id === selectedRoomId);
    if (!guestObj || !roomObj) return;

    // Calculate nights
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
      adults,
      children: 0,
      specialRequests: 'Quick booking created from dashboard widget.',
    });

    setIsBookingModalOpen(false);
  };

  const total = stats.totalRooms || 1;
  const availPct = Math.round((stats.availableRooms / total) * 100);
  const occPct = Math.round((stats.occupiedRooms / total) * 100);
  const cleanPct = Math.round((stats.cleaningRooms / total) * 100);
  const maintPct = Math.round((stats.maintenanceRooms / total) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back,{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
              {role === 'admin' ? 'Administrator' : 'Property Manager'}
            </span>
            . Here is today's real-time property overview for {settings.hotelName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Tuesday, Oct 13, 2026</span>
          </div>

          <Button
            onClick={() => setIsBookingModalOpen(true)}
            variant="gradient"
            icon={<Plus className="w-4 h-4" />}
          >
            New Reservation
          </Button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<BedDouble className="w-6 h-6" />}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-950/60"
          change="100% capacity registered"
          trend="neutral"
          onClick={() => navigate('/rooms')}
        />
        <StatCard
          title="Occupied"
          value={stats.occupiedRooms}
          icon={<Users className="w-6 h-6" />}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-100 dark:bg-rose-950/60"
          change={`${stats.occupancyRate}% occupancy rate`}
          trend="up"
          onClick={() => navigate('/rooms?status=occupied')}
        />
        <StatCard
          title="Available"
          value={stats.availableRooms}
          icon={<CalendarCheck className="w-6 h-6" />}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-950/60"
          change="Ready for instant check-in"
          trend="up"
          onClick={() => navigate('/rooms?status=available')}
        />
        <StatCard
          title="Dirty / Cleaning"
          value={stats.cleaningRooms}
          icon={<Sparkles className="w-6 h-6" />}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBg="bg-orange-100 dark:bg-orange-950/60"
          change="Assigned to housekeeping"
          trend="neutral"
          onClick={() => navigate('/housekeeping')}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-6 h-6" />}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-100 dark:bg-indigo-950/60"
          change="+18.4% vs last period"
          trend="up"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Main Grid: Left 2 Cols (Room Status Bar & Revenue Chart) | Right 1 Col (Quick Actions & Today's Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Room Status Multi-segmented Progress Bar Card */}
          <Card
            title="Room Status Breakdown"
            subtitle="Current distribution across all property room inventories"
          >
            <div className="space-y-4">
              {/* Segmented Bar */}
              <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${availPct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                  title={`Available: ${stats.availableRooms} (${availPct}%)`}
                />
                <div
                  style={{ width: `${occPct}%` }}
                  className="bg-rose-500 h-full transition-all duration-500"
                  title={`Occupied: ${stats.occupiedRooms} (${occPct}%)`}
                />
                <div
                  style={{ width: `${cleanPct}%` }}
                  className="bg-orange-500 h-full transition-all duration-500"
                  title={`Cleaning: ${stats.cleaningRooms} (${cleanPct}%)`}
                />
                <div
                  style={{ width: `${maintPct}%` }}
                  className="bg-purple-500 h-full transition-all duration-500"
                  title={`Maintenance: ${stats.maintenanceRooms} (${maintPct}%)`}
                />
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Available: {stats.availableRooms}</span>
                  <span className="ml-auto text-emerald-600/70">{availPct}%</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/60 text-rose-700 dark:text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Occupied: {stats.occupiedRooms}</span>
                  <span className="ml-auto text-rose-600/70">{occPct}%</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/60 text-orange-700 dark:text-orange-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>Cleaning: {stats.cleaningRooms}</span>
                  <span className="ml-auto text-orange-600/70">{cleanPct}%</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Maintenance: {stats.maintenanceRooms}</span>
                  <span className="ml-auto text-purple-600/70">{maintPct}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue Performance Area Chart */}
          <Card
            title="Weekly Revenue & Occupancy Pace"
            subtitle="Demonstrating dynamic revenue metrics and occupancy correlation"
            action={
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Analytics Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Daily Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Reservations Table */}
          <Card
            title="Recent Reservations"
            subtitle="Latest bookings logged into the ERP system"
            action={
              <button
                onClick={() => navigate('/reservations')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Reservations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
            padding="none"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60">
                  <tr>
                    <th className="px-6 py-3.5">Booking #</th>
                    <th className="px-6 py-3.5">Guest</th>
                    <th className="px-6 py-3.5">Room</th>
                    <th className="px-6 py-3.5">Dates</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 font-medium">
                  {reservations.slice(0, 5).map((res) => (
                    <tr
                      key={res.id}
                      onClick={() => navigate('/reservations')}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                        {res.bookingNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-white">
                          {res.guestName}
                        </div>
                        <div className="text-[11px] text-slate-400">{res.guestEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Room {res.roomNumber}
                        </span>
                        <div className="text-[11px] text-slate-400">{res.roomTypeName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {res.checkInDate} → {res.checkOutDate}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                        ${res.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <ReservationStatusBadge status={res.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Quick Actions, Today's Activity, and Room Occupancy Type */}
        <div className="space-y-8">
          {/* Quick Actions Gradient Card */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg text-white space-y-4">
            <div>
              <h3 className="text-lg font-black tracking-tight">Express Front Desk Actions</h3>
              <p className="text-xs text-blue-100/90 mt-1">
                Direct shortcuts for core daily operations.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 px-4 rounded-2xl font-bold flex items-center justify-between cursor-pointer text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-white" />
                  <span>Create New Reservation</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={() => navigate('/check-in')}
                className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 px-4 rounded-2xl font-bold flex items-center justify-between cursor-pointer text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Process Check-In</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={() => navigate('/check-out')}
                className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 px-4 rounded-2xl font-bold flex items-center justify-between cursor-pointer text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-white" />
                  <span>Process Check-Out</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={() => navigate('/housekeeping')}
                className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 px-4 rounded-2xl font-bold flex items-center justify-between cursor-pointer text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Housekeeping Dashboard</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>
            </div>
          </div>

          {/* Today's Operational Activity Card */}
          <Card
            title="Today's Operational Activity"
            subtitle="Scheduled arrivals, departures, and turnover status"
          >
            <div className="space-y-4">
              <div
                onClick={() => navigate('/check-in')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {stats.todayCheckIns} Check-Ins Due
                    </p>
                    <p className="text-xs text-slate-400">Expected arrivals today</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => navigate('/check-out')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {stats.todayCheckOuts} Check-Outs Due
                    </p>
                    <p className="text-xs text-slate-400">Scheduled departures today</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => navigate('/housekeeping')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {stats.cleaningRooms} Rooms To Turn Over
                    </p>
                    <p className="text-xs text-slate-400">Housekeeping cleaning tasks</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </Card>

          {/* Occupancy Category Distribution Chart */}
          <Card title="Room Category Occupancy" subtitle="Active occupied vs available capacity">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyDistData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="occupied" fill="#2563EB" radius={[6, 6, 0, 0]} name="Occupied" />
                  <Bar dataKey="available" fill="#10B981" radius={[6, 6, 0, 0]} name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Create New Reservation"
        description="Book a room directly into the live property management system."
      >
        <form onSubmit={handleCreateQuickBooking} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Guest
            </label>
            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.firstName} {g.lastName} ({g.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Available Room
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
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
                Check-In Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
              </input>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
              </input>
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
                onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isPaidQuick"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPaidQuick" className="font-bold text-slate-700 dark:text-slate-200">
                Mark as Pre-Paid
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Save Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
