import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ApiError, ErrorType } from '../types/errors';
import { useTheme } from '../context/ThemeContext';

interface ErrorMessageProps {
  error: ApiError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  fullScreen?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  onDismiss,
  fullScreen = false
}) => {
  const { colors } = useTheme();

  if (!error) return null;

  const message = typeof error === 'string'
    ? error
    : error?.message || 'Ha ocurrido un error inesperado.';

  const errorType = typeof error === 'string' ? null : error?.type;

  const getIcon = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT:
        return '🔌';
      case ErrorType.UNAUTHORIZED:
        return '🔐';
      case ErrorType.VALIDATION_ERROR:
        return '⚠️';
      case ErrorType.SERVER_ERROR:
        return '🖥️';
      default:
        return '❌';
    }
  };

  const canRetry = Boolean(
    onRetry &&
    (typeof error === 'string' ||
     errorType === ErrorType.NETWORK_ERROR ||
     errorType === ErrorType.TIMEOUT)
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderLeftColor: colors.error },
        fullScreen && styles.fullScreenContainer,
      ]}
      accessibilityRole="alert"
    >
      <View style={[styles.content, fullScreen && styles.fullScreenContent]}>
        <Text
          style={[styles.icon, fullScreen && styles.fullScreenIcon]}
          accessibilityRole="image"
          accessibilityLabel="Icono de estado de error"
        >
          {getIcon()}
        </Text>

        <View style={fullScreen ? styles.textCenter : styles.textFlex}>
          {fullScreen && <Text style={[styles.title, { color: colors.text }]}>¡Oops!</Text>}
          <Text
            style={[
              styles.message,
              fullScreen && styles.fullScreenMessage,
              { color: colors.secondary },
            ]}
          >
            {message}
          </Text>
        </View>
      </View>
      
      <View style={[styles.actions, fullScreen && styles.fullScreenActions]}>
        {canRetry && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityHint="Reintenta realizar la operación fallida"
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
        
        {onDismiss && (
          <TouchableOpacity
            style={[styles.dismissButton, { backgroundColor: colors.background }]}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityHint="Descarta este mensaje de error"
          >
            <Text style={[styles.dismissText, { color: colors.text }]}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0,
    margin: 0,
    padding: 24,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fullScreenContent: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  fullScreenIcon: {
    fontSize: 48,
    marginRight: 0,
    marginBottom: 16,
  },
  textFlex: {
    flex: 1,
  },
  textCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  fullScreenMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fullScreenActions: {
    justifyContent: 'center',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dismissText: {
    color: '#666',
    fontSize: 14,
  },
});