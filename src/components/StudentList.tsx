/**
 * Componente de lista de estudiantes
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import StudentCard from './StudentCard';
import SearchBar from './SearchBar';
import { Student } from '../types/student';
import { useTheme } from '../context/ThemeContext';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onAddStudent?: () => void;
  onAddToCart?: (student: Student) => void;
  isStudentInCart?: (studentId: number) => boolean;
}

export default function StudentList({
  students,
  onStudentPress,
  onRefresh,
  refreshing = false,
  onAddStudent,
  onAddToCart,
  isStudentInCart,
}: StudentListProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;

    const query = searchQuery.trim().toLocaleLowerCase();
    return students.filter(student =>
      [student.nombre, student.apellido, student.matricula, student.email]
        .some(value => value.toLocaleLowerCase().includes(query))
    );
  }, [students, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const renderStudent = useCallback(({ item }: { item: Student }) => (
    <StudentCard
      student={item}
      onPress={onStudentPress}
      onAddToCart={onAddToCart}
      isInCart={isStudentInCart?.(item.id)}
    />
  ), [isStudentInCart, onAddToCart, onStudentPress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Buscar por nombre, apellido o matrícula..."
        onClear={() => setSearchQuery('')}
      />
      {onAddStudent ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onAddStudent}
          style={styles.addButton}
        >
          <Text style={[styles.addButtonText, { color: colors.primary }]}>+ Agregar estudiante</Text>
        </TouchableOpacity>
      ) : null}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          ) : undefined
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            {students.length === 0
              ? 'No hay estudiantes registrados'
              : 'No se encontraron estudiantes'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 18,
    marginBottom: 8,
    padding: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
});