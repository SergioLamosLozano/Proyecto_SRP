import axiosInstance from './axiosConfig';
import { jwtDecode } from "jwt-decode";

const baseURL = "http://127.0.0.1:8000/api";

// Servicios para Estudiantes
export const estudiantesAPI = {
  getAll: () => axiosInstance.get("/estudiantes/"),
  getById: (id) => axiosInstance.get(`/estudiantes/${id}/`),
  create: (data) => axiosInstance.post("/estudiantes/", data),
  update: (id, data) => axiosInstance.put(`/estudiantes/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/estudiantes/${id}/`),
  getActivos: () => axiosInstance.get("/estudiantes/activos/"),
  search: (query) => axiosInstance.get(`/estudiantes/?search=${query}`),
  downloadTemplate: () => axiosInstance.get("/estudiantes/template/", { responseType: "blob" }),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("/estudiantes/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
};

// Servicios para Profesores
export const profesoresAPI = {
  getAll: () => axiosInstance.get("/profesores/"),
  getById: (id) => axiosInstance.get(`/profesores/${id}/`),
  create: (data) => axiosInstance.post("/profesores/", data),
  update: (id, data) => axiosInstance.put(`/profesores/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/profesores/${id}/`),
  getActivos: () => axiosInstance.get("/profesores/activos/"),
  search: (query) => axiosInstance.get(`/profesores/?search=${query}`),
  downloadTemplate: () => axiosInstance.get("/profesores/template/", { responseType: "blob" }),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("/profesores/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
};

// Servicios para datos de catálogo
export const catalogoAPI = {
  getTiposDocumento: () => axiosInstance.get("/tipo-documento/"),
  getGeneros: () => axiosInstance.get("/genero/"),
  getEstados: () => axiosInstance.get("/tipo-estado/"),
  getTiposSangre: () => axiosInstance.get("/tipo-sangre/"),
  getSisben: () => axiosInstance.get("/sisben/"),
  getDepartamentos: () => axiosInstance.get("/departamento/"),
  getCiudades: () => axiosInstance.get("/ciudad/"),
  getCiudadesPorDepartamento: (departamentoId) => axiosInstance.get(`/ciudad/?departamento=${departamentoId}`),
  getTipoAcudiente: () => axiosInstance.get("/tipo-acudiente/"),
};

// Servicios para gestión de usuarios del sistema
export const usersAPI = {
  create: (data) => axiosInstance.post("/super-secreta-9834-hj3/register/", data),
};

// Servicios para Acudientes
export const acudientesAPI = {
  getAll: () => axiosInstance.get("/acudientes/"),
  getById: (id) => axiosInstance.get(`/acudientes/${id}/`),
  create: (data) => axiosInstance.post("/acudientes/", data),
  update: (id, data) => axiosInstance.put(`/acudientes/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/acudientes/${id}/`),
};

export const estudiantesAcudientesAPI = {
  getAll: () => axiosInstance.get("/estudiantes-acudientes/"),
  create: (data) => axiosInstance.post("/estudiantes-acudientes/", data),
  delete: (id) => axiosInstance.delete(`/estudiantes-acudientes/${id}/`),
  por_estudiante: (estudiante_id) => axiosInstance.get(`/estudiantes-acudientes/por_estudiante/?estudiante_id=${estudiante_id}`),
  por_acudiente: (acudiente_id) => axiosInstance.get(`/estudiantes-acudientes/por_acudiente/?acudiente_id=${acudiente_id}`),
};

export const BusquedaPorNombre = (documento) => axiosInstance.get(`/estudiantes/?search=${documento}`);
export const BusquedaPorNombreP = (documento) => axiosInstance.get(`/profesores/?search=${documento}`);
export const BusquedaPorNombreA = (documento) => axiosInstance.get(`/acudientes/?search=${documento}`);
export const padresAPI = (acudienteid) => axiosInstance.get(`/match-acudientes/verificar_coincidencias/?numero_documento_acudiente=${acudienteid}`);
export const EstudiantesGET = () => axiosInstance.get(`/estudiantes/`);
export const CrearEstudiante = (datos) => axiosInstance.post("/estudiantes/", datos);
export const EditarEstudiante = (id, datos) => axiosInstance.patch(`/estudiantes/${id}/`, datos);
export const Ciudad = () => axiosInstance.get("/ciudad/");
export const Sisben = () => axiosInstance.get("/sisben/");
export const ProfesorGET = () => axiosInstance.get("/profesores/");
export const CrearProfesores = (datos) => axiosInstance.post("/profesores/", datos);
export const EditarProfesores = (id, datos) => axiosInstance.patch(`/profesores/${id}/`, datos);
export const PadresGET = () => axiosInstance.get("/acudientes/");
export const CrearPadres = (datos) => axiosInstance.post("/acudientes/", datos);
export const EditarPadres = (id, datos) => axiosInstance.patch(`/acudientes/${id}/`, datos);
export const EliminarPadres = (id) => axiosInstance.delete(`/acudientes/${id}/`);
export const AsignacionDeAcudienteAEstudiante = (datos) => axiosInstance.post(`/estudiantes-acudientes/`, datos);
export const CrearUsuarioPadre = (datos) => {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("token");
  if (!token) {
    console.log("Error, no existe token");
    return;
  }
  const decoded = jwtDecode(token);
  const rol = decoded.rol;
  if (rol === "coordinacion" || rol === "secretaria") {
    return axiosInstance.post("/super-secreta-9834-hj3/register/", datos);
  } else {
    console.log("✖️ no tienes las credenciales para hacer esta peticion");
  }
};
export const actividadesAnteriores = (id) => axiosInstance.get(`/actividades/?profesor=${id}`);

export default axiosInstance;