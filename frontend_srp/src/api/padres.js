import axios from 'axios';

const API_BASE = '/api';

export const padresAPI = {
  getRelacionesPorAcudiente: async (acudienteId) => {
    return axios.get(`${API_BASE}/estudiantes-acudientes/por_acudiente/`, {
      params: { acudiente_id: acudienteId },
    });
  },
  getEstudianteDetalle: async (numeroDocumento) => {
    return axios.get(`${API_BASE}/estudiantes/${numeroDocumento}/`);
  },
};