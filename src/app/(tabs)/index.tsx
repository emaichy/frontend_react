/**
 * Pantalla de inicio (Home) con soporte para temas dinámicos y accesibilidad
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getUserDisplayName } from '../../utils/userDisplay';

interface QuickAction {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  const quickActions: QuickAction[] = [
    {
      title: 'Ver Estudiantes',
      description: 'Administra la lista de estudiantes',
      route: '/students',
      icon: '📝',
      color: '#3B82F6',
    },
    {
      title: 'Agregar Estudiante',
      description: 'Registra un nuevo estudiante',
      route: '/student/new',
      icon: '➕',
      color: '#10B981',
    },
    {
      title: 'Mi Perfil',
      description: 'Ver y editar tu información',
      route: '/profile',
      icon: '👤',
      color: '#8B5CF6',
    },
    {
      title: 'Ajustes',
      description: 'Configura las preferencias de la app',
      route: '/settings',
      icon: '⚙️',
      color: '#6366F1',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Tarjeta de bienvenida */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            ¡Bienvenido, {getUserDisplayName ? getUserDisplayName(user) : user?.email || 'Usuario'}!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.secondary }]}>
            {user?.email || 'Correo no disponible'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.normalHomeButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio normal"
        >
          <Text style={styles.normalHomeButtonText}>Volver a mi inicio normal</Text>
        </TouchableOpacity>

        {/* Sección de acciones rápidas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Acciones rápidas
        </Text>

        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(action.route as any)}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            accessibilityHint={action.description}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
              <Text style={styles.actionIconText}>{action.icon}</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
              <Text style={[styles.actionDescription, { color: colors.secondary }]}>
                {action.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
  },
  normalHomeButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 24,
  },
  normalHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 22,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
  },
});