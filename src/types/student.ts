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
>;

export type StudentFormData = StudentInput & { password?: string };

export type CreateStudentData = StudentInput & { password: string };

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