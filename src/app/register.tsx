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
  TouchableWithoutFeedback,
  Keyboard,
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
    apellido: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.nombre || !form.apellido || !form.matricula || !form.email || !form.password) {
      showError('Error', 'Todos los campos son obligatorios');
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

    const success = await register({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      matricula: form.matricula.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (success) {
      showSuccess('Éxito', 'Cuenta creada correctamente');
      router.replace('/(tabs)');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            {/* Nombre y Apellido en la misma fila */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.half]}>
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
                />
              </View>

              <View style={[styles.inputContainer, styles.half]}>
                <Text style={[styles.label, { color: colors.text }]}>Apellido</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Pérez"
                  placeholderTextColor={colors.secondary}
                  value={form.apellido}
                  onChangeText={(v) => updateForm('apellido', v)}
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
    </TouchableWithoutFeedback>
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