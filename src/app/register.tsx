/**
 * Pantalla de registro completa con soporte para temas dinámicos y scroll defensivo
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.nombre || !form.apellidoPaterno || !form.matricula || !form.email || !form.password) {
      showError('Error', 'Nombre, apellido paterno, matrícula, correo y contraseña son obligatorios');
      return;
    }

    if (form.password.length < 6) {
      showError('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showError('Error', 'Las contraseñas no coinciden');
      return;
    }

    const apellidoPaterno = form.apellidoPaterno.trim();
    const apellidoMaterno = form.apellidoMaterno.trim();

    const result = await register({
      nombre: form.nombre.trim(),
      apellido: apellidoPaterno,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno || null,
      matricula: form.matricula.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (result.ok) {
      showSuccess('Éxito', 'Cuenta creada correctamente');
      router.replace('/login');
    } else {
      showError('Error', result.error || 'No se pudo crear la cuenta.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              Completa tus datos de estudiante
            </Text>
          </View>

          <View style={styles.form}>
            {/* Nombre */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Juan"
                placeholderTextColor={colors.secondary}
                value={form.nombre}
                onChangeText={(v) => updateForm('nombre', v)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Apellidos paterno y materno */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.half]}>
                <Text style={[styles.label, { color: colors.text }]}>Apellido paterno *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Pérez"
                  placeholderTextColor={colors.secondary}
                  value={form.apellidoPaterno}
                  onChangeText={(v) => updateForm('apellidoPaterno', v)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={[styles.inputContainer, styles.half]}>
                <Text style={[styles.label, { color: colors.text }]}>Apellido materno</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="García"
                  placeholderTextColor={colors.secondary}
                  value={form.apellidoMaterno}
                  onChangeText={(v) => updateForm('apellidoMaterno', v)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Matrícula */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Matrícula</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="A00123456"
                placeholderTextColor={colors.secondary}
                value={form.matricula}
                onChangeText={(v) => updateForm('matricula', v)}
                autoCapitalize="characters"
                editable={!loading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="tu@email.com"
                placeholderTextColor={colors.secondary}
                value={form.email}
                onChangeText={(v) => updateForm('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!loading}
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.secondary}
                value={form.password}
                onChangeText={(v) => updateForm('password', v)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!loading}
              />
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirmar Contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Repite tu contraseña"
                placeholderTextColor={colors.secondary}
                value={form.confirmPassword}
                onChangeText={(v) => updateForm('confirmPassword', v)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!loading}
              />
            </View>

            {/* Botón de Submit */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>

            {/* Link a Login */}
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
});