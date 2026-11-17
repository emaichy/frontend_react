/**
 * Tipos para el módulo de usuario
 */

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
  matricula?: string;
  rol_nombre?: string;
}

export interface ProfileUpdate {
  nombre: string;
  apellido?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
}

export interface UserMeResponse {
  user: User;
}