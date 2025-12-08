import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

// Configuración de axios
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Cursos = () => {
  return api.get(`/cursos/`);
};

export const BuscarCurso = (nombreCurso) => {
  return api.get(`/cursos/?search=${nombreCurso}`);
};

export const NuevoCurso = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post("/cursos/", datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditarCurso = (idCurso, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/cursos/${idCurso}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EliminarCurso = (idCurso) => {
  const token = sessionStorage.getItem("token");
  return api.delete(`/cursos/${idCurso}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Materias = () => {
  return api.get(`/materias/`);
};

export const BuscarMaterias = (nombreMateria) => {
  return api.get(`/materias/?search=${nombreMateria}`);
};

export const NuevaMateria = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post("/materias/", datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditarMateria = (idMateria, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/materias/${idMateria}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EliminarMateria = (idMateria) => {
  const token = sessionStorage.getItem("token");
  return api.delete(`/materias/${idMateria}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const MateriasAsignadas = () => {
  return api.get(`/materias_asignadas/`);
};

export const Año_electivo = () => {
  return api.get("/ano_electivo/");
};

export const CrearMateriaAsignada = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post(`/materias_asignadas/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditarMateriaAsignada = (id, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/materias_asignadas/${id}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EliminarMateriaAsignada = (id) => {
  const token = sessionStorage.getItem("token");
  return api.delete(`/materias_asignadas/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Estudiantes_cursos = () => {
  return api.get(`/estudiantes_cursos/`);
};

export const Estudiantes_cursosBucar = (id) => {
  return api.get(`/estudiantes_cursos/?search=${id}`);
};

export const CrearEstudiantesCursos = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post(`/estudiantes_cursos/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditarEstudiantesCursos = (id_estudiante_curso, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/estudiantes_cursos/${id_estudiante_curso}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const BuscarEstudiantes_cursos = (Estudiante) => {
  return api.get(`/estudiantes_cursos/?search=${Estudiante}`);
};

export const BuscarMateriaAsignada = (materia) => {
  return api.get(`/materias_asignadas/?search=${materia}`);
};

export const EliminarEstudiantes_cursos = (id) => {
  const token = sessionStorage.getItem("token");
  return api.delete(`/estudiantes_cursos/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Estudiantes_notas = (id) => {
  return api.get(`/notas/?fk_numero_documento_estudiante=${id}`);
};

export const Estudiantes_notasPost = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post(`/notas/`, datos, {
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });
};

export const ActividadesPost = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post(`/actividades/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ActividadesPatch = (id, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/actividades/${id}/`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ActividadesDelete = (id) => {
  const token = sessionStorage.getItem("token");
  return api.delete(`/actividades/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const BuscarMateriasAsignadas = (id) => {
  return api.get(`/materias_asignadas/?fk_numero_documento_profesor=${id}`);
};

export const BuscarCoincidenciaNotas = (id) => {
  return api.get(`/notas/?fk_id_actividad=${id}`);
};
