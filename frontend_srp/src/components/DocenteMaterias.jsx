import React, { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import "../styles/Materias.css";
import { jwtDecode } from "jwt-decode";
import { TraerMateriasProfesor, Estudiante_id_curso } from "../api/cursos";
import Table from "./Table";

function DocentesMaterias({ onBack }) {
  const [caso, setcaso] = useState(0); // 0: Materias, 1: Cursos, 2: Tabla Estudiantes
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [cursoSeleccionadoTexto, setCursoSeleccionadoTexto] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);

  const cargarMaterias = async (idProfesor) => {
    try {
      const res = await TraerMateriasProfesor(idProfesor);
      setMaterias(res.data);
    } catch (error) {
      console.error("Error cargando materias agrupadas:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decod = jwtDecode(token);
      cargarMaterias(decod.username);
    }
  }, []);

  // 1. Configuración de rutas estables en el Breadcrumb para cada caso
  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Página Docentes", path: "/docentes" },
    { label: "Materias Asignadas", path: "/docentes/materias" },
    ...(caso >= 1 && materiaSeleccionada
      ? [
          {
            label: materiaSeleccionada.nombre_materia,
            path: "/docentes/materias/cursos",
          },
        ]
      : []),
    ...(caso === 2 && cursoSeleccionadoTexto
      ? [
          {
            label: cursoSeleccionadoTexto,
            path: "/docentes/materias/estudiantes",
          },
        ]
      : []),
  ];

  // 2. Control inteligente del retorno de pestañas usando los Paths establecidos arriba
  const handleNavigate = (path) => {
    if (path === "/docentes/materias") {
      // Regresa al catálogo global de tus materias asignadas
      setcaso(0);
      setMateriaSeleccionada(null);
    } else if (path === "/docentes/materias/cursos") {
      // Si estás en los estudiantes y pisas la materia, te devuelve a sus cursos
      setcaso(1);
    } else {
      // Si pisas cualquier ruta externa, se sale al módulo principal de docentes
      onBack();
    }
  };

  const handleSeleccionarMateria = (materiaObjeto) => {
    setMateriaSeleccionada(materiaObjeto);
    setcaso(1);
  };

  const AccederAlGrado = async (idCurso, nombreCurso) => {
    try {
      const res = await Estudiante_id_curso(idCurso);
      setCursoSeleccionadoTexto(nombreCurso);

      if (!res || !res.data || res.data.length === 0) {
        setEstudiantes(null);
        setcaso(2);
        return;
      }

      const estudiantesFormateados = res.data.map((item) => ({
        documento: item.estudiante.numero_documento,
        nombre: item.estudiante.nombre,
        correo: item.estudiante.correo,
        telefono: item.estudiante.telefono,
        estado: item.estudiante.estado,
      }));

      setEstudiantes(estudiantesFormateados);
      setcaso(2);
    } catch (error) {
      console.error("Error al traer estudiantes por id_curso:", error);
      setEstudiantes(null);
      setcaso(2);
    }
  };

  // VISTA 0: Mapeo de Materias Únicas
  const VistaMaterias = () => (
    <div>
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div
        className="definitivas-titulo"
        style={{ marginBottom: "25px", borderRadius: "10px 10px 0 0" }}
      >
        <h1>Asignaturas Asignadas</h1>
        <p>Selecciona una materia para desplegar y gestionar sus cursos.</p>
      </div>
      <div className="contenedor-materia">
        {materias.length > 0 ? (
          materias.map((item, index) => (
            <div
              key={index}
              className="matematicas-descripcion"
              onClick={() => handleSeleccionarMateria(item)}
            >
              <span>{item.nombre_materia}</span>
              <label>
                {item.cursos.length}{" "}
                {item.cursos.length === 1
                  ? "Curso asignado"
                  : "Cursos asignados"}
              </label>
            </div>
          ))
        ) : (
          <div className="no-datos-mensaje">
            No tienes materias asignadas en este periodo.
          </div>
        )}
      </div>
    </div>
  );

  // VISTA 1: Desglose de los Cursos
  const VistaCursosPorMateria = () => (
    <div>
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div
        className="definitivas-titulo"
        style={{ marginBottom: "25px", borderRadius: "10px 10px 0 0" }}
      >
        <h1>{materiaSeleccionada?.nombre_materia}</h1>
        <p>
          Cursos asignados a esta asignatura. Selecciona uno para ver
          estudiantes.
        </p>
      </div>

      <div className="contenedor-cursos-columna">
        {materiaSeleccionada?.cursos.map((item2, index2) => {
          const idCursoReal =
            item2.id_curso || item2.fk_id_curso || item2.id_cursos;
          return (
            <div
              key={index2}
              className="curso-fila-alargada"
              onClick={() => AccederAlGrado(idCursoReal, item2.nombre_curso)}
            >
              <div className="curso-fila-info">
                <div className="curso-fila-icono">🏫</div>
                <div className="curso-fila-texto-principal">
                  {item2.nombre_curso}
                </div>
              </div>
              <div className="curso-fila-badge">Grupo Académico</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // VISTA 2: Tabla de Estudiantes
  const VistaEstudiantesMateria = () => (
    <div>
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div className="contenedor-materia2">
        {estudiantes != null ? (
          <Table
            id="Estudiantes"
            data={estudiantes}
            users={estudiantes}
            parametrobuscar="documento"
            busqueda={["documento", "nombre"]}
            title={`Estudiantes de ${materiaSeleccionada?.nombre_materia}`}
            description={`Listado oficial asignado a ${cursoSeleccionadoTexto}.`}
            columns={[
              { key: "nombre", label: "NOMBRE" },
              { key: "documento", label: "IDENTIFICACIÓN" },
              { key: "correo", label: "CORREO" },
              { key: "telefono", label: "TELEFONO" },
              { key: "estado", label: "ESTADO" },
            ]}
            searchPlaceholder="Buscar por documento o nombre..."
            addButtonText="Añadir estudiante"
            actions={[{ label: "ver 👀" }]}
          />
        ) : (
          <div
            className="definitivas-explicacion-contenedor"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <h2>No hay estudiantes registrados</h2>
            <p>Este grado no cuenta con alumnos matriculados actualmente.</p>
            <button
              className="definitivas-btn definitivas-btn-primario"
              onClick={() => setcaso(1)}
              style={{ marginTop: "15px" }}
            >
              Volver a Cursos
            </button>
          </div>
        )}
      </div>
    </div>
  );

  switch (caso) {
    case 0:
      return <VistaMaterias />;
    case 1:
      return <VistaCursosPorMateria />;
    case 2:
      return <VistaEstudiantesMateria />;
    default:
      return <VistaMaterias />;
  }
}

export default DocentesMaterias;
