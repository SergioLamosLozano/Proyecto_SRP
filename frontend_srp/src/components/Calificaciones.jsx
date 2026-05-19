import React, { useEffect, useState } from "react";
import "../styles/Coordinacion.css";
import "../styles/Calificaciones.css";
import Breadcrumbs from "./Breadcrumbs";
import Table from "./Table";
import { EstudiantesGET } from "../api/usuarios";
import { TraerMateriasAgrupadas } from "../api/cursos";
import VerNotas from "./VerNotas";

const Calificaciones = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  // Estados para el flujo en cascada estricto
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [cursosVisibles, setCursosVisibles] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Estudiantes y notas
  const [EstudianteN, setEstudianteN] = useState([]);
  const [listaNueva, setListaNueva] = useState([]);
  const [VerCalificacion, setVerCalificacion] = useState(false);
  const [nombre, setNombre] = useState("");
  const [Grado, setGrado] = useState(false);

  const MateriasAgrupadas = async () => {
    const res = await TraerMateriasAgrupadas();
    setMaterias(res.data || []);
  };

  useEffect(() => {
    MateriasAgrupadas();
  }, []);

  // Controladores para la navegación limpia Materia -> Cursos
  const handleMateriaClick = (materia) => {
    if (materia) {
      setMateriaSeleccionada(materia);
      setCursosVisibles(materia.cursos || []);
      setCursoSeleccionado(null); // Resetear curso por si acaso
    }
  };

  const handleCursoClick = (curso) => {
    if (curso) {
      setCursoSeleccionado(curso);
      // Aquí puedes disparar la carga de estudiantes o la tabla en el futuro
    }
  };

  const RegresarAMaterias = () => {
    setMateriaSeleccionada(null);
    setCursosVisibles([]);
    setCursoSeleccionado(null);
  };

  const RegresarACursos = () => {
    setCursoSeleccionado(null);
  };

  // Construcción de Breadcrumbs Dinámicas y Atómicas
  const breadcrumbItems = [
    { label: "Inicio", path: "/coordinacion" },
    { label: "Coordinación Administrativa", path: "/coordinacion" },
    { label: "Calificaciones", path: "/coordinacion/calificaciones" },
    ...(currentSubSection
      ? [
          {
            label: currentSubSection === "cno" ? "CNO" : "Carga Masiva",
            path: `/coordinacion/calificaciones/${currentSubSection}`,
          },
        ]
      : []),
    ...(materiaSeleccionada
      ? [
          {
            label: materiaSeleccionada.nombre_materia,
            path: `/coordinacion/calificaciones/${currentSubSection}/materia`,
          },
        ]
      : []),
    ...(cursoSeleccionado
      ? [
          {
            label: cursoSeleccionado.nombre_curso,
            path: `/coordinacion/calificaciones/${currentSubSection}/materia/curso`,
          },
        ]
      : []),
  ];

  // Interceptador de clicks en las Breadcrumbs para desmontar vistas ordenadamente
  const handleNavigate = (path) => {
    if (path === "/coordinacion") {
      onBack();
    } else if (path === "/coordinacion/calificaciones") {
      setCurrentSubSection(null);
      RegresarAMaterias();
    } else if (path === `/coordinacion/calificaciones/${currentSubSection}`) {
      // Clic en 'CNO' -> Regresa a ver el listado de materias
      RegresarAMaterias();
    } else if (
      path === `/coordinacion/calificaciones/${currentSubSection}/materia`
    ) {
      // Clic en la Materia actual -> Desmota la tabla/vista de estudiantes y vuelve a cursos
      RegresarACursos();
    }
  };

  const calificationSections = [
    {
      id: "cno",
      title: "CNO",
      description:
        "Accede al sistema CNO para la gestión de calificaciones y certificaciones.",
      icon: "🎓",
      buttonText: "Acceder a CNO",
    },
    {
      id: "carga-masiva",
      title: "Carga Masiva",
      description:
        "Realiza carga masiva de calificaciones mediante archivos Excel o CSV.",
      icon: "📊",
      buttonText: "Cargar Calificaciones",
    },
  ];

  const handleSectionClick = (sectionId) => {
    setCurrentSubSection(sectionId);
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case "cno":
        return (
          <div>
            {/* VISTA 1: Listar Materias (Si no hay ninguna seleccionada) */}
            {!materiaSeleccionada && (
              <div>
                <h2
                  className="dashboard-title"
                  style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
                >
                  Seleccione una Materia
                </h2>
                <div className="dashboard-grid">
                  {materias.map((mat, index) => (
                    <div
                      key={`materia-${mat.fk_id_materia}-${index}`}
                      className="dashboard-card"
                      onClick={() => handleMateriaClick(mat)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-header">
                        <span className="card-icon">📖</span>
                        <h3
                          className="card-title"
                          style={{ textTransform: "capitalize" }}
                        >
                          {mat.nombre_materia}
                        </h3>
                      </div>
                      <p className="card-description">
                        {mat.cursos?.length || 0} cursos asignados.
                      </p>
                      <button className="card-button">Ver Cursos</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 2: Listar Cursos de la Materia Seleccionada (Y no se ha entrado a un curso específico) */}
            {materiaSeleccionada && !cursoSeleccionado && (
              <div>
                <h2
                  className="dashboard-title"
                  style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
                >
                  Cursos para:{" "}
                  <span
                    style={{
                      color: "var(--primary-color, #4a90e2)",
                      textTransform: "capitalize",
                    }}
                  >
                    {materiaSeleccionada.nombre_materia}
                  </span>
                </h2>
                <div className="dashboard-grid">
                  {cursosVisibles.map((cur, index) => (
                    <div
                      key={`curso-${cur.id_curso}-${index}`}
                      className="dashboard-card"
                      onClick={() => handleCursoClick(cur)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-header">
                        <span className="card-icon">🏫</span>
                        <h3 className="card-title">{cur.nombre_curso}</h3>
                      </div>
                      <p className="card-description">
                        Planilla académica disponible.
                      </p>
                      <button className="card-button">Gestionar</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 3: Espacio reservado para cuando se selecciona el Curso */}
            {materiaSeleccionada && cursoSeleccionado && (
              <div>
                <h2
                  className="dashboard-title"
                  style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
                >
                  Planilla de Estudiantes: {cursoSeleccionado.nombre_curso}
                </h2>
                <p className="card-description">
                  Aquí puedes inyectar tu componente o {"<Table />"} de alumnos
                  sin flujos cruzados rudimentarios.
                </p>
              </div>
            )}
          </div>
        );
      case "carga-masiva":
        return (
          <div>
            <h2>Carga Masiva de Calificaciones</h2>
            <p>Funcionalidad de carga masiva en desarrollo...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div className="dashboard-content">
        {currentSubSection ? (
          renderSubSection()
        ) : (
          <>
            <div className="dashboard-header">
              <h1 className="dashboard-title">Calificaciones</h1>
              <p className="dashboard-subtitle">
                Gestión de calificaciones y certificaciones académicas
              </p>
            </div>
            <div className="dashboard-grid">
              {calificationSections.map((section) => (
                <div
                  key={section.id}
                  className="dashboard-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="card-header">
                    <span className="card-icon">{section.icon}</span>
                    <h3 className="card-title">{section.title}</h3>
                  </div>
                  <p className="card-description">{section.description}</p>
                  <button className="card-button">{section.buttonText}</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calificaciones;
