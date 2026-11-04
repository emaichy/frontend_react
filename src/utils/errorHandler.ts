import { isAxiosError, AxiosError } from 'axios';
import { ApiError, ErrorType } from '../types/errors';

export const handleApiError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;

    // 1. Sin conexión a internet
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return new ApiError(
          ErrorType.TIMEOUT,
          'La solicitud tardó demasiado. Intenta de nuevo.',
          408
        );
      }
      return new ApiError(
        ErrorType.NETWORK_ERROR,
        'No se pudo conectar con el servidor. Verifica que la API esté activa y que CORS permita el origen de esta app.',
        0
      );
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data;

    // Soporta tanto data.message como data.error o data.detail (FastAPI)
    const serverMessage = getServerMessage(data);

    switch (status) {
      case 400:
        return new ApiError(
          ErrorType.VALIDATION_ERROR,
          serverMessage || 'Los datos enviados no son válidos.',
          status,
          data
        );

      case 401:
        return new ApiError(
          ErrorType.UNAUTHORIZED,
          'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
          status,
          data
        );
      
      case 403:
        return new ApiError(
          ErrorType.FORBIDDEN,
          'No tienes permisos para realizar esta acción.',
          status,
          data
        );
      
      case 404:
        return new ApiError(
          ErrorType.NOT_FOUND,
          serverMessage || 'El recurso solicitado no existe.',
          status,
          data
        );
      
      case 409:
        return new ApiError(
          ErrorType.VALIDATION_ERROR,
          serverMessage || 'Ya existe un registro con estos datos.',
          status,
          data
        );
      
      case 500:
        return new ApiError(
          ErrorType.SERVER_ERROR,
          'Error en el servidor. Intenta más tarde.',
          status,
          data
        );
      
      default:
        return new ApiError(
          ErrorType.SERVER_ERROR,
          serverMessage || `Error del servidor (${status})`,
          status,
          data
        );
    }
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(
    ErrorType.UNKNOWN,
    'Ha ocurrido un error inesperado.'
  );
};

const getServerMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const record = data as Record<string, unknown>;
  const message = record.message ?? record.error ?? record.detail;
  return typeof message === 'string' ? message : undefined;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado.';
};

export const isAuthError = (error: unknown): boolean => {
  const apiError = handleApiError(error);
  return apiError.type === ErrorType.UNAUTHORIZED;
};