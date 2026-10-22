import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { ApiError, ErrorType } from '../types/errors';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = () => setError(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = await storage.getToken();
      
      if (token) {
        const profile = await authApi.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error verificando auth:', err);
      await storage.clearAll();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(credentials);
      
      await storage.saveToken(response.accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }
      
      setUser(response.user);
      return true;
    } catch (err) {
      const apiError = err instanceof ApiError 
        ? err 
        : new ApiError(ErrorType.UNKNOWN, 'Error en login');
      setError(apiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(data);
      
      await storage.saveToken(response.accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }
      
      setUser(response.user);
      return true;
    } catch (err) {
      const apiError = err instanceof ApiError 
        ? err 
        : new ApiError(ErrorType.UNKNOWN, 'Error en registro');
      setError(apiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log('Error en logout:', error);
    } finally {
      await storage.clearAll();
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};