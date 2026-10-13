import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Room,
  RoomStatus,
  Reservation,
  ReservationStatus,
  Guest,
  HousekeepingTask,
  HousekeepingStatus,
  MaintenanceTicket,
  MaintenanceStatus,
  Invoice,
  Employee,
  Notification,
  HotelSettings,
} from '@/types';
import {
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_GUESTS,
  INITIAL_HOUSEKEEPING,
  INITIAL_MAINTENANCE,
  INITIAL_INVOICES,
  INITIAL_EMPLOYEES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '@/data/mockData';

interface HotelContextType {
  // State
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  housekeeping: HousekeepingTask[];
  maintenance: MaintenanceTicket[];
  invoices: Invoice[];
  employees: Employee[];
  notifications: Notification[];
  settings: HotelSettings;

  // Actions - Rooms
  addRoom: (roomData: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, roomData: Partial<Room>) => void;
  updateRoomStatus: (id: string, status: RoomStatus) => void;
  deleteRoom: (id: string) => void;

  // Actions - Reservations
  addReservation: (reservationData: Omit<Reservation, 'id' | 'bookingNumber' | 'createdAt'>) => string;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  checkInReservation: (id: string) => void;
  checkOutReservation: (id: string) => void;
  cancelReservation: (id: string) => void;

  // Actions - Guests
  addGuest: (guestData: Omit<Guest, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>) => string;
  updateGuest: (id: string, guestData: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;

  // Actions - Housekeeping & Maintenance
  addHousekeepingTask: (taskData: Omit<HousekeepingTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHousekeepingStatus: (id: string, status: HousekeepingStatus) => void;
  completeHousekeeping: (id: string) => void;
  addMaintenanceTicket: (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus) => void;

  // Actions - Invoices
  addInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  markInvoicePaid: (id: string) => void;

  // Actions - Employees
  addEmployee: (empData: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, empData: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Actions - Notifications
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Actions - Settings & Reset
  updateSettings: (newSettings: Partial<HotelSettings>) => void;
  resetDemoData: () => void;

  // Statistics
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    cleaningRooms: number;
    maintenanceRooms: number;
    occupancyRate: number;
    totalRevenue: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    pendingInvoicesCount: number;
    unreadNotificationsCount: number;
  };
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('infinex_pms_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('infinex_pms_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('infinex_pms_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('infinex_pms_housekeeping');
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('infinex_pms_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('infinex_pms_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('infinex_pms_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('infinex_pms_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem('infinex_pms_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('infinex_pms_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_housekeeping', JSON.stringify(housekeeping));
  }, [housekeeping]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('infinex_pms_settings', JSON.stringify(settings));
  }, [settings]);

  // Notifications helper
  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ROOM ACTIONS
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
    addNotification({
      title: `Room ${newRoom.roomNumber} Added`,
      message: `${newRoom.roomType.name} on Floor ${newRoom.floor} was successfully registered.`,
      type: 'success',
      category: 'system',
    });
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...roomData } : r)));
  };

  const updateRoomStatus = (id: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status };
        }
        return r;
      })
    );
  };

  const deleteRoom = (id: string) => {
    const target = rooms.find((r) => r.id === id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (target) {
      addNotification({
        title: `Room ${target.roomNumber} Removed`,
        message: `Room ${target.roomNumber} was removed from the inventory.`,
        type: 'warning',
        category: 'system',
      });
    }
  };

  // RESERVATION ACTIONS
  const addReservation = (
    reservationData: Omit<Reservation, 'id' | 'bookingNumber' | 'createdAt'>
  ): string => {
    const bookingNumber = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      bookingNumber,
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Update guest total spent & visits
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === reservationData.guestId) {
          return {
            ...g,
            totalVisits: g.totalVisits + 1,
            totalSpent: g.totalSpent + reservationData.totalAmount,
          };
        }
        return g;
      })
    );

    // Create corresponding invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reservationId: newReservation.id,
      bookingNumber: newReservation.bookingNumber,
      guestId: newReservation.guestId,
      guestName: newReservation.guestName,
      guestEmail: newReservation.guestEmail,
      roomNumber: newReservation.roomNumber,
      subtotal: Math.round(newReservation.totalAmount * 0.88),
      tax: Math.round(newReservation.totalAmount * 0.12),
      totalAmount: newReservation.totalAmount,
      paymentMethod: newReservation.isPaid ? 'Credit Card' : 'Credit Card',
      status: newReservation.isPaid ? 'paid' : 'pending',
      issueDate: newReservation.checkInDate,
      dueDate: newReservation.checkOutDate,
      paidAt: newReservation.isPaid ? new Date().toISOString() : undefined,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    addNotification({
      title: `New Reservation #${bookingNumber}`,
      message: `${newReservation.guestName} booked Room ${newReservation.roomNumber} ($${newReservation.totalAmount.toFixed(2)}).`,
      type: 'success',
      category: 'reservation',
    });

    return newReservation.id;
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const checkInReservation = (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // 1. Update reservation status
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'checked_in' } : r))
    );

    // 2. Mark Room as Occupied
    setRooms((prev) =>
      prev.map((room) =>
        room.id === target.roomId || room.roomNumber === target.roomNumber
          ? { ...room, status: 'occupied', currentReservationId: target.id }
          : room
      )
    );

    addNotification({
      title: `Guest Checked In`,
      message: `${target.guestName} has checked into Room ${target.roomNumber}. Key issued.`,
      type: 'success',
      category: 'reservation',
    });
  };

  const checkOutReservation = (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // 1. Update reservation status
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'checked_out' } : r))
    );

    // 2. Room goes to 'cleaning'
    const roomObj = rooms.find((r) => r.id === target.roomId || r.roomNumber === target.roomNumber);
    setRooms((prev) =>
      prev.map((room) =>
        room.id === target.roomId || room.roomNumber === target.roomNumber
          ? { ...room, status: 'cleaning', currentReservationId: undefined }
          : room
      )
    );

    // 3. Create Housekeeping task automatically
    if (roomObj) {
      const newTask: HousekeepingTask = {
        id: `hk-${Date.now()}`,
        roomId: roomObj.id,
        roomNumber: roomObj.roomNumber,
        floor: roomObj.floor,
        status: 'pending',
        priority: 'high',
        assignedTo: 'Turnover Housekeeping Crew',
        notes: `Turnover service after departure of ${target.guestName}. Sanitize room and restock.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setHousekeeping((prev) => [newTask, ...prev]);
    }

    addNotification({
      title: `Guest Checked Out`,
      message: `${target.guestName} has checked out of Room ${target.roomNumber}. Housekeeping alerted.`,
      type: 'info',
      category: 'reservation',
    });
  };

  const cancelReservation = (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );

    // Make room available if it was occupied by this reservation
    setRooms((prev) =>
      prev.map((room) =>
        room.currentReservationId === id
          ? { ...room, status: 'available', currentReservationId: undefined }
          : room
      )
    );

    addNotification({
      title: `Reservation Cancelled`,
      message: `Booking #${target.bookingNumber} for ${target.guestName} was cancelled.`,
      type: 'warning',
      category: 'reservation',
    });
  };

  // GUEST ACTIONS
  const addGuest = (
    guestData: Omit<Guest, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>
  ): string => {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}`,
      totalVisits: 1,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    setGuests((prev) => [newGuest, ...prev]);
    addNotification({
      title: `Guest Profile Created`,
      message: `${newGuest.firstName} ${newGuest.lastName} (${newGuest.nationality}) added to directory.`,
      type: 'success',
      category: 'system',
    });
    return newGuest.id;
  };

  const updateGuest = (id: string, guestData: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...guestData } : g)));
  };

  const deleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // HOUSEKEEPING ACTIONS
  const addHousekeepingTask = (
    taskData: Omit<HousekeepingTask, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newTask: HousekeepingTask = {
      ...taskData,
      id: `hk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHousekeeping((prev) => [newTask, ...prev]);
  };

  const updateHousekeepingStatus = (id: string, status: HousekeepingStatus) => {
    setHousekeeping((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  const completeHousekeeping = (id: string) => {
    const task = housekeeping.find((t) => t.id === id);
    if (!task) return;

    // 1. Mark task completed
    setHousekeeping((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed', updatedAt: new Date().toISOString() } : t))
    );

    // 2. Mark Room as Available!
    setRooms((prev) =>
      prev.map((room) =>
        room.id === task.roomId || room.roomNumber === task.roomNumber
          ? { ...room, status: 'available' }
          : room
      )
    );

    addNotification({
      title: `Room ${task.roomNumber} Cleaned & Ready`,
      message: `Housekeeping turnover completed. Room is now Available for check-in.`,
      type: 'success',
      category: 'housekeeping',
    });
  };

  // MAINTENANCE ACTIONS
  const addMaintenanceTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMaintenance((prev) => [newTicket, ...prev]);

    // Flag room as maintenance
    setRooms((prev) =>
      prev.map((r) =>
        r.id === ticketData.roomId || r.roomNumber === ticketData.roomNumber
          ? { ...r, status: 'maintenance' }
          : r
      )
    );

    addNotification({
      title: `Maintenance Ticket Created`,
      message: `Room ${ticketData.roomNumber}: ${ticketData.description}`,
      type: 'warning',
      category: 'system',
    });
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceStatus) => {
    setMaintenance((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, status } : t));
      const target = prev.find((t) => t.id === id);
      if (status === 'resolved' && target) {
        // Mark room available
        setRooms((rList) =>
          rList.map((room) =>
            room.id === target.roomId || room.roomNumber === target.roomNumber
              ? { ...room, status: 'available' }
              : room
          )
        );
        addNotification({
          title: `Maintenance Resolved`,
          message: `Ticket for Room ${target.roomNumber} resolved. Room returned to Available.`,
          type: 'success',
          category: 'system',
        });
      }
      return updated;
    });
  };

  // INVOICE ACTIONS
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const markInvoicePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: 'paid', paidAt: new Date().toISOString() }
          : inv
      )
    );
    const target = invoices.find((i) => i.id === id);
    if (target) {
      // Mark reservation paid if linked
      setReservations((rList) =>
        rList.map((r) =>
          r.id === target.reservationId || r.bookingNumber === target.bookingNumber
            ? { ...r, isPaid: true }
            : r
        )
      );
      addNotification({
        title: `Payment Received`,
        message: `Invoice #${target.invoiceNumber} ($${target.totalAmount.toFixed(2)}) marked as paid.`,
        type: 'success',
        category: 'billing',
      });
    }
  };

  // EMPLOYEE ACTIONS
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    addNotification({
      title: `Staff Member Added`,
      message: `${newEmp.firstName} ${newEmp.lastName} joined ${newEmp.department} as ${newEmp.position}.`,
      type: 'info',
      category: 'system',
    });
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // NOTIFICATION ACTIONS
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // SETTINGS & RESET
  const updateSettings = (newSettings: Partial<HotelSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addNotification({
      title: `Settings Saved`,
      message: `System configuration and property details updated.`,
      type: 'success',
      category: 'system',
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem('infinex_pms_rooms');
    localStorage.removeItem('infinex_pms_reservations');
    localStorage.removeItem('infinex_pms_guests');
    localStorage.removeItem('infinex_pms_housekeeping');
    localStorage.removeItem('infinex_pms_maintenance');
    localStorage.removeItem('infinex_pms_invoices');
    localStorage.removeItem('infinex_pms_employees');
    localStorage.removeItem('infinex_pms_notifications');
    localStorage.removeItem('infinex_pms_settings');

    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setGuests(INITIAL_GUESTS);
    setHousekeeping(INITIAL_HOUSEKEEPING);
    setMaintenance(INITIAL_MAINTENANCE);
    setInvoices(INITIAL_INVOICES);
    setEmployees(INITIAL_EMPLOYEES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);

    addNotification({
      title: `Demo Data Reset`,
      message: `All records reverted to pristine InfinexLoop demonstration seed values.`,
      type: 'info',
      category: 'system',
    });
  };

  // COMPUTED STATS
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Calculate revenue from paid invoices + paid reservations
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const todayStr = '2026-10-13'; // reference demo date
  const todayCheckIns = reservations.filter(
    (r) => r.checkInDate === todayStr || (r.status === 'confirmed' && r.checkInDate <= todayStr)
  ).length;

  const todayCheckOuts = reservations.filter(
    (r) => r.checkOutDate === todayStr || (r.status === 'checked_in' && r.checkOutDate <= todayStr)
  ).length;

  const pendingInvoicesCount = invoices.filter((i) => i.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <HotelContext.Provider
      value={{
        rooms,
        reservations,
        guests,
        housekeeping,
        maintenance,
        invoices,
        employees,
        notifications,
        settings,
        addRoom,
        updateRoom,
        updateRoomStatus,
        deleteRoom,
        addReservation,
        updateReservationStatus,
        checkInReservation,
        checkOutReservation,
        cancelReservation,
        addGuest,
        updateGuest,
        deleteGuest,
        addHousekeepingTask,
        updateHousekeepingStatus,
        completeHousekeeping,
        addMaintenanceTicket,
        updateMaintenanceStatus,
        addInvoice,
        markInvoicePaid,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetDemoData,
        stats: {
          totalRooms,
          occupiedRooms,
          availableRooms,
          cleaningRooms,
          maintenanceRooms,
          occupancyRate,
          totalRevenue,
          todayCheckIns,
          todayCheckOuts,
          pendingInvoicesCount,
          unreadNotificationsCount,
        },
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
