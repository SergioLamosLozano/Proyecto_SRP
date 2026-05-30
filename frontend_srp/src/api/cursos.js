import axiosInstance from './axiosConfig';
import { Alert } from "../utils/alert";

const baseURL = "http://127.0.0.1:8000/api";

export const Cursos = () => {
  return axiosInstance.get(`/cursos/`);
};

export const BuscarCurso = (nombreCurso) => {
  return axiosInstance.get(`/cursos/?search=${nombreCurso}`);
};

export const NuevoCurso = (datos) => {
  return axiosInstance.post("/cursos/", datos);
};

export const EditarCurso = (idCurso, datos) => {
  return axiosInstance.patch(`/cursos/${idCurso}/`, datos);
};

export const EliminarCurso = (idCurso) => {
  return axiosInstance.delete(`/cursos/${idCurso}/`);
};

export const Materias = () => {
  return axiosInstance.get(`/materias/`);
};

export const BuscarMaterias = (nombreMateria) => {
  return axiosInstance.get(`/materias/?search=${nombreMateria}`);
};

export const NuevaMateria = (datos) => {
  return axiosInstance.post("/materias/", datos);
};

export const EditarMateria = (idMateria, datos) => {
  return axiosInstance.patch(`/materias/${idMateria}/`, datos);
};

export const EliminarMateria = (idMateria) => {
  return axiosInstance.delete(`/materias/${idMateria}/`);
};

export const MateriasAsignadas = () => {
  return axiosInstance.get(`/materias_asignadas/`);
};

export const Año_electivo = () => {
  return axiosInstance.get("/ano_electivo/");
};

export const Periodos = (incluirInactivos = false) => {
  const url = incluirInactivos
    ? "/periodo/?page_size=100&incluir_inactivos=1"
    : "/periodo/?page_size=100";
  return axiosInstance.get(url);
};

export const PeriodoById = (id) => {
  return axiosInstance.get(`/periodo/${id}/`);
};

export const CrearPeriodo = (datos) => {
  return axiosInstance.post("/periodo/", datos);
};

export const EditarPeriodo = (id, datos) => {
  return axiosInstance.patch(`/periodo/${id}/`, datos);
};

export const EliminarPeriodo = (id) => {
  return axiosInstance.delete(`/periodo/${id}/`);
};

export const CrearMateriaAsignada = (datos) => {
  return axiosInstance.post(`/materias_asignadas/`, datos);
};

export const EditarMateriaAsignada = (id, datos) => {
  return axiosInstance.patch(`/materias_asignadas/${id}/`, datos);
};

export const EliminarMateriaAsignada = (id) => {
  return axiosInstance.delete(`/materias_asignadas/${id}/`);
};

export const Estudiantes_cursos = () => {
  return axiosInstance.get(`/estudiante_cursos/`);
};

export const Estudiantes_cursosBucar = (id) => {
  return axiosInstance.get(`/estudiante_cursos/?search=${id}`);
};

export const CrearEstudiantesCursos = (datos) => {
  return axiosInstance.post(`/estudiante_cursos/`, datos);
};

export const EditarEstudiantesCursos = (id_estudiante_curso, datos) => {
  return axiosInstance.patch(`/estudiante_cursos/${id_estudiante_curso}/`, datos);
};

export const BuscarEstudiantes_cursos = (Estudiante) => {
  return axiosInstance.get(`/estudiante_cursos/?search=${Estudiante}`);
};

export const BuscarMateriaAsignada = (materia) => {
  return axiosInstance.get(`/materias_asignadas/?search=${materia}`);
};

export const EliminarEstudiantes_cursos = (id) => {
  return axiosInstance.delete(`/estudiante_cursos/${id}/`);
};

export const Estudiantes_notas = (id) => {
  return axiosInstance.get(`/notas/?fk_numero_documento_estudiante=${id}`);
};

export const Estudiantes_notas_por_periodo = (id, periodoId) => {
  return axiosInstance.get(
    `/notas/?fk_numero_documento_estudiante=${id}&fk_id_actividad__fk_id_periodo_academico=${periodoId}`,
  );
};

export const Estudiantes_definitivas = (id, periodoId) => {
  return axiosInstance.get(
    `/definitivas-estudiante/?estudiante=${id}&periodo=${periodoId}`,
  );
};

export const Estudiantes_notasPost = (datos) => {
  return axiosInstance.post(`/notas/`, datos);
};

export const Estudiantes_notasPatch = (id, datos) => {
  return axiosInstance.patch(`/notas/${id}/`, datos);
};

export const ActividadesPost = (datos) => {
  return axiosInstance.post(`/actividades/`, datos);
};

export const ActividadesPatch = (id, datos) => {
  return axiosInstance.patch(`/actividades/${id}/`, datos);
};

export const ActividadesDelete = (id) => {
  return axiosInstance.delete(`/actividades/${id}/`);
};

export const BuscarMateriasAsignadas = (id) => {
  return axiosInstance.get(`/obtener_materias/?numero_cedula=${id}`).catch(() => {
    alert("error al obtener las materias");
  });
};

export const BuscarCoincidenciaNotas = (id) => {
  return axiosInstance.get(`/notas/?fk_id_actividad=${id}`);
};

export const NotasGet = () => {
  return axiosInstance.get(`/notas/`);
};

export const BuscarNotas = (id) => {
  return axiosInstance.get(`/notas/?fk_numero_documento_estudiante=${id}`);
};

export const Estudiante_curso = (grado) => {
  return axiosInstance.get(`estudiantes_cursos/?curso=${grado}`).catch((err) => {
    Alert("error", err.response?.data?.error);
  });
};

export const Estudiante_id_curso = (grado) => {
  return axiosInstance.get(`estudiantes_cursos/?id_curso=${grado}`).catch((err) => {
    Alert("error", err.response?.data?.error);
  });
};

export const TraerActividades = (id_profesor) => {
  return axiosInstance
    .get(`/actividades_profesor/?id_profesor=${id_profesor}`)
    .catch((err) => {
      alert(err);
    });
};

export const CrearActividad = (datos) => {
  return axiosInstance
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
  return axiosInstance
    .get(`/resultados_aprendizaje/?id_profesor=${id_profesor}`)
    .catch((err) => {
      Alert("error", err.response?.data?.error);
      throw err;
    });
};

export const TraerActividadesPorRA = (id_ra) => {
  return axiosInstance.get(`/actividades_ra/?id_ra=${id_ra}`).catch((err) => {
    Alert("error", err.respose?.data?.error);
  });
};

export const Calificar_Estudiante = (datos) => {
  return axiosInstance
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
  return axiosInstance
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
  return axiosInstance
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

export const TraerMateriasProfesor = (id_profesor) => {
  return axiosInstance
    .get(`/traer_materias_profesor/?id_profesor=${id_profesor}`)
    .catch((err) => {
      Alert("error", err.respose?.data?.error);
      throw err;
    });
};

export const CrearRAs = (datos) => {
  return axiosInstance
    .post("/resultados_aprendizaje/", datos)
    .then((res) => {
      Alert("success", "R.A creado con exito");
      return res;
    })
    .catch((err) => {
      Alert("error", err.response?.data);
      throw err;
    });
};

export const ModificarRA = (id_ra, datos) => {
  return axiosInstance
    .patch(`/resultados_aprendizaje/?id_ra=${id_ra}`, datos)
    .then((res) => {
      Alert("success", "R.A modificado con exito");
      return res;
    })
    .catch((err) => {
      Alert("error", err.response?.data || "Error al modificar R.A");
      throw err;
    });
};

export const ObtenerDefinitivas = (datos) => {
  return axiosInstance.post("/definitivas/", datos);
};

export const ObtenerPromedioGeneral = (datos) => {
  return axiosInstance.post("/promedio/", datos);
};

export const TraerMateriasAgrupadas = (datos) => {
  return axiosInstance.get("/traer_todas_las_materias_agrupadas/");
};

export const ConsultarNotasCurso = (idCurso, idMateria, idPeriodo) => {
  return axiosInstance.get(
    `/consultar_notas_curso/?id_curso=${idCurso}&fk_id_materia=${idMateria}&fk_id_periodo=${idPeriodo}`
  );
};

// Configuración de Boletines
export const ObtenerConfiguracionBoletines = () => {
  return axiosInstance.get(`/configuracion/boletines/`);
};

export const ActualizarConfiguracionBoletines = (datos) => {
  return axiosInstance.put(`/configuracion/boletines/1/`, datos);
};

export const ObtenerEstadoBoletines = () => {
  // Este endpoint es público, no requiere autenticación
  return fetch(`${baseURL}/configuracion/boletines/estado/`)
    .then(res => res.json());
};