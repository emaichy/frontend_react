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

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onAddStudent?: () => void;
}

export default function StudentList({
  students,
  onStudentPress,
  onRefresh,
  refreshing = false,
  onAddStudent,
}: StudentListProps) {
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

  const renderStudent = ({ item }: { item: Student }) => (
    <StudentCard student={item} onPress={() => onStudentPress(item)} />
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.addButtonText}>+ Agregar estudiante</Text>
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
          <Text style={styles.emptyText}>
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
    backgroundColor: '#F5F7FA',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 18,
    marginBottom: 8,
    padding: 8,
  },
  addButtonText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },
});