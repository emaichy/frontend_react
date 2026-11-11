import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Student } from '../types/student';

interface CartContextValue {
  students: Student[];
  studentCount: number;
  addStudent: (student: Student) => void;
  removeStudent: (studentId: number) => void;
  clearCart: () => void;
  hasStudent: (studentId: number) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = useCallback((student: Student) => {
    setStudents(current =>
      current.some(item => item.id === student.id)
        ? current
        : [...current, student]
    );
  }, []);

  const removeStudent = useCallback((studentId: number) => {
    setStudents(current => current.filter(student => student.id !== studentId));
  }, []);

  const clearCart = useCallback(() => {
    setStudents([]);
  }, []);

  const hasStudent = useCallback(
    (studentId: number) => students.some(student => student.id === studentId),
    [students]
  );

  const value = useMemo(
    () => ({
      students,
      studentCount: students.length,
      addStudent,
      removeStudent,
      clearCart,
      hasStudent,
    }),
    [students, addStudent, removeStudent, clearCart, hasStudent]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
