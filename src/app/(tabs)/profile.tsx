/**
 * Pantalla de perfil de usuario con soporte para temas y manejo defensivo de sesión
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../../components';
import { getUserDisplayName } from '../../utils/userDisplay';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { user, loading, logout, isAuthenticated } = useAuth();

  // 1. Estado de carga
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Loading message="Cargando perfil..." />
      </View>
    );
  }

  // 2. Estado sin sesión activa
  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.secondary }]}>No hay sesión activa</Text>
      </View>
    );
  }

  const displayName = getUserDisplayName ? getUserDisplayName(user) : user.email;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Tarjeta principal con Avatar */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.email, { color: colors.secondary }]}>{user.email}</Text>
        </View>

        {/* Sección: Información de cuenta */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información de cuenta
          </Text>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.secondary }]}>ID de usuario:</Text>
            <Text style={[styles.value, { color: colors.text }]}>{user.id}</Text>
          </View>

          {user.matricula ? (
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.secondary }]}>Matrícula:</Text>
              <Text style={[styles.value, { color: colors.text }]}>{user.matricula}</Text>
            </View>
          ) : null}

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.secondary }]}>Estado:</Text>
            <Text style={[styles.value, styles.activeStatus]}>Activo</Text>
          </View>
        </View>

        {/* Sección: Preferencias de tema */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferencias
          </Text>

          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Tema de la aplicación
            </Text>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              {theme === 'dark' ? 'Oscuro 🌙' : 'Claro ☀️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
  },
  section: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeStatus: {
    color: '#10B981',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 15,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});