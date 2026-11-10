/**
 * Servicio de estudiantes con caché con límite de tamaño (LRU simple)
 */

import { apiClient } from '../api/client';
import {
  CreateStudentData,
  Student,
  UpdateStudentData,
} from '../types/student';

class StudentService {
  private readonly baseUrl = '/students';
  private readonly cache = new Map<
    string,
    { data: Student | Student[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_CACHE_SIZE = 50; // Máximo 50 elementos en caché

  private getCached<T extends Student | Student[]>(
    key: string,
    isExpectedType: (data: Student | Student[]) => data is T
  ): T | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;
    if (Date.now() - cached.timestamp >= this.CACHE_TTL) {
      this.cache.delete(key);
      return undefined;
    }

    this.cache.delete(key);
    this.cache.set(key, cached);
    return isExpectedType(cached.data) ? cached.data : undefined;
  }

  private setCache(key: string, data: Student | Student[]): void {
    this.cache.delete(key);
    this.cache.set(key, { data, timestamp: Date.now() });

    while (this.cache.size > this.MAX_CACHE_SIZE) {
      const leastRecentlyUsedKey = this.cache.keys().next().value;
      if (leastRecentlyUsedKey === undefined) break;
      this.cache.delete(leastRecentlyUsedKey);
    }
  }

  async getAll(forceRefresh = false): Promise<Student[]> {
    const cacheKey = 'all-students';
    if (forceRefresh) {
      this.cache.delete(cacheKey);
    }
    const cachedStudents = this.getCached(
      cacheKey,
      (data): data is Student[] => Array.isArray(data)
    );
    if (cachedStudents) return cachedStudents;

    const response = await apiClient.get<{ data: Student[] }>(this.baseUrl);
    const students = response.data.data;
    this.setCache(cacheKey, students);
    return students;
  }

  async getById(id: number): Promise<Student> {
    const cacheKey = `student-${id}`;
    const cachedStudent = this.getCached(
      cacheKey,
      (data): data is Student => !Array.isArray(data)
    );
    if (cachedStudent) return cachedStudent;

    const response = await apiClient.get<{ data: Student }>(`${this.baseUrl}/${id}`);
    const student = response.data.data;
    this.setCache(cacheKey, student);
    return student;
  }

  async create(student: CreateStudentData): Promise<Student> {
    const response = await apiClient.post<{ data: Student }>(this.baseUrl, student);
    const newStudent = response.data.data;
    this.cache.clear();
    return newStudent;
  }

  async update(id: number, student: UpdateStudentData): Promise<Student> {
    const response = await apiClient.put<{ data: Student }>(`${this.baseUrl}/${id}`, student);
    const updatedStudent = response.data.data;
    this.cache.delete(`student-${id}`);
    this.cache.delete('all-students');
    return updatedStudent;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
    this.cache.delete(`student-${id}`);
    this.cache.delete('all-students');
  }
}

export const studentService = new StudentService();