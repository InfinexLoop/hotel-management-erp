export type Role = 'admin' | 'manager';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
}

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export interface RoomCategory {
  name: string;
  themeColor: string;
}

export interface RoomType {
  name: string;
  category: RoomCategory;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  capacity: number;
  bedType: 'King' | 'Queen' | 'Twin Beds' | 'Single';
  isAC: boolean;
  viewType: 'Garden View' | 'City View' | 'Ocean View' | 'Pool View' | 'Courtyard' | 'Panoramic View';
  basePricePerNight: number;
  taxPercentage: number;
  roomType: RoomType;
  amenities: string[];
  currentReservationId?: string;
}

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Reservation {
  id: string;
  bookingNumber: string;
  roomId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: ReservationStatus;
  isPaid: boolean;
  adults: number;
  children: number;
  specialRequests?: string;
  roomNumber: string;
  roomTypeName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idCardNumber: string;
  nationality: string;
  address: string;
  totalVisits: number;
  totalSpent: number;
  vipStatus: boolean;
  createdAt: string;
}

export type HousekeepingStatus = 'pending' | 'cleaning' | 'completed' | 'inspected';

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  status: HousekeepingStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceStatus = 'pending' | 'in_progress' | 'resolved';

export interface MaintenanceTicket {
  id: string;
  roomId: string;
  roomNumber: string;
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high';
  description: string;
  reportedBy: string;
  createdAt: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationId: string;
  bookingNumber: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer';
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: 'Front Desk' | 'Housekeeping' | 'Maintenance' | 'Management' | 'Food & Beverage';
  position: string;
  salary: number;
  hireDate: string;
  attendanceStatus: 'present' | 'absent' | 'on_leave';
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  category: 'reservation' | 'housekeeping' | 'billing' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface HotelSettings {
  hotelName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currencySymbol: string;
  currencyCode: string;
  taxRate: number;
  checkInTime: string;
  checkOutTime: string;
  sidebarGradient: string;
}
