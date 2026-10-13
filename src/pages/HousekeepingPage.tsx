import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  Clock,
  Plus,
  AlertTriangle,
  User,
  BedDouble,
  ShieldAlert,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { HousekeepingStatus, MaintenanceStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { HousekeepingStatusBadge, Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const HousekeepingPage: React.FC = () => {
  const {
    housekeeping,
    maintenance,
    rooms,
    completeHousekeeping,
    updateHousekeepingStatus,
    addMaintenanceTicket,
    updateMaintenanceStatus,
    stats,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'housekeeping' | 'maintenance'>('housekeeping');
  const [hkFilter, setHkFilter] = useState<string>('all');
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);

  // New maintenance ticket state
  const [maintRoomId, setMaintRoomId] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintPriority, setMaintPriority] = useState<'low' | 'medium' | 'high'>('high');

  const filteredHk = housekeeping.filter((task) => {
    if (hkFilter === 'all') return true;
    return task.status === hkFilter;
  });

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const roomObj = rooms.find((r) => r.id === maintRoomId || r.roomNumber === maintRoomId);
    if (!roomObj || !maintDesc.trim()) return;

    addMaintenanceTicket({
      roomId: roomObj.id,
      roomNumber: roomObj.roomNumber,
      status: 'in_progress',
      priority: maintPriority,
      description: maintDesc.trim(),
      reportedBy: 'Housekeeping Department',
    });

    setMaintDesc('');
    setIsMaintModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Housekeeping & Facilities Operations
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch room sanitization, monitor turnover statuses, and manage facility repairs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsMaintModalOpen(true)}
            variant="outline"
            icon={<Wrench className="w-4 h-4" />}
          >
            Report Maintenance Issue
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Rooms In Cleaning
          </p>
          <h3 className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
            {stats.cleaningRooms}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Turnovers in progress</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending Tasks
          </p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {housekeeping.filter((t) => t.status === 'pending').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Queued for housekeeping</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Cleaned & Ready
          </p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.availableRooms}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Inspected & available</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Maintenance Tickets
          </p>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {maintenance.filter((m) => m.status !== 'resolved').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Active facilities tickets</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('housekeeping')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'housekeeping'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Housekeeping Turnover Tasks ({housekeeping.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'maintenance'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Facilities Maintenance Log ({maintenance.length})</span>
        </button>
      </div>

      {/* Tab 1: Housekeeping Tasks */}
      {activeTab === 'housekeeping' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Filter Status:</span>
            {['all', 'pending', 'cleaning', 'completed', 'inspected'].map((st) => (
              <button
                key={st}
                onClick={() => setHkFilter(st)}
                className={`px-3 py-1 rounded-xl capitalize font-semibold transition-colors cursor-pointer ${
                  hkFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHk.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 font-black text-sm flex items-center justify-center">
                        {task.roomNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                          Room {task.roomNumber}
                        </h4>
                        <p className="text-[11px] text-slate-400">Floor {task.floor}</p>
                      </div>
                    </div>
                    <HousekeepingStatusBadge status={task.status} />
                  </div>

                  <div className="space-y-2 text-xs my-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Assigned Housekeeper:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {task.assignedTo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Priority Level:</span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 italic">
                        "{task.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {task.status !== 'completed' && task.status !== 'inspected' ? (
                    <Button
                      onClick={() => completeHousekeeping(task.id)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Mark Cleaned & Available
                    </Button>
                  ) : (
                    <span className="w-full text-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      ✓ Turnover Complete
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Maintenance Log */}
      {activeTab === 'maintenance' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Room #</th>
                  <th className="px-6 py-4">Issue Description</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Reported By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {maintenance.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-black text-purple-600 dark:text-purple-400">
                      Room {ticket.roomNumber}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white max-w-sm">
                      {ticket.description}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          ticket.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{ticket.reportedBy}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ticket.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.status !== 'resolved' ? (
                        <button
                          onClick={() => updateMaintenanceStatus(ticket.id, 'resolved')}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Maintenance Modal */}
      <Modal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        title="Report Facility Maintenance Issue"
        description="Flag a hotel room for maintenance technician repair and inspection."
      >
        <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Room *
            </label>
            <select
              value={maintRoomId}
              onChange={(e) => setMaintRoomId(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              <option value="">Select a room...</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - Floor {r.floor} ({r.roomType.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Priority Level
            </label>
            <select
              value={maintPriority}
              onChange={(e) => setMaintPriority(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High / Urgent (Block Room)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Defect Description *
            </label>
            <textarea
              value={maintDesc}
              onChange={(e) => setMaintDesc(e.target.value)}
              placeholder="e.g. AC compressor noise, shower drainage slow, lighting repair..."
              rows={3}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsMaintModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
