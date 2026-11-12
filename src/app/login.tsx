/**
 * Pantalla de login (Contenedor principal con manejo de teclado y temas)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import LoginForm from '../components/LoginFrom';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const { showError } = useNotification();
  const { colors } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.ok) {
      router.replace('/home');
    } else {
      showError(
        'Error',
        result.error || 'No se pudo iniciar sesión. Verifique sus credenciales.'
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <LoginForm
              onLogin={handleLogin}
              loading={loading}
              error={error?.message ?? ''}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
});