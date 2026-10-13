import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { HotelProvider } from '@/context/HotelContext';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { RoomsPage } from '@/pages/RoomsPage';
import { ReservationsPage } from '@/pages/ReservationsPage';
import { GuestsPage } from '@/pages/GuestsPage';
import { CheckInPage } from '@/pages/CheckInPage';
import { CheckOutPage } from '@/pages/CheckOutPage';
import { HousekeepingPage } from '@/pages/HousekeepingPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { SettingsPage } from '@/pages/SettingsPage';

// Route guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HotelProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Demo Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Hotel Management Application */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="guests" element={<GuestsPage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="check-in" element={<CheckInPage />} />
                <Route path="check-out" element={<CheckOutPage />} />
                <Route path="housekeeping" element={<HousekeepingPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </HotelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
