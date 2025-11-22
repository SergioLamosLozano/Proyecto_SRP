import React, { useEffect, useState } from "react";
import "../styles/GestionAcademica.css";
import Breadcrumbs from "./Breadcrumbs";
import Table from "./Table";
import {
  Año_electivo,
  CrearMateriaAsignada,
  Cursos,
  EditarCurso,
  EditarMateria,
  EditarMateriaAsignada,
  EliminarCurso,
  EliminarMateria,
  EliminarMateriaAsignada,
  Materias,
  MateriasAsignadas,
  NuevaMateria,
  NuevoCurso,
} from "../api/cursos";
import Modal from "./modal";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
          text: "Curso creado con exito",
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
          text: "Materia creada con exito",
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
          text: "Asignadas creada con exito",
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
    ObtenerIdUsuario();
  }, []);

  const [materias, setMaterias] = useState([]);

  const [materiaProfesores, setMateriaProfesores] = useState([]);

  const [estudianteCursos, setEstudianteCursos] = useState([
    {
      id_clases_estudiantes: 1,
      numero_documento_estudiante: "1234567890",
      nombre_estudiante: "Juan Carlos Pérez González",
      id_curso: 1,
      curso: "Sexto A",
      año_electivo: "2024",
      fecha_asignacion: "2024-02-01",
      estado: "Activo",
    },
    {
      id_clases_estudiantes: 2,
      numero_documento_estudiante: "0987654321",
      nombre_estudiante: "Ana María López Martínez",
      id_curso: 1,
      curso: "Sexto A",
      año_electivo: "2024",
      fecha_asignacion: "2024-02-01",
      estado: "Activo",
    },
    {
      id_clases_estudiantes: 3,
      numero_documento_estudiante: "1122334455",
      nombre_estudiante: "Carlos Andrés Rodríguez Silva",
      id_curso: 2,
      curso: "Séptimo B",
      año_electivo: "2024",
      fecha_asignacion: "2024-02-01",
      estado: "Activo",
    },
  ]);

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
        title: "¿Eliminar curso?",
        text: "Esta acción eliminará el curso permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EliminarCurso(item.id_curso);
          Swal.fire({
            icon: "success",
            text: "Curso eliminado con exito",
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
          text: "Curso modificado con exito",
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
        title: "¿Eliminar Asignacion?",
        text: "Esta acción eliminará la asignacion permanentemente.",
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
            text: "Asignacion eliminado con exito",
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
          text: "Asignacion modificado con exito",
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
  };

  const Eliminarmateria = async (item) => {
    if (item.id_materia) {
      const result = await Swal.fire({
        title: "¿Eliminar curso?",
        text: "Esta acción eliminará el curso permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c41e3a",
        cancelButtonColor: "#c41e3a",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        try {
          const respons = await EliminarMateria(item.id_materia);
          Swal.fire({
            icon: "success",
            text: "Materia eliminado con exito",
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
          text: "Materia modificado con exito",
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
                      { value: "InActivo", title: "InActivo" },
                    ],
                  },
                ]}
              />
            )}

            <Table
              id="Cursos"
              data={cursos}
              busqueda={["fecha_inicio", "fecha_fin", "nombre"]}
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
                {
                  label: "Eliminar 🗑️",
                  onClick: (item) => Eliminarcurso(item),
                },
              ]}
              onAction={(action, item) => {
                console.log(`Acción ${action} en curso:`, item);
              }}
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
                      { value: "InActivo", title: "InActivo" },
                    ],
                  },
                ]}
              />
            )}

            <Table
              id="Materias"
              data={materias}
              busqueda={["nombre_area_conocimiento", "nombre", "estado"]}
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
                {
                  label: "Eliminar 🗑️",
                  icon: "🗑️",
                  variant: "delete",
                  onClick: (item) => Eliminarmateria(item),
                },
              ]}
              onAction={(action, item) => {
                console.log(`Acción ${action} en materia:`, item);
              }}
              searchable={true}
              searchPlaceholder="Buscar materias..."
            />
          </div>
        );
      case "asignaciones":
        return (
          <div className="dashboard-section">
            <div
              className="gestion-academica-header"
              onClick={() => {
                console.log(
                  numeroDocumetoP,
                  materiasAsiganad,
                  cursosAsiganados,
                  añoAsiganado,
                  id
                );
              }}
            >
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
                    titulo={editar ? "Editar Materia" : "Crear Materia"}
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
                        ? {
                            nombre: "Editar",
                            click: () => EditarDatosMateria(),
                          }
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
                          {
                            value: "5",
                            title: "Ciencias Sociales y Humanidades",
                          },
                        ],
                      },
                      {
                        nombre: "Estado",
                        value: estadoMateria,
                        onChange: (e) => setEstadoMateria(e.target.value),
                        opciones: [
                          { value: "Activo", title: "Activo" },
                          { value: "InActivo", title: "InActivo" },
                        ],
                      },
                    ]}
                  />
                )}

            {activeAssignmentTab === "materias-profesores" ? (
              <Table
                data={materiaProfesores}
                columns={[
                  { key: "id_materia_profesores", label: "ID", sortable: true },
                  { key: "materia_nombre", label: "Materia", sortable: true },
                  {
                    key: "profesor_nombre",
                    label: "Profesor",
                    sortable: true,
                  },
                  { key: "curso_nombre", label: "Curso", sortable: true },
                  { key: "año_electivo_valor", label: "Año", sortable: true },
                  {
                    key: "usuario_creacion_nombre",
                    label: "Creado por",
                    sortable: true,
                  },
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
                onAction={(action, item) => {
                  console.log(
                    `Acción ${action} en asignación materia-profesor:`,
                    item
                  );
                }}
                searchable={true}
                searchPlaceholder="Buscar asignaciones materia-profesor..."
              />
            ) : (
              <Table
                data={estudianteCursos}
                columns={[
                  { key: "id_clases_estudiantes", label: "ID", sortable: true },
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
                  { key: "curso", label: "Curso", sortable: true },
                  {
                    key: "año_electivo",
                    label: "Año Electivo",
                    sortable: true,
                  },
                  {
                    key: "fecha_asignacion",
                    label: "Fecha Asignación",
                    sortable: true,
                  },
                  { key: "estado", label: "Estado", sortable: true },
                ]}
                actions={[
                  {
                    label: "Editar ✏️",
                    icon: "✏️",
                    variant: "edit",
                  },
                  { label: "Eliminar 🗑️", icon: "🗑️", variant: "delete" },
                ]}
                onAction={(action, item) => {
                  console.log(
                    `Acción ${action} en asignación estudiante-curso:`,
                    item
                  );
                }}
                searchable={true}
                searchPlaceholder="Buscar asignaciones estudiante-curso..."
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
