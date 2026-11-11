import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student } from '../types/student';
import { useTheme } from '../context/ThemeContext';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
  onAddToCart?: (student: Student) => void;
  isInCart?: boolean;
}

const StudentCard = React.memo(({
  student,
  onPress,
  onAddToCart,
  isInCart = false,
}: StudentCardProps) => {
  const { colors, isDark } = useTheme();
  const inicialNombre = student?.nombre?.charAt(0) || '?';
  const inicialApellido = student?.apellido?.charAt(0) || '?';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        onPress={() => onPress?.(student)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`Estudiante ${student?.nombre || ''} ${student?.apellido || ''}`}
        accessibilityHint="Toca para ver detalles del estudiante"
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {inicialNombre}{inicialApellido}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>
              {student?.nombre || 'Sin nombre'} {student?.apellido || ''}
            </Text>
            <Text style={[styles.matricula, { color: colors.secondary }]}>
              Matrícula: {student?.matricula || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.footer}>
          <Text style={[styles.label, { color: colors.secondary }]}>Email:</Text>
          <Text style={[styles.email, { color: colors.primary }]}>{student?.email || 'Sin correo'}</Text>
        </View>
      </TouchableOpacity>

      {onAddToCart ? (
        <TouchableOpacity
          style={[
            styles.cartButton,
            { backgroundColor: isInCart ? (isDark ? '#14532D' : '#DCFCE7') : (isDark ? '#1E3A5F' : '#DBEAFE') },
          ]}
          onPress={() => onAddToCart(student)}
          disabled={isInCart}
          accessibilityRole="button"
          accessibilityLabel={
            isInCart
              ? `${student.nombre} ya está en el carrito`
              : `Agregar a ${student.nombre} al carrito`
          }
        >
          <Text style={[styles.cartButtonText, { color: isDark ? '#BFDBFE' : '#1D4ED8' }]}>
            {isInCart ? 'Agregado al carrito' : 'Agregar al carrito'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

StudentCard.displayName = 'StudentCard';

export default StudentCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  cartButton: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    marginTop: 14,
    paddingVertical: 11,
  },
  cartButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  matricula: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginRight: 6,
  },
  email: {
    fontSize: 14,
  },
});