/**
 * Pantalla de lista de estudiantes
 * Consume la API del backend y muestra los estudiantes con FlatList
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../../hooks/useStudents';
import StudentList from '../../components/StudentList';
import { Loading, ErrorMessage } from '../../components';
import BackToHomeButton from '../../components/BackToHomeButton';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import type { Student } from '../../types/student';

export default function StudentsScreen() {
  const router = useRouter();
  const { students, loading, error, refresh } = useStudents();
  const { addStudent, hasStudent } = useCart();
  const { showSuccess } = useNotification();
  const { colors } = useTheme();
  const handleStudentPress = useCallback((student: Student) => {
    router.push(`/student/${student.id}`);
  }, [router]);
  const handleAddStudent = useCallback(() => {
    router.push('/student/new');
  }, [router]);
  const handleAddToCart = useCallback((student: (typeof students)[number]) => {
    if (hasStudent(student.id)) return;
    addStudent(student);
    showSuccess('Estudiante agregado', `${student.nombre} ${student.apellido} está en el carrito.`);
  }, [addStudent, hasStudent, showSuccess]);

  if (loading && students.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <Loading message="Cargando estudiantes..." />
      </View>
    );
  }

  if (error && students.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerAction}>
        <BackToHomeButton />
      </View>
      {error ? <ErrorMessage error={error} onRetry={refresh} /> : null}
      <StudentList
        students={students}
        onStudentPress={handleStudentPress}
        onRefresh={refresh}
        refreshing={loading}
        onAddStudent={handleAddStudent}
        onAddToCart={handleAddToCart}
        isStudentInCart={hasStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAction: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});