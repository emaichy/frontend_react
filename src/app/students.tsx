import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../hooks/useStudents';
import StudentList from '../components/StudentList';
import { ErrorMessage, Loading } from '../components';
import BackToHomeButton from '../components/BackToHomeButton';

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
    return <Loading message="Cargando estudiantes..." />;
  }

  if (error && students.length === 0) {
    return <ErrorMessage error={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <BackToHomeButton />
      {error ? <ErrorMessage error={error} onRetry={refresh} /> : null}
      <StudentList
        students={students}
        onStudentPress={handleStudentPress}
        onAddStudent={handleAddStudent}
        onRefresh={refresh}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});