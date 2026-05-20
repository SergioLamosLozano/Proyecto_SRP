import React, { useEffect, useState } from "react";
import "../styles/Coordinacion.css";
import "../styles/Calificaciones.css";
import Breadcrumbs from "./Breadcrumbs";
import Table from "./Table";
import { EstudiantesGET } from "../api/usuarios";
import { TraerMateriasAgrupadas, Periodos, ConsultarNotasCurso } from "../api/cursos";
import VerNotas from "./VerNotas";

const Calificaciones = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  // Estados para el flujo en cascada estricto
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [cursosVisibles, setCursosVisibles] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Periodos y notas
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
  const [notasCurso, setNotasCurso] = useState([]);
  const [loadingNotas, setLoadingNotas] = useState(false);

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

  const CargarPeriodos = async () => {
    try {
      const res = await Periodos();
      setPeriodos(res.data || []);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  const CargarNotasCurso = async () => {
    if (!cursoSeleccionado || !materiaSeleccionada || !periodoSeleccionado) {
      return;
    }

    try {
      setLoadingNotas(true);
      const res = await ConsultarNotasCurso(
        cursoSeleccionado.id_curso,
        materiaSeleccionada.fk_id_materia,
        periodoSeleccionado
      );
      setNotasCurso(res.data || []);
    } catch (error) {
      console.error("Error cargando notas:", error);
      setNotasCurso([]);
    } finally {
      setLoadingNotas(false);
    }
  };

  useEffect(() => {
    MateriasAgrupadas();
    CargarPeriodos();
  }, []);

  useEffect(() => {
    if (cursoSeleccionado && materiaSeleccionada && periodoSeleccionado) {
      CargarNotasCurso();
    }
  }, [cursoSeleccionado, materiaSeleccionada, periodoSeleccionado]);

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
      setNotasCurso([]); // Limpiar notas anteriores
      setPeriodoSeleccionado(null); // Resetear periodo
    }
  };

  const RegresarAMaterias = () => {
    setMateriaSeleccionada(null);
    setCursosVisibles([]);
    setCursoSeleccionado(null);
  };

  const RegresarACursos = () => {
    setCursoSeleccionado(null);
    setNotasCurso([]);
    setPeriodoSeleccionado(null);
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

            {/* VISTA 3: Tabla de Notas del Curso Seleccionado */}
            {materiaSeleccionada && cursoSeleccionado && (
              <div>
                <h2
                  className="dashboard-title"
                  style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
                >
                  Planilla de Notas: {cursoSeleccionado.nombre_curso} -{" "}
                  {materiaSeleccionada.nombre_materia}
                </h2>

                {/* Selector de Periodo */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="periodo-select"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Seleccione un Periodo:
                  </label>
                  <select
                    id="periodo-select"
                    value={periodoSeleccionado || ""}
                    onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                    style={{
                      padding: "0.75rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      width: "300px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">-- Seleccione un periodo --</option>
                    {periodos.map((periodo) => (
                      <option
                        key={periodo.id_periodo}
                        value={periodo.id_periodo}
                      >
                        Periodo {periodo.id_periodo} ({periodo.fecha_inicio} -{" "}
                        {periodo.fecha_fin})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tabla de Notas */}
                {loadingNotas ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Cargando notas...</p>
                  </div>
                ) : !periodoSeleccionado ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#666",
                    }}
                  >
                    <p>Por favor seleccione un periodo para ver las notas.</p>
                  </div>
                ) : notasCurso.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#666",
                    }}
                  >
                    <p>No hay notas registradas para este curso y periodo.</p>
                  </div>
                ) : (
                  <TablaNotasCNO notas={notasCurso} />
                )}
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

// Componente para la Tabla de Notas CNO
const TablaNotasCNO = ({ notas }) => {
  // Agrupar notas por estudiante y actividad
  const procesarNotas = () => {
    const estudiantesMap = {};
    const actividadesSet = new Set();

    // Primera pasada: recopilar estudiantes y actividades
    notas.forEach((nota) => {
      const docEstudiante = nota.fk_numero_documento_estudiante;
      const nombreEstudiante = nota.nombre_completo_estudiante;
      const actividadId = nota.fk_id_actividad;
      const nombreActividad = nota.nombre_actividad;

      // Agregar estudiante si no existe
      if (!estudiantesMap[docEstudiante]) {
        estudiantesMap[docEstudiante] = {
          documento: docEstudiante,
          nombre: nombreEstudiante,
          notas: {},
        };
      }

      // Agregar actividad
      actividadesSet.add(
        JSON.stringify({ id: actividadId, nombre: nombreActividad })
      );

      // Agregar nota del estudiante para esta actividad
      estudiantesMap[docEstudiante].notas[actividadId] = nota.calificacion;
    });

    // Convertir actividades a array y ordenar
    const actividades = Array.from(actividadesSet)
      .map((a) => JSON.parse(a))
      .sort((a, b) => a.id - b.id);

    // Convertir estudiantes a array
    const estudiantes = Object.values(estudiantesMap).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );

    return { estudiantes, actividades };
  };

  const { estudiantes, actividades } = procesarNotas();

  // Calcular promedio de un estudiante
  const calcularPromedio = (notasEstudiante) => {
    const notasValidas = Object.values(notasEstudiante).filter(
      (n) => n !== null && n !== undefined
    );
    if (notasValidas.length === 0) return "0.00";
    const suma = notasValidas.reduce((acc, nota) => acc + parseFloat(nota), 0);
    return (suma / notasValidas.length).toFixed(2);
  };

  return (
    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ 
            background: "linear-gradient(90deg, #b71c1c, #d32f2f)", 
            color: "#fff" 
          }}>
            <th
              style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                borderRight: "1px solid rgba(255,255,255,0.2)",
                position: "sticky",
                left: 0,
                background: "linear-gradient(90deg, #b71c1c, #d32f2f)",
                zIndex: 2,
              }}
            >
              Documento
            </th>
            <th
              style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                borderRight: "1px solid rgba(255,255,255,0.2)",
                minWidth: "200px",
              }}
            >
              Nombre Completo
            </th>
            {actividades.map((actividad) => (
              <th
                key={actividad.id}
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontWeight: "600",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                  minWidth: "120px",
                }}
                title={actividad.nombre}
              >
                {actividad.nombre.length > 15
                  ? actividad.nombre.substring(0, 15) + "..."
                  : actividad.nombre}
              </th>
            ))}
            <th
              style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
                backgroundColor: "#b71c1c",
              }}
            >
              Promedio
            </th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante, index) => (
            <tr
              key={estudiante.documento}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                borderBottom: "1px solid #eee",
              }}
            >
              <td
                style={{
                  padding: "0.75rem 1rem",
                  borderRight: "1px solid #eee",
                  fontWeight: "500",
                  position: "sticky",
                  left: 0,
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  zIndex: 1,
                }}
              >
                {estudiante.documento}
              </td>
              <td
                style={{
                  padding: "0.75rem 1rem",
                  borderRight: "1px solid #eee",
                }}
              >
                {estudiante.nombre}
              </td>
              {actividades.map((actividad) => {
                const nota = estudiante.notas[actividad.id];
                const notaValor = nota !== undefined && nota !== null ? parseFloat(nota) : 0;
                
                // Determinar colores según el rango
                const getColors = (valor) => {
                  if (valor === 0) {
                    return { bg: "#f5f5f5", text: "#999" }; // Sin calificar
                  } else if (valor < 3.0) {
                    return { bg: "#ffebee", text: "#d32f2f" }; // Insuficiente
                  } else if (valor >= 3.0 && valor < 4.0) {
                    return { bg: "#fff9c4", text: "#f57f17" }; // Aceptable
                  } else {
                    return { bg: "#e8f5e9", text: "#2e7d32" }; // Excelente
                  }
                };

                const colors = getColors(notaValor);

                return (
                  <td
                    key={actividad.id}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "center",
                      borderRight: "1px solid #eee",
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {notaValor.toFixed(2)}
                  </td>
                );
              })}
              <td
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  fontWeight: "700",
                  backgroundColor: (() => {
                    const promedio = parseFloat(calcularPromedio(estudiante.notas));
                    if (promedio < 3.0) return "#ffebee"; // Rojo claro
                    if (promedio >= 3.0 && promedio < 4.0) return "#fff9c4"; // Amarillo claro
                    return "#e8f5e9"; // Verde claro
                  })(),
                  color: (() => {
                    const promedio = parseFloat(calcularPromedio(estudiante.notas));
                    if (promedio < 3.0) return "#d32f2f"; // Rojo
                    if (promedio >= 3.0 && promedio < 4.0) return "#f57f17"; // Amarillo oscuro
                    return "#2e7d32"; // Verde oscuro
                  })(),
                }}
              >
                {calcularPromedio(estudiante.notas)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Leyenda */}
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: "600" }}>
          Sistema de Calificación por Colores:
        </h4>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#2e7d32",
                borderRadius: "4px",
              }}
            ></div>
            <span><strong>Excelente:</strong> 4.0 - 5.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#f57f17",
                borderRadius: "4px",
              }}
            ></div>
            <span><strong>Aceptable:</strong> 3.0 - 3.9</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#d32f2f",
                borderRadius: "4px",
              }}
            ></div>
            <span><strong>Insuficiente:</strong> &lt; 3.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#999",
                borderRadius: "4px",
              }}
            ></div>
            <span><strong>Sin calificar:</strong> 0.00</span>
          </div>
        </div>
        <p style={{ 
          marginTop: "0.75rem", 
          marginBottom: 0, 
          fontSize: "0.85rem", 
          color: "#666",
          fontStyle: "italic" 
        }}>
          * Este sistema de colores aplica a todas las calificaciones y promedios de la tabla.
        </p>
      </div>
    </div>
  );
};

export default Calificaciones;
