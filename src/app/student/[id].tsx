/**
 * Pantalla de detalle de estudiante
 * Muestra información completa de un estudiante específico
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useApi } from '../../hooks/useApi';
import { studentService } from '../../services/studentService';
import { Loading, ErrorMessage } from '../../components';
import BackToHomeButton from '../../components/BackToHomeButton';
import { useTheme } from '../../context/ThemeContext';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const loadStudentData = useCallback(
    () => studentService.getById(Number(id)),
    [id]
  );
  const { data: student, loading, error, execute: loadStudent } = useApi(loadStudentData);

  // Cargar datos del estudiante
  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  // Confirmar eliminación
  const handleDelete = () => {
    Alert.alert(
      'Eliminar estudiante',
      '¿Estás seguro que deseas eliminar este estudiante?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await studentService.delete(Number(id));
              router.replace('/(tabs)/students');
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el estudiante');
            }
          },
        },
      ]
    );
  };

  // Estado de carga
  if (loading) {
    return <Loading message="Cargando estudiante..." />;
  }

  // Estado de error
  if (error || !student) {
    return (
      <ErrorMessage
        error={error || 'Estudiante no encontrado'}
        onRetry={loadStudent}
      />
    );
  }

  const formatDate = (date: string | undefined) => {
    if (!date || Number.isNaN(Date.parse(date))) {
      return 'No disponible';
    }
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `${student.nombre} ${student.apellido}`,
        }}
      />

      <View style={styles.backButton}>
        <BackToHomeButton />
      </View>

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}> 
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student.nombre.charAt(0)}{student.apellido.charAt(0)}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {student.nombre} {student.apellido}
        </Text>
        <Text style={[styles.matricula, { color: colors.secondary }]}>Matrícula: {student.matricula}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de contacto</Text>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={styles.icon}>📧</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.secondary }]}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>{student.email}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={styles.icon}>🆔</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.secondary }]}>ID</Text>
            <Text style={[styles.value, { color: colors.text }]}>{student.id}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Fechas</Text>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={styles.icon}>📅</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.secondary }]}>Creado</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(student.createdAt ?? student.created_at)}
            </Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={styles.icon}>🔄</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.secondary }]}>Actualizado</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(student.updatedAt ?? student.updated_at)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Text
          style={[styles.editButton, { backgroundColor: colors.primary, color: '#FFFFFF' }]}
          onPress={() => router.push(`/student/edit/${student.id}`)}
        >
          Editar estudiante
        </Text>
        <Text style={[styles.deleteButton, { backgroundColor: '#EF4444', color: '#FFFFFF' }]} onPress={handleDelete}>
          🗑️ Eliminar estudiante
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  matricula: {
    fontSize: 16,
  },
  section: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  editButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  deleteButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});