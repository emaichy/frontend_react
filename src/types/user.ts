/**
 * Tipos para el módulo de usuario
 */

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  matricula?: string;
}

export interface UserMeResponse {
  user: User;
}