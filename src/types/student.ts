export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type StudentInput = Omit<
  Student,
  'id' | 'createdAt' | 'updatedAt' | 'created_at' | 'updated_at'
> & { password: string };

export interface CreateStudentData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface UpdateStudentData {
  nombre?: string;
  apellido?: string;
  matricula?: string;
  email?: string;
  password?: string;
}

export interface StudentListResponse {
  data: Student[];
}