/**
 * Constantes globales de la aplicación
 */

// Estados de las notas
export const GRADE_STATUS = {
  EXCELLENT: { min: 4.5, max: 5.0, label: 'Excelente', color: '#4CAF50' },
  GOOD: { min: 4.0, max: 4.49, label: 'Bueno', color: '#8BC34A' },
  ACCEPTABLE: { min: 3.5, max: 3.99, label: 'Aceptable', color: '#FFC107' },
  INSUFFICIENT: { min: 3.0, max: 3.49, label: 'Insuficiente', color: '#FF9800' },
  LOW: { min: 0, max: 2.99, label: 'Bajo', color: '#F44336' },
};

// Umbral para alertas de notas bajas
export const LOW_GRADE_THRESHOLD = 3.0;

// Tipos de alertas
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Días de la semana
export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

// Periodos académicos
export const ACADEMIC_PERIODS = [
  { id: 1, name: 'Primer Periodo', value: 'P1' },
  { id: 2, name: 'Segundo Periodo', value: 'P2' },
  { id: 3, name: 'Tercer Periodo', value: 'P3' },
  { id: 4, name: 'Cuarto Periodo', value: 'P4' },
];

// Roles de usuario
export const USER_ROLES = {
  PARENT: 'parent',
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Tiempos de espera (en milisegundos)
export const TIMEOUTS = {
  ALERT_AUTO_CLOSE: 3000,
  SPLASH_SCREEN: 2000,
  DEBOUNCE_SEARCH: 500,
};

// Límites de caracteres
export const CHARACTER_LIMITS = {
  MESSAGE_TITLE: 100,
  MESSAGE_BODY: 500,
  COMMENT: 200,
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Iconos por materia (Material Community Icons)
export const SUBJECT_ICONS = {
  'Matemáticas': 'calculator',
  'Español': 'book-open-variant',
  'Inglés': 'translate',
  'Ciencias Naturales': 'flask',
  'Ciencias Sociales': 'earth',
  'Educación Física': 'run',
  'Estadística': 'chart-bar',
  'Religión': 'hands-pray',
  'Tecnología': 'laptop',
  'Artes': 'palette',
  'Música': 'music',
  'default': 'book',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
  REQUIRED_FIELD: 'Este campo es requerido.',
  INVALID_EMAIL: 'Correo electrónico inválido.',
  INVALID_PHONE: 'Número de teléfono inválido.',
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
  UPDATE_SUCCESS: 'Actualización exitosa.',
  DELETE_SUCCESS: 'Eliminado correctamente.',
  SEND_SUCCESS: 'Enviado correctamente.',
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  SPRING: {
    friction: 3,
    tension: 40,
  },
  TIMING: {
    duration: 300,
  },
};

export default {
  GRADE_STATUS,
  LOW_GRADE_THRESHOLD,
  ALERT_TYPES,
  DAYS_OF_WEEK,
  ACADEMIC_PERIODS,
  USER_ROLES,
  PAGINATION,
  TIMEOUTS,
  CHARACTER_LIMITS,
  DATE_FORMATS,
  SUBJECT_ICONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_CONFIG,
};
