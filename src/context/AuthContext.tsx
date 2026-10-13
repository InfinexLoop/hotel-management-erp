import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (selectedRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'usr-admin',
  email: 'admin@hotel.com',
  firstName: 'Alexander',
  lastName: 'Vance',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const MANAGER_USER: User = {
  id: 'usr-manager',
  email: 'manager@hotel.com',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  role: 'manager',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem('infinex_pms_role');
    return (saved === 'admin' || saved === 'manager') ? saved : 'admin'; // default to admin for seamless demo preview if desired, or check token
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedRole = localStorage.getItem('infinex_pms_role') || 'admin';
    return savedRole === 'manager' ? MANAGER_USER : ADMIN_USER;
  });

  useEffect(() => {
    const savedRole = localStorage.getItem('infinex_pms_role') as Role | null;
    if (savedRole === 'admin') {
      setRole('admin');
      setUser(ADMIN_USER);
    } else if (savedRole === 'manager') {
      setRole('manager');
      setUser(MANAGER_USER);
    } else {
      // Initialize with admin for instant client access if no token exists
      setRole('admin');
      setUser(ADMIN_USER);
      localStorage.setItem('infinex_pms_role', 'admin');
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'admin@hotel.com' && cleanPassword === 'admin123') {
      localStorage.setItem('infinex_pms_role', 'admin');
      setRole('admin');
      setUser(ADMIN_USER);
      return { success: true };
    }

    if (cleanEmail === 'manager@hotel.com' && cleanPassword === 'manager123') {
      localStorage.setItem('infinex_pms_role', 'manager');
      setRole('manager');
      setUser(MANAGER_USER);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please use the demo quick-login buttons below.',
    };
  };

  const quickLogin = (selectedRole: Role) => {
    localStorage.setItem('infinex_pms_role', selectedRole);
    setRole(selectedRole);
    setUser(selectedRole === 'admin' ? ADMIN_USER : MANAGER_USER);
  };

  const logout = () => {
    localStorage.removeItem('infinex_pms_role');
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!role,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
