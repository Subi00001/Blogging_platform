import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { IUser } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserProfile: (data: { name?: string; bio?: string; profileImage?: string }) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const savedUser = localStorage.getItem('blogspace_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('blogspace_token');
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('blogspace_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('blogspace_user', JSON.stringify(res.data.user));
          }
        } catch {
          localStorage.removeItem('blogspace_token');
          localStorage.removeItem('blogspace_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('blogspace_token', newToken);
        localStorage.setItem('blogspace_user', JSON.stringify(newUser));
        showToast(`Welcome back, ${newUser.name}!`, 'success');
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('blogspace_token', newToken);
        localStorage.setItem('blogspace_user', JSON.stringify(newUser));
        showToast('Registration successful! Welcome to BlogSpace.', 'success');
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blogspace_token');
    localStorage.removeItem('blogspace_user');
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = async (data: { name?: string; bio?: string; profileImage?: string }) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('blogspace_user', JSON.stringify(res.data.user));
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Update failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('blogspace_user', JSON.stringify(res.data.user));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
        showToast,
        toasts,
        removeToast,
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
