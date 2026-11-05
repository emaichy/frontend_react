import type { User } from './user';

export type { User } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
}

export interface AuthResponse extends TokenResponse {
  user: User;
}

export interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}