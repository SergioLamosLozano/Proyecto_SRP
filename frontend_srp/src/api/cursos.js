import axios from "axios";
import { Alert } from "../utils/alert";

const baseURL = "http://127.0.0.1:8000/api";

// Configuración de axios
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar Authorization automáticamente desde sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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

export const Periodos = () => {
  return api.get("/periodo/?page_size=100");
};

export const PeriodoById = (id) => {
  return api.get(`/periodo/${id}/`);
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

export const Estudiantes_notas_por_periodo = (id, periodoId) => {
  return api.get(
    `/notas/?fk_numero_documento_estudiante=${id}&fk_id_actividad__fk_id_periodo_academico=${periodoId}`,
  );
};

export const Estudiantes_notasPost = (datos) => {
  const token = sessionStorage.getItem("token");
  return api.post(`/notas/`, datos, {
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });
};

export const Estudiantes_notasPatch = (id, datos) => {
  const token = sessionStorage.getItem("token");
  return api.patch(`/notas/${id}/`, datos, {
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
  return api.get(`/obtener_materias/?numero_cedula=${id}`).catch(() => {
    alert("error al obtener las materias");
  });
};

export const BuscarCoincidenciaNotas = (id) => {
  return api.get(`/notas/?fk_id_actividad=${id}`);
};

export const NotasGet = () => {
  return api.get(`/notas/`);
};

export const BuscarNotas = (id) => {
  return api.get(`/notas/?fk_numero_documento_estudiante=${id}`);
};

export const Estudiante_curso = (grado) => {
  return api.get(`estudiantes_cursos/?curso=${grado}`).catch((err) => {
    Alert("error", err.response?.data?.error);
  });
};

export const Estudiante_id_curso = (grado) => {
  return api.get(`estudiantes_cursos/?id_curso=${grado}`).catch((err) => {
    Alert("error", err.response?.data?.error);
  });
};

export const TraerActividades = (id_profesor) => {
  return api
    .get(`/actividades_profesor/?id_profesor=${id_profesor}`)
    .catch((err) => {
      alert(err);
    });
};

export const CrearActividad = (datos) => {
  return api
    .post("/actividades_profesor/", datos)
    .then((res) => {
      Alert("success", "actividad creada con exito");
      return res;
    })
    .catch((err) => {
      Alert("error", err.response?.data?.error);
      throw err;
    });
};

export const TraerRAProfesor = (id_profesor) => {
  return api
    .get(`/resultados_aprendizaje/?id_profesor=${id_profesor}`)
    .catch((err) => {
      Alert("error", err.response?.data?.error);
      throw err;
    });
};

export const TraerActividadesPorRA = (id_ra) => {
  return api.get(`/actividades_ra/?id_ra=${id_ra}`).catch((err) => {
    Alert("error", err.respose?.data?.error);
  });
};

export const Calificar_Estudiante = (datos) => {
  return api
    .post("/calificar_estudiante/", datos)
    .then((res) => {
      Alert("success", "calificacion asiganada con exito");
      return res;
    })
    .catch((err) => {
      Alert("error", err.response?.data?.error);
      throw err;
    });
};

export const Calificar_Estudiante_buscar_estudiante = (estudiante, datos) => {
  return api
    .get("/calificar_estudiante/", {
      params: {
        estudiante: estudiante,
        id_ra: datos,
      },
    })
    .catch((err) => {
      Alert("error", err.response?.data);
      throw err;
    });
};

export const Modificar_Nota_estudiante = (estudiante, datos) => {
  return api
    .patch(`/calificar_estudiante/?id_nota_estudiante=${estudiante}`, datos)
    .then((res) => {
      Alert("success", "Nota actualizada con exito");
      return res;
    })
    .catch((err) => {
      Alert("error", err.response?.data?.error);
      throw err;
    });
};
