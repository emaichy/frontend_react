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

export default function StudentsScreen() {
  const router = useRouter();
  const { students, loading, error, refresh } = useStudents();
  const handleStudentPress = useCallback((student: { id: number }) => {
    router.push(`/student/${student.id}`);
  }, [router]);
  const handleAddStudent = useCallback(() => {
    router.push('/student/new');
  }, [router]);

  if (loading && students.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <Loading message="Cargando estudiantes..." />
      </View>
    );
  }

  if (error && students.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerAction: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});