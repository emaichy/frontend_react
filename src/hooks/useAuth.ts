/**
 * Hook personalizado para manejo de autenticación segura
 * Previene actualizaciones en componentes desmontados (isMounted pattern)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { saveStorage, removeStorage } from '../utils/authStorage';
import { setToken, setUser, logout as clearAuthState } from '../store/store';
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

interface UseAuthReturn extends UseAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
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

  /**
   * Verifica si hay una sesión activa al cargar el hook
   */
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

  /**
   * Inicia sesión con email y password
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
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
      } else {
        await storage.removeRefreshToken();
      }
      await saveStorage('user_token', accessToken);
      await saveStorage('user_info', JSON.stringify(response.user));
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

      return true;
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
      return false;
    }
  }, [dispatch]);

  /**
   * Registra un nuevo usuario e inicia sesión
   */
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
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
      return false;
    }
  }, [login]);

  /**
   * Cierra sesión y limpia tokens
   */
  const logout = useCallback(async () => {
    const accessToken = await storage.getToken();
    await storage.clearAll();
    try {
      await Promise.all([
        removeStorage('user_token'),
        removeStorage('user_info'),
      ]);
    } catch (error) {
      console.error('Error limpiando la sesión local:', error);
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

    if (accessToken) {
      void authApi.logout(accessToken).catch((error: unknown) => {
        console.warn('No se pudo invalidar la sesión en el servidor:', error);
      });
    }
  }, [dispatch, router]);

  /**
   * Limpia el error del estado
   */
  const clearError = useCallback(() => {
    if (isMounted.current) {
      setState((prev) => ({ ...prev, error: null }));
    }
  }, []);

  /**
   * Mantiene el flag de montaje sincronizado con el ciclo de vida de React
   */
  useEffect(() => {
    isMounted.current = true;
    void Promise.resolve().then(checkAuth);

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