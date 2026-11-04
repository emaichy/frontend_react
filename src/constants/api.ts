const getDefaultApiOrigin = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiOrigin())
  .replace(/\/+$/, '');

export const API_URL = `${API_ORIGIN}/api`;