import React, { useEffect, useState } from "react";
import "../styles/Coordinacion.css";
import "../styles/Calificaciones.css";
import Breadcrumbs from "./Breadcrumbs";
import Table from "./Table";
import { EstudiantesGET } from "../api/usuarios";
import {
  Cursos,
  Estudiantes_cursos,
  Estudiantes_cursosBucar,
  Estudiantes_notas,
} from "../api/cursos";
import VerNotas from "./VerNotas";
import VerCursos from "./VerCursos";

const Calificaciones = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  //estudiantes y notas
  const [EstudianteN, setEstudianteN] = useState([]);
  const [listaNueva, setListaNueva] = useState([]);
  const [VerCalificacion, setVerCalificacion] = useState(false);
  const [nombre, setNombre] = useState("");
  const [Grado, setGrado] = useState(false);
  const [cursos, setCursos] = useState([]);
  //cargar Estudiantes y notas
  const CargarEN = async () => {
    try {
      const response2 = await Cursos();
      setCursos(response2.data);
    } catch (err) {
      console.log(err);
    }
  };
  //useEffect para cargar todo
  useEffect(() => {
    CargarEN();
  }, []);
  //buscar notas
  const Notas = async (item) => {
    if (item) {
      try {
        const respons = await Estudiantes_notas(
          item.numero_documento_estudiante
        );
        const ListaC = respons.data.map((nota) => ({
          documento: nota.estudiante.numero_documento_estudiante,
          nombre: nota.estudiante.nombre_completo,
          calificacion: nota.calificacion,
          actividad: nota.actividad.Tipo_Actividad,
          porcentaje: nota.actividad.porcentaje,
          materia: nota.actividad.MateriaProfesores.materia_nombre,
          curso: nota.actividad.MateriaProfesores.curso_nombre,
        }));
        setNombre(item.nombre1);
        setListaNueva(ListaC);
        setVerCalificacion(true);
      } catch (err) {
        console.log(err);
      }
    }
  };
  //breadcrums
  const breadcrumbItems = [
    { label: "Inicio", path: "/coordinacion" },
    { label: "Coordinación Administrativa", path: "/coordinacion" },
    { label: "Calificaciones", path: "/coordinacion/calificaciones" },
    ...(currentSubSection
      ? [
          {
            label:
              currentSubSection === "cno"
                ? "CNO"
                : currentSubSection === "carga masiva"
                ? "Carga Masiva"
                : "Carga Masiva",
            path: `/coordinacion/calificaciones/${currentSubSection}`,
          },
        ]
      : []),
  ];

  const handleNavigate = (path) => {
    if (path === "/coordinacion") {
      onBack();
    } else if (path === "/coordinacion/calificaciones") {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split("/").pop();
      if (["cno", "carga masiva"].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
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

  const Regresar = () => {
    setGrado(false);
    setEstudianteN([]);
  };

  const Vercalificacion = async (item) => {
    try {
      setGrado(true);
      const filtro = await Estudiantes_cursosBucar(item);
      const filtro2 = filtro.data.filter(
        (curs) => curs.estado_curso == "Activo"
      );
      setEstudianteN(filtro2);
    } catch (err) {
      console.log(err);
    }
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case "cno":
        return (
          <div>
            {!Grado && (
              <VerCursos
                cursosC={cursos}
                onClick={(item) => Vercalificacion(item)}
              />
            )}
            {Grado && (
              <div>
                <p className="RegresarG" onClick={Regresar}>
                  Regresar a los Grados
                </p>
                {VerCalificacion && (
                  <VerNotas
                    notas={listaNueva}
                    estudiante={nombre}
                    onClickSalir={() => setVerCalificacion(false)}
                  />
                )}
                <Table
                  id="EstudianteC"
                  busqueda={[
                    "numero_documento_estudiante",
                    "nombre_estudiante",
                  ]}
                  title="Notas Estudiantes"
                  description="Aqui se podran visualizar las notas de los estudiantes"
                  columns={[
                    {
                      key: "numero_documento_estudiante",
                      label: "DOCUMENTO",
                    },
                    { key: "nombre_estudiante", label: "NOMBRE" },
                  ]}
                  data={EstudianteN}
                  searchPlaceholder="Buscar por documento..."
                  actions={[
                    {
                      label: "Ver Notas",
                      onClick: (item) => {
                        Notas(item);
                      },
                    },
                  ]}
                  type_search="number"
                />
              </div>
            )}
          </div>
        );
      case "carga-masiva":
        return (
          <div>
            <div>
              <h2>Carga Masiva de Calificaciones</h2>
              <p>Carga masiva mediante archivos Excel o CSV</p>
            </div>
            <div>
              <p>Funcionalidad de carga masiva en desarrollo...</p>
            </div>
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
