import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const isWeb = Platform.OS === 'web';

async function saveItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    sessionStorage.setItem(key, value);
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    const currentValue = sessionStorage.getItem(key);
    if (currentValue !== null) {
      return currentValue;
    }
    const legacyValue = localStorage.getItem(key);
    if (legacyValue !== null) {
      sessionStorage.setItem(key, legacyValue);
      localStorage.removeItem(key);
    }
    return legacyValue;
  }
  return await SecureStore.getItemAsync(key);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const storage = {
  async saveToken(token: string): Promise<void> {
    try {
      await saveItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando access token:', error);
      throw new Error('No se pudo guardar el token de acceso');
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo access token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando access token:', error);
    }
  },

  async saveRefreshToken(token: string): Promise<void> {
    try {
      await saveItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando refresh token:', error);
      throw new Error('No se pudo guardar el refresh token');
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo refresh token:', error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando refresh token:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      // Evita problemas de bind de 'this' llamando directamente a los métodos internos
      await Promise.all([
        removeItem(ACCESS_TOKEN_KEY),
        removeItem(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error al limpiar el almacenamiento de tokens:', error);
    }
  },
};