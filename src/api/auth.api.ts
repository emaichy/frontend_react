import { create } from 'axios';
import { apiClient } from './client';
import { API_URL } from '../constants/api';
import { LoginCredentials, RegisterData, AuthResponse, TokenResponse, User } from '../types/auth';
import { ApiError, ErrorType } from '../types/errors';

const logoutClient = create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (!(response.data.accessToken ?? response.data.token) || !response.data.user) {
      throw new ApiError(
        ErrorType.UNKNOWN,
        'La respuesta del servidor no contiene una sesión válida.'
      );
    }
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User }> => {
    const response = await apiClient.post<{ user: User }>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  getCurrentUser: async (): Promise<User> => authApi.getProfile(),

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (accessToken: string, refreshToken?: string): Promise<void> => {
    await logoutClient.post('/auth/logout', { refreshToken }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export const { login, register, getCurrentUser, logout } = authApi;