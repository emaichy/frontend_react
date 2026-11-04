/**
 * Context para manejo global de autenticación
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types/user';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { handleApiError } from '../utils/errorHandler';
import { ApiError, ErrorType } from '../types/errors';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setLoading(true);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });

      const accessToken = response.accessToken ?? response.token;
      if (!accessToken) {
        throw new ApiError(ErrorType.UNKNOWN, 'La API no devolvió un token de acceso.');
      }
      await storage.saveToken(accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      } else {
        await storage.removeRefreshToken();
      }

      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const accessToken = await storage.getToken();
    await storage.clearAll();
    setUser(null);
    setIsAuthenticated(false);

    if (accessToken) {
      void authApi.logout(accessToken).catch((error: unknown) => {
        console.warn('No se pudo invalidar la sesión en el servidor:', error);
      });
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(checkAuth);
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}