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
