/**
 * Punto de entrada: dirige a la pantalla correspondiente según la sesión restaurada.
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import type { RootState } from '../store/store';

export default function IndexScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    router.replace(token && user ? '/(tabs)' : '/login');
  }, [router, token, user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
