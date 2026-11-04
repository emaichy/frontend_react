import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import StudentForm from '../../components/StudentForm';
import BackToHomeButton from '../../components/BackToHomeButton';
import { studentService } from '../../services/studentService';

export default function NewStudentScreen() {
  const router = useRouter();

  const handleCreateStudent = async (
    data: Parameters<typeof studentService.create>[0]
  ) => {
    await studentService.create(data);
    router.replace('/(tabs)/students');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Agregar estudiante' }} />
      <BackToHomeButton />
      <Text style={styles.title}>Nuevo estudiante</Text>
      <StudentForm
        onSubmit={handleCreateStudent}
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
