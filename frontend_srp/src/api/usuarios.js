import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

// Configuración de axios
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta: si recibimos 401 intentamos renovar el access token usando refreshToken
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refresh = sessionStorage.getItem("refreshToken");
      if (!refresh) return Promise.reject(error);
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const resp = await (await import("./auth.js")).refreshToken(refresh);
        const newAccess = resp.data.access;
        sessionStorage.setItem("token", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        isRefreshing = false;
        originalRequest.headers["Authorization"] = "Bearer " + newAccess;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // Si refresh falló, redirigir al login (no eliminar token automáticamente)
        // El token solo se eliminará al hacer logout o al cerrar el navegador (sessionStorage).
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// Servicios para Estudiantes
export const estudiantesAPI = {
  // Obtener todos los estudiantes
  getAll: () => api.get("/estudiantes/"),

  // Obtener estudiante por ID
  getById: (id) => api.get(`/estudiantes/${id}/`),

  // Crear nuevo estudiante
  create: (data) => api.post("/estudiantes/", data),

  // Actualizar estudiante
  update: (id, data) => api.put(`/estudiantes/${id}/`, data),

  // Eliminar estudiante
  delete: (id) => api.delete(`/estudiantes/${id}/`),

  // Obtener estudiantes activos
  getActivos: () => api.get("/estudiantes/activos/"),

  // Buscar estudiantes
  search: (query) => api.get(`/estudiantes/?search=${query}`),

  // Descargar plantilla Excel
  downloadTemplate: () =>
    api.get("/estudiantes/template/", { responseType: "blob" }),
  // Carga masiva via Excel
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Forzar Authorization header aquí (usa token guardado en localStorage)
    const token = sessionStorage.getItem("token");
    const headers = { "Content-Type": "multipart/form-data" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return api.post("/estudiantes/bulk-upload/", formData, { headers });
  },
};

// Servicios para Profesores
export const profesoresAPI = {
  // Obtener todos los profesores
  getAll: () => api.get("/profesores/"),

  // Obtener profesor por ID
  getById: (id) => api.get(`/profesores/${id}/`),

  // Crear nuevo profesor
  create: (data) => api.post("/profesores/", data),

  // Actualizar profesor
  update: (id, data) => api.put(`/profesores/${id}/`, data),

  // Eliminar profesor
  delete: (id) => api.delete(`/profesores/${id}/`),

  // Obtener profesores activos
  getActivos: () => api.get("/profesores/activos/"),

  // Buscar profesores
  search: (query) => api.get(`/profesores/?search=${query}`),

  // Descargar plantilla Excel
  downloadTemplate: () =>
    api.get("/profesores/template/", { responseType: "blob" }),
  // Carga masiva via Excel
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Forzar Authorization header aquí (usa token guardado en localStorage)
    const token = sessionStorage.getItem("token");
    const headers = { "Content-Type": "multipart/form-data" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return api.post("/profesores/bulk-upload/", formData, { headers });
  },
};

// Servicios para datos de catálogo
export const catalogoAPI = {
  // Tipos de documento
  getTiposDocumento: () => api.get("/tipo-documento/"),

  // Géneros
  getGeneros: () => api.get("/genero/"),

  // Estados
  getEstados: () => api.get("/tipo-estado/"),

  // Tipos de Sangre
  getTiposSangre: () => api.get("/tipo-sangre/"),

  // Tipos Sisben
  getSisben: () => api.get("/sisben/"),

  // Departamentos
  getDepartamentos: () => api.get("/departamento/"),

  // Ciudades
  getCiudades: () => api.get("/ciudad/"),

  // Ciudades por departamento
  getCiudadesPorDepartamento: (departamentoId) =>
    api.get(`/ciudad/?departamento=${departamentoId}`),

  // Tipos de acudiente
  getTipoAcudiente: () => api.get("/tipo-acudiente/"),
};

export default api;

// Servicios para gestión de usuarios del sistema (core users)
export const usersAPI = {
  // Crear un user en el backend. El backend expone /api/register/ y el serializer espera
  // payload con { username, password, rol, ... }. Usamos /register/ para crear usuarios.
  create: (data) => api.post("/register/", data),
  // Nota: no hay un endpoint genérico /users/ expuesto en el backend; si se añade más
  // adelante, se puede ampliar esta API.
};

// Servicios para Acudientes y relaciones estudiante-acudiente
export const acudientesAPI = {
  getAll: () => api.get("/acudientes/"),
  getById: (id) => api.get(`/acudientes/${id}/`),
  create: (data) => api.post("/acudientes/", data),
  update: (id, data) => api.put(`/acudientes/${id}/`, data),
  delete: (id) => api.delete(`/acudientes/${id}/`),
};

export const estudiantesAcudientesAPI = {
  getAll: () => api.get("/estudiantes-acudientes/"),
  create: (data) => api.post("/estudiantes-acudientes/", data),
  delete: (id) => api.delete(`/estudiantes-acudientes/${id}/`),
  por_estudiante: (estudiante_id) =>
    api.get(
      `/estudiantes-acudientes/por_estudiante/?estudiante_id=${estudiante_id}`
    ),
  por_acudiente: (acudiente_id) =>
    api.get(
      `/estudiantes-acudientes/por_acudiente/?acudiente_id=${acudiente_id}`
    ),
};

export const BusquedaPorNombre = (documento) => {
  return api.get(`/estudiantes/?search=${documento}`);
};

export const BusquedaPorNombreP = (documento) => {
  return api.get(`/profesores/?search=${documento}`);
};

export const BusquedaPorNombreA = (documento) => {
  return api.get(`/acudientes/?search=${documento}`);
};
