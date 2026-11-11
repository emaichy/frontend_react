import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import StudentForm from '../../components/StudentForm';
import BackToHomeButton from '../../components/BackToHomeButton';
import { studentService } from '../../services/studentService';
import { StudentFormData } from '../../types/student';
import { useTheme } from '../../context/ThemeContext';

export default function NewStudentScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleCreateStudent = async (
    data: StudentFormData
  ) => {
    if (!data.password) {
      throw new Error('La contraseña es obligatoria');
    }
    await studentService.create({ ...data, password: data.password });
    router.replace('/(tabs)/students');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false, title: 'Agregar estudiante' }} />
      <BackToHomeButton />
      <Text style={[styles.title, { color: colors.text }]}>Nuevo estudiante</Text>
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
  },
});
