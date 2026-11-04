/**
 * Componente de indicador de carga accesible y animado
 * Soporta renderizado en pantalla completa o inline
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Cargando...', 
  size = 'large',
  fullScreen = false 
}) => {
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // ANIMACIÓN OPTIMIZADA: Animación fluida en hilo nativo de UI (useNativeDriver)
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });

    animation.start();

    // CLEANUP: Evita memory leaks deteniendo la animación si el componente se desmonta
    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { opacity: fadeAnim }
      ]}
      accessibilityRole="progressbar"
      aria-busy={true}
    >
      <ActivityIndicator size={size} color="#007AFF" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </Animated.View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
});