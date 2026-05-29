import React, { useEffect, useState } from "react";
import "../styles/GestionAcademica.css";
import Breadcrumbs from "./Breadcrumbs";
import Table from "./Table";
import {
  Año_electivo,
  CrearEstudiantesCursos,
  CrearMateriaAsignada,
  Cursos,
  EditarCurso,
  EditarEstudiantesCursos,
  EditarMateria,
  EditarMateriaAsignada,
  EliminarEstudiantes_cursos,
  EliminarMateria,
  EliminarMateriaAsignada,
  Estudiantes_cursos,
  Materias,
  MateriasAsignadas,
  NuevaMateria,
  NuevoCurso,
} from "../api/cursos";
import Modal from "./modal";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { EstudiantesGET } from "../api/usuarios";

const GestionAcademica = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [activeAssignmentTab, setActiveAssignmentTab] = useState(
    "materias-profesores"
  );
  const [Año, setAño] = useState([]);
  //uses states de cursos
  const [modal, setmodal] = useState(false);
  const [nombrecurso, setnombrecurso] = useState("");
  const [fkIdFecha, setfkIdFecha] = useState(2025);
  const [estado, setEstado] = useState("Activo");
  const [id, setid] = useState(null);
  // lo que abre el modal
  const [editar, setEditar] = useState(false);
  // useStates de materia
  const [nombremateria, setnombremateria] = useState("");
  const [porcentajePonderado, setPorsentajePonderado] = useState(0);
  const [areasDeConocimiento, setAreasDeConocimiento] = useState(0);
  const [estadoMateria, setEstadoMateria] = useState("Activo");
  // useStates de materiaAsinada
  const [numeroDocumetoP, setNumeroDocumetoP] = useState("");
  const [materiasAsiganad, setMateriasAsiganad] = useState(0);
  const [cursosAsiganados, setCursosAsiganados] = useState(0);
  const [añoAsiganado, setAñoAsiganado] = useState(2025);
  const [usuario_creacion, setUsuario_creacion] = useState("");
  // id usuario creacion
  const [usuarioid, setUsuarioid] = useState(0);
  const [cursosFiltrados, setCursosFiltrados] = useState(true);
  // Estudiante cursos
  const [estudianteCursos, setEstudianteCursos] = useState([]);
  const [estudiantesExistentes, setEstudiantesExistentes] = useState([]);
  const [numeroDocumentoEstudiantes, setNumeroDocumentoEstudiantes] =
    useState("");
  const [idCurso, setIdCurso] = useState(0);

  const fetchAñosElectivos = async () => {
    try {
      const respons = await Año_electivo();
      setAño(respons.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AgregarCurso = async () => {
    if (nombrecurso && fkIdFecha && estado) {
      try {
        const response = await NuevoCurso({
          nombre: nombrecurso,
          fk_id_año_electivo: fkIdFecha,
          estado: estado,
        });
        Swal.fire({
          icon: "success",
          text: "Curso creado con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchCursos();
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const AgregarMateria = async () => {
    if (
      nombremateria &&
      porcentajePonderado != 0 &&
      areasDeConocimiento &&
      estadoMateria
    ) {
      try {
        const response = await NuevaMateria({
          nombre: nombremateria,
          porcentaje_ponderado: porcentajePonderado,
          fk_Id_area_conocimiento: areasDeConocimiento,
          estado: estadoMateria,
        });
        Swal.fire({
          icon: "success",
          text: "Materia creada con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchMaterias();
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const AgregarMateriaAsignada = async () => {
    if (
      numeroDocumetoP &&
      materiasAsiganad != 0 &&
      cursosAsiganados != 0 &&
      añoAsiganado != 0 &&
      usuarioid
    ) {
      try {
        const response = await CrearMateriaAsignada({
          fk_numero_documento_profesor: numeroDocumetoP,
          fk_id_materia: materiasAsiganad,
          fk_id_curso: cursosAsiganados,
          fk_id_año_electivo: añoAsiganado,
          fk_usuario_creacion: usuarioid,
        });
        Swal.fire({
          icon: "success",
          text: "Asignación creada con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchMateriasAsignadas();
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const breadcrumbItems = [
    { label: "Inicio", path: "/coordinacion" },
    { label: "Coordinación Administrativa", path: "/coordinacion" },
    { label: "Gestión Académica", path: "/coordinacion/gestion-academica" },
    ...(currentSubSection
      ? [
          {
            label:
              currentSubSection === "cursos"
                ? "Gestión de Cursos"
                : currentSubSection === "materias"
                ? "Gestión de Materias"
                : currentSubSection === "asignaciones"
                ? "Gestión de Asignaciones"
                : currentSubSection,
            path: `/coordinacion/gestion-academica/${currentSubSection}`,
          },
        ]
      : []),
  ];

  const academicSections = [
    {
      id: "cursos",
      title: "Cursos",
      description:
        "Administra los cursos del programa académico, incluyendo horarios y asignaciones.",
      icon: "📖",
      buttonText: "Gestionar Cursos",
    },
    {
      id: "materias",
      title: "Materias",
      description:
        "Administra las materias del programa académico, incluyendo códigos, créditos y prerrequisitos.",
      icon: "📚",
      buttonText: "Gestionar Materias",
    },
    {
      id: "asignaciones",
      title: "Asignaciones",
      description:
        "Asigna materias a profesores y estudiantes a cursos específicos.",
      icon: "👥",
      buttonText: "Gestionar Asignaciones",
    },
  ];

  // Datos de ejemplo basados en la estructura de la BD
  const [cursos, setCursos] = useState([]);
  
  const filtroCursosActivos = cursos.filter(
    (item) => String(item.estado).toLowerCase() === "activo"
  );
  const filtroCursosInactivos = cursos.filter(
    (item) => String(item.estado).toLowerCase() === "inactivo"
  );

  const fetchCursos = async () => {
    try {
      const response = await Cursos();
      setCursos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await Materias();
      setMaterias(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMateriasAsignadas = async () => {
    try {
      const response = await MateriasAsignadas();
      setMateriaProfesores(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEstudianteCursos = async () => {
    try {
      const respons = await Estudiantes_cursos();
      const response2 = await EstudiantesGET();
      setEstudianteCursos(respons.data);
      setEstudiantesExistentes(response2.data);
    } catch (err) {
      console.log(err);
    }
  };

  const ObtenerIdUsuario = () => {
    const tokenid = sessionStorage.getItem("token");
    const decoded = jwtDecode(tokenid);

    setUsuarioid(decoded.user_id);
  };

  useEffect(() => {
    fetchCursos();
    fetchMaterias();
    fetchAñosElectivos();
    fetchMateriasAsignadas();
    fetchEstudianteCursos();
    ObtenerIdUsuario();
  }, []);

  const [materias, setMaterias] = useState([]);
  const [materiasFiltrados, setMateriasFiltrados] = useState(true);
  const filtroMateriasActivos = materias.filter(
    (item) => String(item.estado).toLowerCase() === "activo"
  );
  const filtroMateriasInactivos = materias.filter(
    (item) => String(item.estado).toLowerCase() === "inactivo"
  );

  const [materiaProfesores, setMateriaProfesores] = useState([]);

  const handleSectionClick = (sectionId) => {
    setCurrentSubSection(sectionId);
  };

  const handleNavigate = (path) => {
    if (path === "/coordinacion") {
      onBack();
    } else if (path === "/coordinacion/gestion-academica") {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split("/").pop();
      if (["cursos", "materias", "asignaciones"].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
    }
  };

  const Eliminarcurso = async (item) => {
    if (item.id_curso) {
      const result = await Swal.fire({
        title: "¿Desactivar curso?",
        text: "Esta acción cambiará el estado del curso a inactivo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, desactivar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EditarCurso(item.id_curso, {
            estado: "Inactivo",
          });
          Swal.fire({
            icon: "success",
            text: "Curso inactivado con éxito",
            timer: 3000,
          }).then(() => {
            fetchCursos();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const Activarcurso = async (item) => {
    if (item.id_curso) {
      const result = await Swal.fire({
        title: "¿Activar curso?",
        text: "Esta acción cambiará el estado del curso a activo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, activar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          await EditarCurso(item.id_curso, {
            estado: "Activo",
          });
          Swal.fire({
            icon: "success",
            text: "Curso activado con éxito",
            timer: 3000,
          }).then(() => {
            fetchCursos();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const EditarDatosModal = async () => {
    if (nombrecurso && fkIdFecha && estado) {
      try {
        const response = await EditarCurso(id, {
          nombre: nombrecurso,
          fk_id_año_electivo: fkIdFecha,
          estado: estado,
        });
        Swal.fire({
          icon: "success",
          text: "Curso modificado con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchCursos();
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: "Error en la respuesta del servidor, intente nuevamente",
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const EliminarMateriaA = async (item) => {
    if (item.id_materia_profesores) {
      const result = await Swal.fire({
        title: "¿Eliminar asignación?",
        text: "Esta acción eliminará la asignación permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EliminarMateriaAsignada(
            item.id_materia_profesores
          );
          Swal.fire({
            icon: "success",
            text: "Asignación eliminada con éxito",
            timer: 3000,
          }).then(() => {
            fetchMateriasAsignadas();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const EditarDatosModalMateriaAsignada = async () => {
    if (
      numeroDocumetoP &&
      materiasAsiganad != 0 &&
      cursosAsiganados != 0 &&
      añoAsiganado != 0 &&
      usuarioid
    ) {
      try {
        const response = await EditarMateriaAsignada(id, {
          fk_numero_documento_profesor: numeroDocumetoP,
          fk_id_materia: materiasAsiganad,
          fk_id_curso: cursosAsiganados,
          fk_id_año_electivo: añoAsiganado,
        });
        Swal.fire({
          icon: "success",
          text: "Asignación modificada con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchMateriasAsignadas();
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: "Error en la respuesta del servidor, intente nuevamente",
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const AbrirModalConDatos = (item) => {
    setEditar(true);
    setmodal(true);
    setnombrecurso(item.nombre || "");
    setfkIdFecha(item.fk_id_año_electivo || "");
    setEstado(item.estado || "");
    setid(item.id_curso);
  };

  const AbrirModalConDatosMateria = (item) => {
    setEditar(true);
    setmodal(true);
    setnombremateria(item.nombre || "");
    setPorsentajePonderado(item.porcentaje_ponderado || 0);
    setAreasDeConocimiento(item.fk_Id_area_conocimiento || 0);
    setEstadoMateria(item.estado || "");
    setid(item.id_materia);
  };

  const AbrirModalConDatosMateriaAsignada = (item) => {
    setEditar(true);
    setmodal(true);
    setNumeroDocumetoP(item.fk_numero_documento_profesor || "");
    setMateriasAsiganad(item.fk_id_materia || 0);
    setCursosAsiganados(item.fk_id_curso || 0);
    setAñoAsiganado(item.fk_id_año_electivo || "");
    setUsuario_creacion(item.usuario_creacion_nombre || "");
    setid(item.id_materia_profesores);
  };

  const cerrarModal = () => {
    setEditar(false);
    //cursosss
    setmodal(false);
    setnombrecurso("");
    setfkIdFecha(2025);
    setEstado("Activo");
    setid(null);
    //materiasss
    setnombremateria("");
    setPorsentajePonderado(0);
    setAreasDeConocimiento(0);
    setEstadoMateria("Activo");
    //materias asignadas
    setNumeroDocumetoP("");
    setMateriasAsiganad(0);
    setCursosAsiganados(0);
    setAñoAsiganado("");
    setUsuario_creacion("");
    //estudiantes cursos
    setNumeroDocumentoEstudiantes("");
    setIdCurso(0);
  };

  const Eliminarmateria = async (item) => {
    if (item.id_materia) {
      const result = await Swal.fire({
        title: "¿Desactivar materia?",
        text: "Esta acción cambiará el estado de la materia a inactivo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, desactivar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EditarMateria(item.id_materia, {
            estado: "Inactivo",
          });
          Swal.fire({
            icon: "success",
            text: "Materia inactivada con éxito",
            timer: 3000,
          }).then(() => {
            fetchMaterias();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const Activarmateria = async (item) => {
    if (item.id_materia) {
      const result = await Swal.fire({
        title: "¿Activar materia?",
        text: "Esta acción cambiará el estado de la materia a activo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, activar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          await EditarMateria(item.id_materia, {
            estado: "Activo",
          });
          Swal.fire({
            icon: "success",
            text: "Materia activada con éxito",
            timer: 3000,
          }).then(() => {
            fetchMaterias();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const EditarDatosMateria = async () => {
    if (
      nombremateria &&
      porcentajePonderado != 0 &&
      areasDeConocimiento != 0 &&
      estadoMateria
    ) {
      try {
        const response = await EditarMateria(id, {
          nombre: nombremateria,
          porcentaje_ponderado: porcentajePonderado,
          fk_Id_area_conocimiento: areasDeConocimiento,
          estado: estadoMateria,
        });
        Swal.fire({
          icon: "success",
          text: "Materia modificada con éxito",
          timer: 3000,
        }).then(() => {
          cerrarModal();
          fetchMaterias();
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: "Error en la respuesta del servidor, intente nuevamente",
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const AbrirModalConDatosEstudianteCurso = (item) => {
    setNumeroDocumentoEstudiantes(item.numero_documento_estudiante);
    setIdCurso(item.id_curso);
    setid(item.id_estudiantes_cursos);
    setEditar(true);
    setmodal(true);
  };

  const EditarEstudianteCurso = async () => {
    try {
      if (numeroDocumentoEstudiantes && idCurso != 0) {
        const existencia = estudiantesExistentes.some(
          (est) => est.numero_documento_estudiante == numeroDocumentoEstudiantes
        );
        if (existencia) {
          const respons = await EditarEstudiantesCursos(id, {
            numero_documento_estudiante: numeroDocumentoEstudiantes,
            id_curso: idCurso,
          })
            .then(() => {
              Swal.fire({
                icon: "success",
                text: "Se editó la asignación del estudiante y la materia de forma exitosa",
                timer: 3000,
              });
              fetchEstudianteCursos();
              cerrarModal();
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                text: "Error con el servidor",
                timer: 3000,
              });
            });
        } else {
          Swal.fire({
            icon: "error",
            text: "No existe el estudiante",
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "info",
          text: "Llene los campos",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AgregarEstudianteCurso = async () => {
    try {
      if (numeroDocumentoEstudiantes && idCurso != 0) {
        const existencia = estudiantesExistentes.some(
          (est) => est.numero_documento_estudiante == numeroDocumentoEstudiantes
        );
        if (existencia) {
          const response = await CrearEstudiantesCursos({
            numero_documento_estudiante: numeroDocumentoEstudiantes,
            id_curso: idCurso,
          })
            .then(() => {
              Swal.fire({
                icon: "success",
                text: "Se asignó el estudiante a la materia de forma exitosa",
                timer: 3000,
              });
              fetchEstudianteCursos();
              cerrarModal();
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                text: "Error con el servidor",
                timer: 3000,
              });
            });
        } else {
          Swal.fire({
            icon: "error",
            text: "No existe el estudiante",
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "info",
          text: "Llene los campos",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const EliminarEstudianteCurso = async (item) => {
    if (item.id_estudiantes_cursos) {
      const result = await Swal.fire({
        title: "¿Eliminar asignación?",
        text: "Esta acción eliminará la asignación de estudiante y curso permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EliminarEstudiantes_cursos(
            item.id_estudiantes_cursos
          );
          Swal.fire({
            icon: "success",
            text: "Asignación de estudiante y curso eliminada con éxito",
            timer: 3000,
          }).then(() => {
            fetchEstudianteCursos();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Error en la respuesta del servidor, intente nuevamente",
            timer: 3000,
          });
        }
      }
    }
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case "cursos":
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Cursos</h2>
              <p className="gestion-academica-subtitle">
                Administra los cursos del programa académico
              </p>
            </div>

            <div
              className="table-actions"
              onClick={() => {
                setmodal(true);
              }}
            >
              <button className="btn-primary">
                <span className="icon">➕</span>
                Agregar Curso
              </button>
            </div>

            {modal && (
              <Modal
                titulo={editar ? "Editar Curso" : "Crear Curso"}
                SalirM={cerrarModal}
                inputs={[
                  {
                    nombre: "Nombre del curso",
                    type: "text",
                    value: nombrecurso,
                    onChange: (e) => setnombrecurso(e.target.value),
                  },
                  {
                    nombre: "Año Electivo",
                    type: "number",
                    value: fkIdFecha,
                    onChange: (e) => setfkIdFecha(e.target.value),
                    placeholder: "año del curso",
                  },
                ]}
                acciones={[
                  editar
                    ? { nombre: "Editar", click: () => EditarDatosModal() }
                    : { nombre: "Guardar", click: () => AgregarCurso() },
                  { nombre: "cerrar", click: () => cerrarModal() },
                ]}
                select={[
                  {
                    nombre: "Estado",
                    value: estado,
                    onChange: (e) => setEstado(e.target.value),
                    opciones: [
                      { value: "Activo", title: "Activo" },
                      { value: "Inactivo", title: "Inactivo" },
                    ],
                  },
                ]}
              />
            )}

            <Table
              id="Cursos"
              data={cursosFiltrados ? filtroCursosActivos : filtroCursosInactivos}
              busqueda={["fecha_inicio", "fecha_fin", "nombre"]}
              check={[
                {
                  title: "Mostrar solo activos",
                  check: cursosFiltrados,
                  onChange: (e) => setCursosFiltrados(e.target.checked),
                },
              ]}
              columns={[
                { key: "id_curso", label: "ID", sortable: true },
                {
                  key: "nombre",
                  label: "Nombre del Curso",
                  sortable: true,
                },
                {
                  key: "fk_id_año_electivo",
                  label: "Año Electivo",
                  sortable: true,
                },
                {
                  key: "fecha_inicio",
                  label: "Fecha Inicio",
                  sortable: true,
                },
                { key: "fecha_fin", label: "Fecha Fin", sortable: true },
                { key: "estado", label: "Estado", sortable: true },
              ]}
              actions={[
                {
                  label: "Editar ✏️",
                  icon: "✏️",
                  variant: "edit",
                  onClick: (item) => AbrirModalConDatos(item),
                },
                cursosFiltrados
                  ? {
                      label: "Desactivar 🗑️",
                      onClick: (item) => Eliminarcurso(item),
                    }
                  : {
                      label: "Activar ✅",
                      onClick: (item) => Activarcurso(item),
                    },
              ]}
              searchable={true}
              searchPlaceholder="Buscar cursos..."
            />
          </div>
        );
      case "materias":
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Materias</h2>
              <p className="gestion-academica-subtitle">
                Administra las materias del programa académico
              </p>
            </div>

            <div
              className="table-actions"
              onClick={() => {
                setmodal(true);
              }}
            >
              <button className="btn-primary">
                <span className="icon">➕</span>
                Agregar Materia
              </button>
            </div>

            {modal && (
              <Modal
                titulo={editar ? "Editar Materia" : "Crear Materia"}
                SalirM={cerrarModal}
                inputs={[
                  {
                    nombre: "Nombre de la materia",
                    type: "text",
                    placeholder: "nombre",
                    value: nombremateria,
                    onChange: (e) => setnombremateria(e.target.value),
                  },
                  {
                    nombre: "porcentaje ponderado",
                    type: "number",
                    step: "0.01",
                    value: porcentajePonderado,
                    onChange: (e) => setPorsentajePonderado(e.target.value),
                    placeholder: "Porcetaje de la materia",
                  },
                ]}
                acciones={[
                  editar
                    ? { nombre: "Editar", click: () => EditarDatosMateria() }
                    : { nombre: "Guardar", click: () => AgregarMateria() },
                  { nombre: "cerrar", click: () => cerrarModal() },
                ]}
                select={[
                  {
                    nombre: "Areas de conocimineto",
                    value: areasDeConocimiento,
                    onChange: (e) => setAreasDeConocimiento(e.target.value),
                    opciones: [
                      { value: "1", title: "Biología" },
                      { value: "2", title: "Lenguaje y Comunicación" },
                      {
                        value: "3",
                        title: "Matemáticas y Razonamiento Lógico",
                      },
                      { value: "4", title: "Educación Física y Deportes" },
                      { value: "5", title: "Ciencias Sociales y Humanidades" },
                    ],
                  },
                  {
                    nombre: "Estado",
                    value: estadoMateria,
                    onChange: (e) => setEstadoMateria(e.target.value),
                    opciones: [
                      { value: "Activo", title: "Activo" },
                      { value: "Inactivo", title: "Inactivo" },
                    ],
                  },
                ]}
              />
            )}

            <Table
              id="Materias"
              data={materiasFiltrados ? filtroMateriasActivos : filtroMateriasInactivos}
              busqueda={["nombre_area_conocimiento", "nombre", "estado"]}
              check={[
                {
                  title: "Mostrar solo activos",
                  check: materiasFiltrados,
                  onChange: (e) => setMateriasFiltrados(e.target.checked),
                },
              ]}
              columns={[
                { key: "id_materia", label: "ID", sortable: true },
                {
                  key: "nombre",
                  label: "Nombre de la Materia",
                  sortable: true,
                },
                {
                  key: "nombre_area_conocimiento",
                  label: "Área de Conocimiento",
                  sortable: true,
                },
                {
                  key: "porcentaje_ponderado",
                  label: "Porcentaje (%)",
                  sortable: true,
                },
                { key: "estado", label: "Estado", sortable: true },
              ]}
              actions={[
                {
                  label: "Editar ✏️",
                  icon: "✏️",
                  variant: "edit",
                  onClick: (item) => AbrirModalConDatosMateria(item),
                },
                materiasFiltrados
                  ? {
                      label: "Desactivar 🗑️",
                      icon: "🗑️",
                      variant: "delete",
                      onClick: (item) => Eliminarmateria(item),
                    }
                  : {
                      label: "Activar ✅",
                      onClick: (item) => Activarmateria(item),
                    },
              ]}
              searchable={true}
              searchPlaceholder="Buscar materias..."
            />
          </div>
        );
      case "asignaciones":
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">
                Gestión de Asignaciones
              </h2>
              <p className="gestion-academica-subtitle">
                Asigna materias a profesores y estudiantes a cursos
              </p>
            </div>

            <div className="asignaciones-tabs">
              <button
                className={`tab-button ${
                  activeAssignmentTab === "materias-profesores" ? "active" : ""
                }`}
                onClick={() => setActiveAssignmentTab("materias-profesores")}
              >
                Materias - Profesores
              </button>
              <button
                className={`tab-button ${
                  activeAssignmentTab === "estudiantes-cursos" ? "active" : ""
                }`}
                onClick={() => setActiveAssignmentTab("estudiantes-cursos")}
              >
                Estudiantes - Cursos
              </button>
            </div>

            <div
              className="table-actions"
              onClick={() => {
                setmodal(true);
              }}
            >
              <button className="btn-primary">
                <span className="icon">➕</span>
                {activeAssignmentTab === "materias-profesores"
                  ? "Nueva Asignación Materia-Profesor"
                  : "Nueva Asignación Estudiante-Curso"}
              </button>
            </div>

            {activeAssignmentTab === "materias-profesores"
              ? modal && (
                  <Modal
                    titulo={editar ? "Editar Asignacion" : "Asignar Materia"}
                    SalirM={cerrarModal}
                    inputs={[
                      {
                        nombre: "Numero de documento prof.",
                        type: "number",
                        placeholder: "numero documento",
                        value: numeroDocumetoP,
                        onChange: (e) => setNumeroDocumetoP(e.target.value),
                      },
                      editar && {
                        nombre: "Creado por:",
                        type: "text",
                        disabled: true,
                        value: usuario_creacion,
                        onChange: (e) => setUsuario_creacion(e.target.value),
                      },
                    ].filter(Boolean)}
                    acciones={[
                      editar
                        ? {
                            nombre: "Editar",
                            click: () => EditarDatosModalMateriaAsignada(),
                          }
                        : {
                            nombre: "Guardar",
                            click: () => AgregarMateriaAsignada(),
                          },
                      { nombre: "cerrar", click: () => cerrarModal() },
                    ]}
                    select={[
                      {
                        nombre: "Materias",
                        value: materiasAsiganad,
                        onChange: (e) => setMateriasAsiganad(e.target.value),
                        opciones: materias.map((item) => ({
                          value: item.id_materia,
                          title: item.nombre,
                        })),
                      },
                      {
                        nombre: "Cursos",
                        value: cursosAsiganados,
                        onChange: (e) => setCursosAsiganados(e.target.value),
                        opciones: cursos.map((item) => ({
                          value: item.id_curso,
                          title: item.nombre,
                        })),
                      },
                      {
                        nombre: "Años Electivos",
                        value: añoAsiganado,
                        onChange: (e) => setAñoAsiganado(e.target.value),
                        opciones: Año.map((item) => ({
                          value: item.id_año_electivo,
                          title: item.id_año_electivo,
                        })),
                      },
                    ]}
                  />
                )
              : modal && (
                  <Modal
                    titulo={
                      editar
                        ? "Editar Curso Estudiante"
                        : "Crear Curso Estudiante"
                    }
                    SalirM={cerrarModal}
                    inputs={[
                      {
                        nombre: "Numero de documento Estudiante.",
                        type: "number",
                        placeholder: "numero documento",
                        value: numeroDocumentoEstudiantes,
                        onChange: (e) =>
                          setNumeroDocumentoEstudiantes(e.target.value),
                      },
                    ]}
                    acciones={[
                      editar
                        ? {
                            nombre: "Editar",
                            click: () => EditarEstudianteCurso(),
                          }
                        : {
                            nombre: "Guardar",
                            click: () => AgregarEstudianteCurso(),
                          },
                      { nombre: "cerrar", click: () => cerrarModal() },
                    ]}
                    select={[
                      {
                        nombre: "cursos",
                        value: idCurso,
                        onChange: (e) => setIdCurso(e.target.value),
                        opciones: cursos.map((item, index) => ({
                          value: item.id_curso,
                          title: item.nombre,
                        })),
                      },
                    ]}
                  />
                )}

            {activeAssignmentTab === "materias-profesores" ? (
              <Table
                id="MateriaA"
                busqueda={["materia", "profe_nombre", "curso"]}
                data={materiaProfesores}
                columns={[
                  { key: "id_materia_profesores", label: "ID", sortable: true },
                  { key: "materia", label: "Materia", sortable: true },
                  {
                    key: "profe_nombre",
                    label: "Profesor",
                    sortable: true,
                  },
                  { key: "curso", label: "Curso", sortable: true },
                  { key: "fk_id_año_electivo", label: "Año", sortable: true },
                ]}
                actions={[
                  {
                    label: "Editar ✏️",
                    icon: "✏️",
                    variant: "edit",
                    onClick: (item) => AbrirModalConDatosMateriaAsignada(item),
                  },
                  {
                    label: "Eliminar 🗑️",
                    icon: "🗑️",
                    variant: "delete",
                    onClick: (item) => EliminarMateriaA(item),
                  },
                ]}
                searchable={true}
                searchPlaceholder="Buscar asignaciones materia-profesor..."
              />
            ) : (
              <Table
                id="EstudianteC"
                data={estudianteCursos.map((item) => ({
                  ...item,
                  numero_documento_estudiante: item.estudiante?.numero_documento || "",
                  nombre_estudiante: item.estudiante?.nombre || "",
                  estado_curso: item.estado || "",
                }))}
                busqueda={[
                  "numero_documento_estudiante",
                  "nombre_estudiante",
                  "nombre_curso",
                ]}
                columns={[
                  { key: "id_estudiantes_cursos", label: "ID", sortable: true },
                  {
                    key: "numero_documento_estudiante",
                    label: "Doc. Estudiante",
                    sortable: true,
                  },
                  {
                    key: "nombre_estudiante",
                    label: "Estudiante",
                    sortable: true,
                  },
                  { key: "nombre_curso", label: "Curso", sortable: true },
                  {
                    key: "fecha_asignacion",
                    label: "Fecha Asignación",
                    sortable: true,
                  },
                  {
                    key: "estado_curso",
                    label: "Estado",
                    sortable: true,
                  },
                ]}
                actions={[
                  {
                    label: "Editar ✏️",
                    icon: "✏️",
                    variant: "edit",
                    onClick: (item) => AbrirModalConDatosEstudianteCurso(item),
                  },
                  {
                    label: "Eliminar 🗑️",
                    icon: "🗑️",
                    variant: "delete",
                    onClick: (item) => EliminarEstudianteCurso(item),
                  },
                ]}
                searchable={true}
                searchPlaceholder="Buscar por Num. Doc."
                type_search="number"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />

      <div className="gestion-academica-content">
        {currentSubSection ? (
          renderSubSection()
        ) : (
          <>
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Gestión Académica</h1>
              <p className="gestion-academica-subtitle">
                Administra cursos, materias, asignaciones de profesores y la
                estructura académica general
              </p>
            </div>

            <div className="gestion-academica-grid">
              {academicSections.map((section) => (
                <div
                  key={section.id}
                  className="gestion-academica-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="gestion-academica-card-header">
                    <span className="gestion-academica-icon">
                      {section.icon}
                    </span>
                    <h3 className="gestion-academica-card-title">
                      {section.title}
                    </h3>
                  </div>

                  <p className="gestion-academica-description">
                    {section.description}
                  </p>

                  <button className="gestion-academica-button">
                    {section.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GestionAcademica;
