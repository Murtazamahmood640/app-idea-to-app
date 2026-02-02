import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse, UserRole } from '@/types';
import apiService from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = apiService.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.get<AuthResponse>(API_ENDPOINTS.ME);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Token invalid or expired
      apiService.setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.success && response.data) {
        apiService.setToken(response.data.token);
        setUser(response.data.user);
      }

      return response;
    } catch (error: unknown) {
      const err = error as { message?: string; errors?: Record<string, string[]> };
      return {
        success: false,
        message: err.message || 'Login failed',
        errors: err.errors,
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.REGISTER, {
        name,
        email,
        password,
        password_confirmation: password,
        role,
      });

      if (response.success && response.data) {
        apiService.setToken(response.data.token);
        setUser(response.data.user);
      }

      return response;
    } catch (error: unknown) {
      const err = error as { message?: string; errors?: Record<string, string[]> };
      return {
        success: false,
        message: err.message || 'Registration failed',
        errors: err.errors,
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.post(API_ENDPOINTS.LOGOUT);
    } catch {
      // Ignore logout errors
    } finally {
      apiService.setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
