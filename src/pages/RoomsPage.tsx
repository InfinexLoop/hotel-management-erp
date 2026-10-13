import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Wind,
  Eye,
  Trash2,
  Edit,
  DollarSign,
  Users,
} from 'lucide-react';
import { useHotel } from '@/context/HotelContext';
import { Room, RoomStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { RoomStatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export const RoomsPage: React.FC = () => {
  const { rooms, addRoom, updateRoomStatus, deleteRoom, stats } = useHotel();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New room form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState(1);
  const [newTypeName, setNewTypeName] = useState('Deluxe AC');
  const [newCategoryName, setNewCategoryName] = useState('Standard');
  const [newCapacity, setNewCapacity] = useState(2);
  const [newBedType, setNewBedType] = useState<'King' | 'Queen' | 'Twin Beds' | 'Single'>('Queen');
  const [newPrice, setNewPrice] = useState(135);
  const [newViewType, setNewViewType] = useState<
    'Garden View' | 'City View' | 'Ocean View' | 'Pool View' | 'Courtyard' | 'Panoramic View'
  >('Garden View');
  const [newIsAC, setNewIsAC] = useState(true);

  // Filter logic
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomType.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || r.floor.toString() === floorFilter;
    return matchesSearch && matchesStatus && matchesFloor;
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    addRoom({
      roomNumber: newRoomNumber.trim(),
      floor: Number(newFloor),
      status: 'available',
      capacity: Number(newCapacity),
      bedType: newBedType,
      isAC: newIsAC,
      viewType: newViewType,
      basePricePerNight: Number(newPrice),
      taxPercentage: 12,
      roomType: {
        name: newTypeName,
        category: {
          name: newCategoryName,
          themeColor: 'blue',
        },
      },
      amenities: ['High-speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'Room Safe'],
    });

    setNewRoomNumber('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Room Inventory & Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time room occupancies, turnover readiness, and pricing structures.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Room
        </Button>
      </div>

      {/* Quick Summary Filters Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl text-left border transition-all ${
            statusFilter === 'all'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            All Rooms
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
            {stats.totalRooms}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('available')}
          className={`p-3.5 rounded-2xl text-left border transition-all ${
            statusFilter === 'available'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Available
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
            {stats.availableRooms}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('occupied')}
          className={`p-3.5 rounded-2xl text-left border transition-all ${
            statusFilter === 'occupied'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
            Occupied
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
            {stats.occupiedRooms}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('cleaning')}
          className={`p-3.5 rounded-2xl text-left border transition-all ${
            statusFilter === 'cleaning'
              ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
            Cleaning
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
            {stats.cleaningRooms}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('maintenance')}
          className={`p-3.5 rounded-2xl text-left border transition-all ${
            statusFilter === 'maintenance'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
            Maintenance
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
            {stats.maintenanceRooms}
          </span>
        </button>
      </div>

      {/* Control Bar: Search, Floor Filter, View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by room number or type..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Floor selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Floor:</span>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
            >
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Room Number & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center border border-blue-200/60 dark:border-blue-800">
                      {room.roomNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {room.roomType.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">Floor {room.floor}</p>
                    </div>
                  </div>
                  <RoomStatusBadge status={room.status} />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 my-3.5 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <BedDouble className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{room.bedType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Up to {room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{room.viewType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Wind className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>{room.isAC ? 'Climate A/C' : 'Fan Only'}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ${room.basePricePerNight}
                    </span>
                    <span className="text-[11px] text-slate-400"> / night</span>
                  </div>
                  <span className="text-[10px] text-slate-400">+{room.taxPercentage}% tax</span>
                </div>
              </div>

              {/* Status Update Quick Dropdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-2">
                <select
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value as RoomStatus)}
                  className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <option value="available">🟢 Mark Available</option>
                  <option value="occupied">🔴 Mark Occupied</option>
                  <option value="cleaning">🟠 Send to Cleaning</option>
                  <option value="maintenance">🟣 Maintenance</option>
                </select>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete Room ${room.roomNumber}?`)) {
                      deleteRoom(room.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Room #</th>
                  <th className="px-6 py-4">Type & Category</th>
                  <th className="px-6 py-4">Floor</th>
                  <th className="px-6 py-4">Capacity & Bed</th>
                  <th className="px-6 py-4">View</th>
                  <th className="px-6 py-4">Base Rate</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400 text-sm">
                      {room.roomNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">
                        {room.roomType.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{room.roomType.category.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Floor {room.floor}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {room.bedType} ({room.capacity} guests)
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{room.viewType}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      ${room.basePricePerNight} / night
                    </td>
                    <td className="px-6 py-4">
                      <RoomStatusBadge status={room.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={room.status}
                        onChange={(e) => updateRoomStatus(room.id, e.target.value as RoomStatus)}
                        className="text-xs font-semibold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Hotel Room"
        description="Add a new room to your property management inventory."
      >
        <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                placeholder="e.g. 501"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Floor</label>
              <input
                type="number"
                min="1"
                max="20"
                value={newFloor}
                onChange={(e) => setNewFloor(Number(e.target.value))}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Room Type
              </label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Deluxe Ocean Suite"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="Economy">Economy</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Bed Type
              </label>
              <select
                value={newBedType}
                onChange={(e) => setNewBedType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="King">King</option>
                <option value="Queen">Queen</option>
                <option value="Twin Beds">Twin Beds</option>
                <option value="Single">Single</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Rate ($/night)
              </label>
              <input
                type="number"
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                View Type
              </label>
              <select
                value={newViewType}
                onChange={(e) => setNewViewType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="Garden View">Garden View</option>
                <option value="City View">City View</option>
                <option value="Ocean View">Ocean View</option>
                <option value="Pool View">Pool View</option>
                <option value="Courtyard">Courtyard</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isACNew"
                checked={newIsAC}
                onChange={(e) => setNewIsAC(e.target.checked)}
                className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isACNew" className="font-bold text-slate-700 dark:text-slate-200">
                Air Conditioned (A/C)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
