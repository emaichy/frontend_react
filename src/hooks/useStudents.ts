/**
 * Hook personalizado para manejar la lista de estudiantes
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { studentService } from '../services/studentService';
import { Student } from '../types/student';

interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

interface UseStudentsReturn extends UseStudentsState {
  refresh: () => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export function useStudents(): UseStudentsReturn {
  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: true,
    error: null,
  });

  const fetchStudents = useCallback(async (forceRefresh = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const students = await studentService.getAll(forceRefresh);
      setState({ students, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar estudiantes',
      }));
    }
  }, []);

  const deleteStudent = useCallback(async (id: number) => {
    let deletedStudent: Student | undefined;

    // Eliminación optimista en UI
    setState(prev => {
      deletedStudent = prev.students.find(s => s.id === id);
      return {
        ...prev,
        students: prev.students.filter(s => s.id !== id),
      };
    });

    try {
      await studentService.delete(id);
    } catch {
      // Reversión granular si la API falla
      setState(prev => ({
        ...prev,
        students: deletedStudent ? [...prev.students, deletedStudent] : prev.students,
        error: 'Error al eliminar estudiante',
      }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchStudents();
    }, [fetchStudents])
  );

  return {
    ...state,
    refresh: useCallback(() => fetchStudents(true), [fetchStudents]),
    deleteStudent,
  };
}