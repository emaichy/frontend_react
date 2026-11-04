/**
 * Pantalla de lista de estudiantes
 * Consume la API del backend y muestra los estudiantes con FlatList
 */

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter, RelativePathString } from 'expo-router';
import { useApi } from '../../hooks/useApi';
import { getStudents } from '../../api/students.api';
import { Student } from '../../types/student';
import { StudentCard, Loading, ErrorMessage } from '../../components';
import BackToHomeButton from '../../components/BackToHomeButton';

export default function StudentsScreen() {
  const router = useRouter();
  const { data: students, loading, error, execute: loadStudents } = useApi(getStudents);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Función para refrescar la lista (pull-to-refresh)
  const handleRefresh = useCallback(() => {
    loadStudents();
  }, [loadStudents]);

  // Navegar al detalle del estudiante
  const handleStudentPress = useCallback((student: Student) => {
    // Usar navegación con parámetros
    router.push(`/student/${student.id}` as RelativePathString);
  }, [router]);

  // Estado de carga
  if (loading && !students) {
    return (
      <View style={styles.container}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <Loading message="Cargando estudiantes..." />
      </View>
    );
  }

  // Estado de error
  if (error && !students) {
    return (
      <View style={styles.container}>
        <View style={styles.headerAction}>
          <BackToHomeButton />
        </View>
        <ErrorMessage error={error} onRetry={loadStudents} />
      </View>
    );
  }

  // Lista vacía
  if (!students || students.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ErrorMessage 
          error="No hay estudiantes registrados" 
        />
      </View>
    );
  }

  // Renderizar cada estudiante
  const renderStudent = ({ item }: { item: Student }) => (
    <StudentCard student={item} onPress={handleStudentPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerAction}>
        <BackToHomeButton />
      </View>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudent}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  headerAction: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
});