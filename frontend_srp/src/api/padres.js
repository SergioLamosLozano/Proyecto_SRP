import api from './usuarios';

export const padresAPI = {
  // Relaciones estudiante-acudiente por acudiente (usa interceptor con Authorization)
  getRelacionesPorAcudiente: (acudienteId) =>
    api.get('/estudiantes-acudientes/por_acudiente/', {
      params: { acudiente_id: acudienteId },
    }),

  // Detalle de estudiante por su PK (numero_documento_estudiante)
  getEstudianteDetalle: (numeroDocumento) =>
    api.get(`/estudiantes/${numeroDocumento}/`),
};