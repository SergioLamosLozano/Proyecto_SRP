/**
 * Configuración centralizada de la API
 * Aquí se definen las URLs base y endpoints del backend Django
 */

// URL base del backend Django
// IMPORTANTE: Si estás probando en dispositivo físico o emulador,
// reemplaza 'localhost' con la IP de tu computadora (ej: 192.168.1.100)
// Para encontrar tu IP:
// - Windows: ipconfig (busca IPv4)
// - Mac/Linux: ifconfig (busca inet)
export const API_BASE_URL = __DEV__ 
  ? 'http://10.183.34.146:8000/api'  // Desarrollo local - CAMBIAR localhost por tu IP si usas dispositivo físico
  : 'https://tu-dominio.com/api'; // Producción

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/token/`,
  LOGOUT: `${API_BASE_URL}/auth/logout/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
};

// Endpoints de estudiantes
export const STUDENT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/estudiantes/`,
  DETAIL: (id) => `${API_BASE_URL}/estudiantes/${id}/`,
  GRADES: (studentId) => `${API_BASE_URL}/notas/?fk_numero_documento_estudiante=${studentId}`,
  SCHEDULE: (id) => `${API_BASE_URL}/estudiantes/${id}/horario/`,
  BY_PARENT: (documentoAcudiente) => `${API_BASE_URL}/match-acudientes/verificar_coincidencias/?numero_documento_acudiente=${documentoAcudiente}`,
};

// Endpoints de materias
export const SUBJECT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/materias/`,
  DETAIL: (id) => `${API_BASE_URL}/materias/${id}/`,
  ACTIVITIES: (id) => `${API_BASE_URL}/materias/${id}/actividades/`,
};

// Endpoints de notificaciones
export const NOTIFICATION_ENDPOINTS = {
  LIST: `${API_BASE_URL}/notificaciones/`,
  MARK_READ: (id) => `${API_BASE_URL}/notificaciones/${id}/marcar-leida/`,
  REGISTER_TOKEN: `${API_BASE_URL}/notificaciones/registrar-token/`,
};

// Endpoints de mensajes
export const MESSAGE_ENDPOINTS = {
  LIST: `${API_BASE_URL}/mensajes/`,
  DETAIL: (id) => `${API_BASE_URL}/mensajes/${id}/`,
  SEND: `${API_BASE_URL}/mensajes/enviar/`,
};

// Endpoints de boletines
export const BOLETIN_ENDPOINTS = {
  ESTADO: `${API_BASE_URL}/configuracion/boletines/estado/`,
  DESCARGAR: (periodo, estudiante) => `${API_BASE_URL}/reportes/boletines-pdf/?periodo=${periodo}&estudiante=${estudiante}&formato=individual`,
};

// Endpoints de periodos
export const PERIODO_ENDPOINTS = {
  LIST: `${API_BASE_URL}/periodo/`,
  DETAIL: (id) => `${API_BASE_URL}/periodo/${id}/`,
};

// Timeout para las peticiones (en milisegundos)
export const REQUEST_TIMEOUT = 30000; // Aumentado a 30 segundos

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  STUDENT_ENDPOINTS,
  SUBJECT_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  MESSAGE_ENDPOINTS,
  BOLETIN_ENDPOINTS,
  PERIODO_ENDPOINTS,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
};
