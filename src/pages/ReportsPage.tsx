import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  Percent,
  BedDouble,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useHotel } from '@/context/HotelContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const ReportsPage: React.FC = () => {
  const { stats, reservations, rooms } = useHotel();
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  // Realistic sample financial series
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 24500, adr: 165, occupancy: 62 },
    { month: 'Feb', revenue: 27800, adr: 172, occupancy: 66 },
    { month: 'Mar', revenue: 31200, adr: 180, occupancy: 71 },
    { month: 'Apr', revenue: 34500, adr: 185, occupancy: 74 },
    { month: 'May', revenue: 39800, adr: 195, occupancy: 79 },
    { month: 'Jun', revenue: 46200, adr: 215, occupancy: 88 },
    { month: 'Jul', revenue: 54100, adr: 240, occupancy: 95 },
    { month: 'Aug', revenue: 56800, adr: 245, occupancy: 97 },
    { month: 'Sep', revenue: 42300, adr: 205, occupancy: 82 },
    { month: 'Oct', revenue: 38450, adr: 195, occupancy: 75 },
    { month: 'Nov', revenue: 29500, adr: 170, occupancy: 68 },
    { month: 'Dec', revenue: 48900, adr: 230, occupancy: 91 },
  ];

  const categoryShareData = [
    { name: 'Standard Rooms', value: 35, color: '#3B82F6' },
    { name: 'Deluxe Suites', value: 45, color: '#8B5CF6' },
    { name: 'Presidential & Luxury', value: 20, color: '#10B981' },
  ];

  const channelData = [
    { channel: 'Direct Hotel Booking Engine', percentage: 48, revenue: 18450 },
    { channel: 'Corporate & Consortia', percentage: 24, revenue: 9230 },
    { channel: 'Online Travel Agencies (OTAs)', percentage: 18, revenue: 6920 },
    { channel: 'Walk-In & Telephone', percentage: 10, revenue: 3850 },
  ];

  // Calculated ADR & RevPAR
  const adr = 194.5;
  const revpar = Math.round(adr * (stats.occupancyRate / 100));

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Revenue,ADR,Occupancy_Percent\n' +
      monthlyRevenueData.map((e) => `${e.month},${e.revenue},${e.adr},${e.occupancy}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'infinexloop_hotel_financial_report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Hospitality Analytics & Financial Reports
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise performance indicators, ADR, RevPAR, channel mix, and revenue pace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV Dataset
          </Button>
        </div>
      </div>

      {/* 4 Core Financial KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ADR (Average Daily Rate)
            </span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">${adr.toFixed(2)}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +$14.20 vs budget
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              RevPAR (Yield Metric)
            </span>
            <Percent className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">${revpar.toFixed(2)}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +8.4% RevPAR growth
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Portfolio Occupancy
            </span>
            <BedDouble className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.occupancyRate}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.occupiedRooms} of {stats.totalRooms} rooms occupied
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Annual Projected Gross
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">$474,550</h3>
          <p className="text-[11px] text-slate-400 mt-1">Full property annual forecast</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Full 12-Month Revenue Curve */}
        <div className="lg:col-span-2">
          <Card
            title="Full-Year Revenue Performance ($)"
            subtitle="Historical and forecasted monthly property gross receipts"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyRevenueData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fullRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Monthly Gross']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#fullRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Room Category Revenue Share Donut */}
        <div className="lg:col-span-1">
          <Card
            title="Revenue Contribution by Category"
            subtitle="Share of gross room billings"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: number) => [`${val}%`, 'Contribution']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 text-xs font-semibold">
              {categoryShareData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-800 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Acquisition Channels */}
      <Card
        title="Distribution & Booking Acquisition Channels"
        subtitle="Breakdown of customer reservation source attribution"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channelData.map((item) => (
            <div
              key={item.channel}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                  {item.channel}
                </span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                ${item.revenue.toLocaleString()} captured this period
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
