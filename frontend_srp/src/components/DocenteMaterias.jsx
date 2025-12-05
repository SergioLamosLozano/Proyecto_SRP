import React, { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import "../styles/Dashboard.css";
import "../styles/CoordinacionPage.css";
import { jwtDecode } from "jwt-decode";
import { BuscarMateriasAsignadas } from "../api/cursos";
import { EstudiantesGET } from "../api/usuarios";
import Table from "./Table";

function DocentesMaterias({ onBack }) {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [currentSubSection2, setCurrentSubSection2] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [listaPorCurso, setListaPorCurso] = useState([]);
  const [materias, setMaterias] = useState([]);

  const listaDeColores = [
    "rgba(156, 1, 1, 0.9)", // un poco más fuerte
    "rgba(156, 1, 1, 0.7)", // un poco más suave
    "rgba(176, 10, 10, 0.85)", // tono ligeramente más claro
    "rgba(136, 0, 0, 0.85)", // tono ligeramente más oscuro
    "rgba(180, 20, 20, 0.8)", // más brillante
    "rgba(120, 0, 0, 0.8)", // más oscuro
    "rgba(200, 40, 40, 0.75)", // menos saturado y más claro
    "rgba(100, 0, 0, 0.9)", // más profundo
    "rgba(160, 20, 20, 0.6)", // rojo suave
    "rgba(140, 0, 0, 0.95)", // casi sólido
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("error al obtener el token");
      return;
    } else {
      const decoded = jwtDecode(token);
      const Cedula = decoded.username;
      cargarMaterias(Cedula);
    }
  }, []);

  const cargarMaterias = async (cedula) => {
    if (cedula) {
      try {
        const response = await BuscarMateriasAsignadas(cedula);
        const response2 = await EstudiantesGET();
        const materiasAgrupadas = response.data.reduce((acc, item) => {
          const existente = acc.find(
            (mat) => mat.materia_nombre === item.materia_nombre
          );

          if (existente) {
            if (!existente.cursos.includes(item.curso_nombre)) {
              existente.cursos.push(item.curso_nombre);
            }
          } else {
            acc.push({
              materia_nombre: item.materia_nombre,
              profesor_nombre: item.profesor_nombre,
              cursos: [item.curso_nombre],
              año_electivo_valor: item.año_electivo_valor,
            });
          }

          return acc;
        }, []);
        setMaterias(materiasAgrupadas);
        setEstudiantes(response2.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const FiltrarEstudiantes = (grado) => {
    if (!grado) return null;
    const estudiantesFiltrados = estudiantes.filter(
      (est) =>
        est.estado === "Activo" &&
        est.cursos?.some(
          (curso) =>
            curso.curso_nombre == grado && curso.estado_curso == "Activo"
        )
    );
    setListaPorCurso(estudiantesFiltrados);
    console.log(estudiantesFiltrados);
  };

  // MIGAS REALES
  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Pagina Docentes", path: "/docentes" },
    { label: "materias Asignadas", path: "/docentes/materias" },
    ...(currentSubSection
      ? [
          {
            label: currentSubSection,
            path: `/docentes/materias/${currentSubSection}`,
          },
        ]
      : []),
    ...(currentSubSection2
      ? [
          {
            label: currentSubSection2,
            path: `/docentes/materias/${currentSubSection2}`,
          },
        ]
      : []),
  ];

  const handleNavigate = (path) => {
    if (path === "/docentes") {
      onBack();
    } else if (path === "/docentes/materias") {
      setCurrentSubSection(null);
      setCurrentSubSection2(null);
    } else if (path === `/docentes/materias/${currentSubSection}`) {
      setCurrentSubSection2(null);
    } else {
      const subsection = path.split("/").pop();
      if (["materias", "actividades"].includes(subsection)) {
        setCurrentSubSection(subsection);
        setCurrentSubSection2(subsection);
      }
    }
  };

  const render = () => {
    if (currentSubSection2) {
      return (
        <Table
          id="EstudiantesC"
          busqueda={["numero_documento_estudiante"]}
          title="Gestión de Estudiantes"
          description="Registro manual de estudiantes."
          columns={[
            { key: "nombre_completo", label: "NOMBRE" },
            {
              key: "numero_documento_estudiante",
              label: "IDENTIFICACIÓN",
            },
            {
              key: "curso",
              label: "CURSO",
              render: (row) => row.cursos?.[0]?.curso_nombre ?? "Sin curso",
            },
            { key: "estado", label: "ESTADO" },
          ]}
          data={listaPorCurso}
          searchPlaceholder="Buscar por Documento..."
        />
      );
    }
  };

  const handleSectionClick = () => {
    switch (currentSubSection) {
      case "Matemáticas":
        return currentSubSection2 ? (
          render()
        ) : (
          <div className="contenedoMatematicas">
            <h2 className="TituloMateriasAsignadas">{currentSubSection}</h2>
            <div className="CursosMaterias">
              {materias &&
                materias
                  .filter((mat) => mat.materia_nombre === "Matemáticas")
                  .flatMap((mat) => mat.cursos)
                  .map((curso, index) => (
                    <div
                      key={index}
                      className="tarjeta-curso"
                      onClick={() => {
                        setCurrentSubSection2(curso);
                        FiltrarEstudiantes(curso);
                      }}
                    >
                      <label>&gt;</label>
                      <p>{curso}</p>
                    </div>
                  ))}
            </div>
          </div>
        );
      case "ingles":
        return currentSubSection2 ? (
          render()
        ) : (
          <div className="contenedoMatematicas">
            <h2 className="TituloMateriasAsignadas">{currentSubSection}</h2>
            <div className="CursosMaterias">
              {materias &&
                materias
                  .filter((mat) => mat.materia_nombre === "ingles")
                  .flatMap((mat) => mat.cursos)
                  .map((curso, index) => (
                    <div
                      key={index}
                      className="tarjeta-curso"
                      onClick={() => {
                        setCurrentSubSection2(curso);
                        FiltrarEstudiantes(curso);
                      }}
                    >
                      <label>&gt;</label>
                      <p>{curso}</p>
                    </div>
                  ))}
            </div>
          </div>
        );
      case "Ed Fisica":
        return currentSubSection2 ? (
          render()
        ) : (
          <div className="contenedoMatematicas">
            <h2 className="TituloMateriasAsignadas">{currentSubSection}</h2>
            <div className="CursosMaterias">
              {materias &&
                materias
                  .filter((mat) => mat.materia_nombre === "Ed Fisica")
                  .flatMap((mat) => mat.cursos)
                  .map((curso, index) => (
                    <div
                      key={index}
                      className="tarjeta-curso"
                      onClick={() => {
                        setCurrentSubSection2(curso);
                        FiltrarEstudiantes(curso);
                      }}
                    >
                      <label>&gt;</label>
                      <p>{curso}</p>
                    </div>
                  ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="page-wrapper">
      {/* ← AQUI SI RENDERIZA CORRECTAMENTE */}
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />

      <div className="Container-Principal-Docentes">
        {currentSubSection ? (
          handleSectionClick()
        ) : (
          <>
            <h1 className="TituloMateriasAsignadas">Materias Asignadas</h1>

            <div className="navigation-cardsD">
              {materias.length > 0 ? (
                materias.map((item, index) => {
                  const ColorAlAzar =
                    listaDeColores[
                      Math.floor(Math.random() * listaDeColores.length)
                    ];
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentSubSection(item.materia_nombre);
                      }}
                      className="MateriasAsiganadaD"
                      style={{ backgroundColor: `${ColorAlAzar}` }}
                    >
                      <p>{item.materia_nombre}</p>
                    </div>
                  );
                })
              ) : (
                <h1 className="TituloMateriasAsignadas">
                  No se encontarron materias, asiganadas
                </h1>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DocentesMaterias;
