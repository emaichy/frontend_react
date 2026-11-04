import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BackToHomeButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.replace('/(tabs)')}
      accessibilityRole="button"
      accessibilityLabel="Volver al inicio"
    >
      <Text style={styles.label}>← Volver al inicio</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#E8F0FE',
  },
  label: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '600',
  },
});
