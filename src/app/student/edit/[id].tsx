import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import BackToHomeButton from '../../../components/BackToHomeButton';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { Loading } from '../../../components/Loading';
import StudentForm from '../../../components/StudentForm';
import { useApi } from '../../../hooks/useApi';
import { studentService } from '../../../services/studentService';
import { StudentFormData } from '../../../types/student';

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loadStudentData = useCallback(
    () => studentService.getById(Number(id)),
    [id]
  );
  const { data: student, loading, error, execute: loadStudent } = useApi(loadStudentData);

  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  const handleUpdateStudent = async (data: StudentFormData) => {
    await studentService.update(Number(id), data);
    router.replace(`/student/${id}`);
  };

  if (loading && !student) {
    return <Loading message="Cargando estudiante..." />;
  }

  if (error || !student) {
    return (
      <ErrorMessage
        error={error || 'Estudiante no encontrado'}
        onRetry={loadStudent}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: 'Editar estudiante' }} />
      <BackToHomeButton />
      <Text style={styles.title}>Editar estudiante</Text>
      <StudentForm
        student={student}
        onSubmit={handleUpdateStudent}
        onCancel={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FA',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
  },
});
