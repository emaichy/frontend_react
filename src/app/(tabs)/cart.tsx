import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartScreen() {
  const { students, removeStudent, clearCart } = useCart();
  const { colors } = useTheme();

  const handleRemove = (studentId: number, studentName: string) => {
    Alert.alert(
      'Quitar estudiante',
      `¿Quieres quitar a ${studentName} del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: () => removeStudent(studentId),
        },
      ]
    );
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      data={students}
      keyExtractor={student => student.id.toString()}
      renderItem={({ item }) => (
        <View style={[styles.studentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.textColumn}>
              <Text style={[styles.name, { color: colors.text }]}>
                {item.nombre} {item.apellido}
              </Text>
              <Text style={[styles.detail, { color: colors.secondary }]}>
                Matrícula: {item.matricula}
              </Text>
              <Text style={[styles.detail, { color: colors.secondary }]}>
                {item.email}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Quitar a ${item.nombre} ${item.apellido} del carrito`}
              onPress={() => handleRemove(item.id, `${item.nombre} ${item.apellido}`)}
              style={[styles.removeButton, { backgroundColor: colors.error }]}
            >
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Aún no agregas estudiantes al carrito. Puedes agregarlos desde la pestaña Estudiantes.
        </Text>
      }
      ListFooterComponent={
        students.length > 0 ? (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              Alert.alert('Vaciar carrito', '¿Deseas quitar todos los estudiantes del carrito?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Vaciar', style: 'destructive', onPress: clearCart },
              ]);
            }}
          >
            <Text style={styles.clearButtonText}>Vaciar carrito</Text>
          </TouchableOpacity>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  studentCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  textColumn: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginTop: 3,
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 32,
    textAlign: 'center',
  },
});
