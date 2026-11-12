/**
 * Hook personalizado para manejo de autenticación segura con Redux e isMounted pattern
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import * as authApi from '../api/auth.api';
import { storage } from '../utils/storage';
import { setToken, setUser, logout as clearAuthState } from '../store/store';
import { removeStorage } from '../utils/authStorage';
import { handleApiError } from '../utils/errorHandler';
import { ApiError, ErrorType } from '../types/errors';
import { User } from '../types/user';
import { RegisterData } from '../types/auth';

interface UseAuthState {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
}

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

interface UseAuthReturn extends UseAuthState {
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (data: RegisterData) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        if (isMounted.current) {
          setState((prev) => ({ ...prev, isAuthenticated: false }));
        }
        return;
      }

      if (isMounted.current) {
        setState((prev) => ({ ...prev, loading: true }));
      }

      const user = await authApi.getCurrentUser();
      dispatch(setToken(token));
      dispatch(setUser(user));

      if (isMounted.current) {
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }
    } catch {
      if (isMounted.current) {
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      }
    }
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    if (isMounted.current) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    try {
      const response = await authApi.login({ email, password });
      const accessToken = response.accessToken ?? response.token;

      if (!accessToken) {
        throw new ApiError(ErrorType.UNKNOWN, 'La API no devolvió un token de acceso.');
      }

      await storage.saveToken(accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      dispatch(setToken(accessToken));
      dispatch(setUser(response.user));

      if (isMounted.current) {
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }

      return { ok: true };
    } catch (error) {
      const apiError = handleApiError(error);
      if (isMounted.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiError,
          isAuthenticated: false,
        }));
      }
      return { ok: false, error: apiError.message };
    }
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData): Promise<AuthActionResult> => {
    if (isMounted.current) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    try {
      await authApi.register(data);
      return await login(data.email, data.password);
    } catch (error) {
      const apiError = handleApiError(error);
      if (isMounted.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: apiError,
        }));
      }
      return { ok: false, error: apiError.message };
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      const accessToken = await storage.getToken();
      const refreshToken = await storage.getRefreshToken();
      if (accessToken) {
        await authApi.logout(accessToken, refreshToken ?? undefined);
      }
    } catch (error) {
      console.warn('No se pudo invalidar la sesión en el servidor:', error);
    } finally {
      try {
        await Promise.all([
          storage.clearAll(),
          removeStorage('user_token'),
          removeStorage('user_info'),
        ]);
      } catch (error) {
        console.error('No se pudo limpiar todo el almacenamiento de sesión:', error);
      }
      dispatch(clearAuthState());

      if (isMounted.current) {
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      }
      router.replace('/login');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    if (isMounted.current) {
      setState((prev) => ({ ...prev, error: null }));
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    void checkAuth();

    return () => {
      isMounted.current = false;
    };
  }, [checkAuth]);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}