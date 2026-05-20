/**
 * Servicio centralizado para manejar todas las peticiones HTTP al backend Django
 * Incluye manejo de tokens JWT, interceptores y manejo de errores
 */

import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
  }

  /**
   * Obtiene el token de autenticación almacenado
   */
  async getAuthToken() {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Guarda el token de autenticación
   */
  async setAuthToken(token) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Error guardando token:', error);
    }
  }

  /**
   * Elimina el token de autenticación
   */
  async removeAuthToken() {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Error eliminando token:', error);
    }
  }

  /**
   * Construye los headers para la petición
   */
  async buildHeaders(customHeaders = {}) {
    const headers = { ...DEFAULT_HEADERS, ...customHeaders };
    
    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Maneja los errores de las peticiones
   */
  handleError(error, response) {
    console.log('🔴 Error en petición:', { error, response });
    
    if (response) {
      // Error del servidor
      switch (response.status) {
        case 400:
          return { success: false, error: 'Datos inválidos', data: response.data, status: 400 };
        case 401:
          return { success: false, error: 'No autorizado. Por favor inicia sesión nuevamente.', unauthorized: true, status: 401 };
        case 403:
          return { success: false, error: 'No tienes permisos para realizar esta acción.', status: 403 };
        case 404:
          return { success: false, error: 'Recurso no encontrado.', status: 404 };
        case 500:
          return { success: false, error: 'Error del servidor. Intenta más tarde.', status: 500 };
        default:
          return { success: false, error: `Error ${response.status}: ${response.data?.detail || 'Error en la petición.'}`, status: response.status };
      }
    }
    
    // Error de red o timeout
    if (error.message === 'Network request failed') {
      return { success: false, error: 'Error de conexión. Verifica tu internet y que el servidor esté corriendo.' };
    }
    
    if (error.message === 'Timeout') {
      return { success: false, error: 'La petición tardó demasiado. Intenta nuevamente.' };
    }
    
    return { success: false, error: error.message || 'Error desconocido.' };
  }

  /**
   * Realiza una petición HTTP genérica
   */
  async request(url, options = {}) {
    try {
      console.log('🌐 Petición:', options.method || 'GET', url);
      
      const headers = await this.buildHeaders(options.headers);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      console.log('📡 Respuesta:', response.status, data);

      if (!response.ok) {
        return this.handleError(null, { status: response.status, data });
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ Error en request:', error);
      if (error.name === 'AbortError') {
        return this.handleError({ message: 'Timeout' }, null);
      }
      return this.handleError(error, null);
    }
  }

  /**
   * Petición GET
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * Petición POST
   */
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición PUT
   */
  async put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición PATCH
   */
  async patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición DELETE
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Login - Obtiene y guarda el token JWT
   */
  async login(username, password) {
    const response = await this.post(`${this.baseURL}/token/`, {
      username,
      password,
    });

    if (response.success && response.data?.access) {
      await this.setAuthToken(response.data.access);
      if (response.data.refresh) {
        await SecureStore.setItemAsync('refresh_token', response.data.refresh);
      }
    }

    return response;
  }

  /**
   * Logout - Elimina los tokens
   */
  async logout() {
    await this.removeAuthToken();
    await SecureStore.deleteItemAsync('refresh_token');
    return { success: true };
  }

  /**
   * Refresca el token de autenticación
   */
  async refreshToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (!refreshToken) {
        return { success: false, error: 'No hay token de refresco' };
      }

      const response = await this.post(`${this.baseURL}/token/refresh/`, {
        refresh: refreshToken,
      });

      if (response.success && response.data?.access) {
        await this.setAuthToken(response.data.access);
      }

      return response;
    } catch (error) {
      return { success: false, error: 'Error refrescando token' };
    }
  }
}

// Exportar instancia única (Singleton)
export default new ApiService();
