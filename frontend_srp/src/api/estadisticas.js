import axiosInstance from './axiosConfig';

export const obtenerEstadisticasGenerales = async () => {
  const response = await axiosInstance.get('/estadisticas/generales/');
  return response.data;
};

export const obtenerEstadisticasDemograficas = async () => {
  const response = await axiosInstance.get('/estadisticas/demograficas/');
  return response.data;
};

export const obtenerEstadisticasAcademicas = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.periodo_id) params.append('periodo_id', filtros.periodo_id);
  if (filtros.curso_id) params.append('curso_id', filtros.curso_id);
  
  const response = await axiosInstance.get(`/estadisticas/academicas/?${params.toString()}`);
  return response.data;
};

export const obtenerEstadisticasInstitucionales = async () => {
  const response = await axiosInstance.get('/estadisticas/institucionales/');
  return response.data;
};

export const obtenerEstadisticasComparativas = async () => {
  const response = await axiosInstance.get('/estadisticas/comparativas/');
  return response.data;
};

export const obtenerFiltrosDisponibles = async () => {
  const response = await axiosInstance.get('/estadisticas/filtros/');
  return response.data;
};
