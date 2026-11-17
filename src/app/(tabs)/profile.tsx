/**
 * Perfil de usuario con edición, preferencias y manejo de sesión.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Loading } from '../../components';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getUserDisplayName } from '../../utils/userDisplay';

export default function ProfileScreen() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const { colors, theme, toggleTheme } = useTheme();
  const { user, loading, logout, isAuthenticated, updateProfile } = useAuth();
  const { showError, showSuccess } = useNotification();
  const hasSeparateSurnames =
    user?.apellido_paterno !== undefined || user?.apellido_materno !== undefined;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Loading message="Cargando perfil..." />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.secondary }]}>
          No hay sesión activa
        </Text>
      </View>
    );
  }

  const displayName = getUserDisplayName(user);
  const initials = [
    user.nombre,
    hasSeparateSurnames ? user.apellido_paterno : user.apellido,
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => part.trim().charAt(0).toUpperCase())
    .join('') || user.email.charAt(0).toUpperCase();

  const handleCancel = () => {
    setNombre(user.nombre ?? '');
    setApellido(user.apellido ?? '');
    setApellidoPaterno(user.apellido_paterno ?? '');
    setApellidoMaterno(user.apellido_materno ?? '');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setNombre(user.nombre ?? '');
    setApellido(user.apellido ?? '');
    setApellidoPaterno(user.apellido_paterno ?? '');
    setApellidoMaterno(user.apellido_materno ?? '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmedName = nombre.trim();
    const trimmedSurname = hasSeparateSurnames
      ? apellidoPaterno.trim()
      : apellido.trim();

    if (!trimmedName || !trimmedSurname) {
      showError('Datos incompletos', 'El nombre y el apellido son obligatorios.');
      return;
    }

    setSaving(true);
    const result = await updateProfile(
      hasSeparateSurnames
        ? {
            nombre: trimmedName,
            apellido_paterno: trimmedSurname,
            apellido_materno: apellidoMaterno.trim() || null,
          }
        : {
            nombre: trimmedName,
            apellido: trimmedSurname,
          },
    );
    setSaving(false);

    if (!result.ok) {
      showError('No se pudo actualizar el perfil', result.error);
      return;
    }

    setIsEditing(false);
    showSuccess('Perfil actualizado', 'Tus datos se guardaron correctamente.');
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.fullName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.email, { color: colors.secondary }]}>{user.email}</Text>
          {user.rol_nombre ? (
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.roleText}>{user.rol_nombre}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Información personal
            </Text>
            {!isEditing ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Editar perfil"
                onPress={handleEdit}
              >
                <Text style={[styles.editButton, { color: colors.primary }]}>Editar</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {isEditing ? (
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Nombre *</Text>
              <TextInput
                accessibilityLabel="Nombre"
                autoCapitalize="words"
                autoComplete="name"
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre"
                placeholderTextColor={colors.secondary}
                editable={!saving}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              {hasSeparateSurnames ? (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Apellido paterno *
                  </Text>
                  <TextInput
                    accessibilityLabel="Apellido paterno"
                    autoCapitalize="words"
                    value={apellidoPaterno}
                    onChangeText={setApellidoPaterno}
                    placeholder="Tu apellido paterno"
                    placeholderTextColor={colors.secondary}
                    editable={!saving}
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                  />
                  <Text style={[styles.label, { color: colors.text }]}>
                    Apellido materno
                  </Text>
                  <TextInput
                    accessibilityLabel="Apellido materno"
                    autoCapitalize="words"
                    value={apellidoMaterno}
                    onChangeText={setApellidoMaterno}
                    placeholder="Tu apellido materno (opcional)"
                    placeholderTextColor={colors.secondary}
                    editable={!saving}
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                  />
                </>
              ) : (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>Apellido *</Text>
                  <TextInput
                    accessibilityLabel="Apellido"
                    autoCapitalize="words"
                    value={apellido}
                    onChangeText={setApellido}
                    placeholder="Tu apellido"
                    placeholderTextColor={colors.secondary}
                    editable={!saving}
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                  />
                </>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={[styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={() => void handleSave()}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <InfoRow label="Nombre" value={user.nombre} colors={colors} />
              {hasSeparateSurnames ? (
                <>
                  <InfoRow
                    label="Apellido paterno"
                    value={user.apellido_paterno}
                    colors={colors}
                  />
                  <InfoRow
                    label="Apellido materno"
                    value={user.apellido_materno}
                    colors={colors}
                  />
                </>
              ) : (
                <InfoRow label="Apellido" value={user.apellido} colors={colors} />
              )}
            </>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información de cuenta
          </Text>
          <InfoRow label="ID de usuario" value={String(user.id)} colors={colors} />
          {user.matricula ? (
            <InfoRow label="Matrícula" value={user.matricula} colors={colors} />
          ) : null}
          <InfoRow label="Estado" value="Activo" colors={colors} valueStyle={styles.activeStatus} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferencias</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.settingItem}
            onPress={toggleTheme}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Tema de la aplicación
            </Text>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              {theme === 'dark' ? 'Oscuro 🌙' : 'Claro ☀️'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={() => setConfirmLogout(true)}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmDialog
        visible={confirmLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmLabel="Cerrar sesión"
        destructive
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          void logout();
        }}
      />
    </>
  );
}

function InfoRow({
  label,
  value,
  colors,
  valueStyle,
}: {
  label: string;
  value?: string | null;
  colors: ReturnType<typeof useTheme>['colors'];
  valueStyle?: TextStyle;
}) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.secondary }]}>{label}:</Text>
      <Text style={[styles.infoValue, { color: colors.text }, valueStyle]}>
        {value || '-'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  editButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    flexShrink: 1,
    marginRight: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
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
    marginTop: 4,
    marginBottom: 24,
    backgroundColor: '#EF4444',
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
