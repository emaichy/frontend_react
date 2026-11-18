import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useStudents } from '../hooks/useStudents';
import StudentList from '../components/StudentList';
import { ErrorMessage, Loading } from '../components';
import BackToHomeButton from '../components/BackToHomeButton';
import { useTheme } from '../context/ThemeContext';
import type { RootState } from '../store/store';
import { isTeacherRole } from '../utils/permissions';

export default function StudentsScreen() {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }
  if (!isTeacherRole(user)) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <StudentsScreenContent />;
}

function StudentsScreenContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { students, loading, error, refresh } = useStudents();

  const handleStudentPress = useCallback((student: { id: number }) => {
    router.push(`/student/${student.id}`);
  }, [router]);
  const handleAddStudent = useCallback(() => {
    router.push('/student/new');
  }, [router]);

  if (loading && students.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loading message="Cargando estudiantes..." />
      </View>
    );
  }

  if (error && students.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
  },
});