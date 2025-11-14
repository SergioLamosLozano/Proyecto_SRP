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
