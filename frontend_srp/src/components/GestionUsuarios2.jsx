import React, { useEffect, useState } from "react";
import Table from "./Table"; // Ajusta según tu proyecto
import Breadcrumbs from "./Breadcrumbs"; // Ajusta según tu proyecto
import {
  AsignacionDeAcudienteAEstudiante,
  Ciudad,
  CrearEstudiante,
  CrearPadres,
  CrearProfesores,
  CrearUsuarioPadre,
  EditarEstudiante,
  EditarPadres,
  EditarProfesores,
  EliminarPadres,
  EstudiantesGET,
  PadresGET,
  ProfesorGET,
  Sisben,
} from "../api/usuarios";
import Modal from "./modal";
import Swal from "sweetalert2";
import VerMaterias from "./VerMateriasP";
import "../styles/GestionUsuarios.css";
import CargaMasiva from "./CargaMasiva";

const GestionUsuarios = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  //modal
  const [modal, setModal] = useState(false);
  const [editar, setEditar] = useState(false);
  //todos lo datos necesarios
  const [ciudadesE, setCiudadesE] = useState([]);
  const [sisbenE, setSisbenE] = useState([]);
  // estudiante
  const [Estudiantes, setEstudiantes] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState(0);
  const [documento, setDocumento] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [estadoE, setEstadoE] = useState(1);
  const [ciudad, setCiudad] = useState(0);
  const [genero, setGenero] = useState(0);
  const [religion, setReligion] = useState("");
  const [tipoSangre, setTipoSangre] = useState(0);
  const [sisben, setSisben] = useState(0);
  const [Edad, setEdad] = useState(0);
  const [InstitucionP, setInstitucionP] = useState("");
  const [FechaN, setFechaN] = useState("");
  const [Discapacidad, setDiscapacidad] = useState(0);
  const [Alergia, setAlergia] = useState(0);
  //deshabilitar campos necesarios
  const [Disabled, setDisabled] = useState(false);
  //id que se utiliza para almacenar el id de los diferentes usuarios
  const [id, setId] = useState("");
  //boton del filtro 1
  const [BTNfiltro, setBTNfiltro] = useState(true);
  //filtro Activos (estudiantes)
  const filtro1 = Estudiantes.filter((est) => est.estado == "Activo");
  //cargar todo lo que se necesita del estudiante
  const CargarEstudiante = async () => {
    try {
      const response = await EstudiantesGET();
      const respons2 = await Ciudad();
      const respons3 = await Sisben();
      setCiudadesE(respons2.data);
      setEstudiantes(response.data);
      setSisbenE(respons3.data);
    } catch (err) {
      console.log(err);
    }
  };
  //profesores
  const [Profesores, setProfesores] = useState([]);
  const [tipoDocumentoP, setTipoDocumentoP] = useState(0);
  const [documentoP, setDocumentoP] = useState("");
  const [primerNombreP, setPrimerNombreP] = useState("");
  const [segundoNombreP, setSegundoNombreP] = useState("");
  const [primerApellidoP, setPrimerApellidoP] = useState("");
  const [segundoApellidoP, setSegundoApellidoP] = useState("");
  const [correoP, setCorreoP] = useState("");
  const [telefonoP, setTelefonoP] = useState("");
  const [telefono2P, setTelefono2P] = useState("");
  const [estadoP, setEstadoP] = useState(0);
  const [ciudadP, setCiudadP] = useState(0);
  const [direccionP, setDireccionP] = useState("");
  const [tipoSangreP, setTipoSangreP] = useState(0);
  const [seleccionP, setSeleccionP] = useState([]);
  // filtro para profesore
  const filtro2 = Profesores.filter((prof) => prof.estado_desc == "Activo");
  //ver materias asignada
  const [verMaterias, setVerMaterias] = useState(false);
  //cargar todo lo necesario del profesor
  const CargarProfesor = async () => {
    try {
      const response = await ProfesorGET();
      setProfesores(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  // padres
  const [padres, setPadres] = useState([]);
  const [tipoDocumentoC, setTipoDocumentoC] = useState(0);
  const [documentoC, setDocumentoC] = useState("");
  const [primerNombreC, setPrimerNombreC] = useState("");
  const [segundoNombreC, setSegundoNombreC] = useState("");
  const [primerApellidoC, setPrimerApellidoC] = useState("");
  const [segundoApellidoC, setSegundoApellidoC] = useState("");
  const [telefonoC, setTelefonoC] = useState("");
  const [telefono2C, setTelefono2C] = useState("");
  const [ciudadC, setCiudadC] = useState(0);
  const [direccionC, setDireccionC] = useState("");
  const [activate, setActivate] = useState("Padres");
  //asignar acudiente al estudiante
  const [AsignacionD, setAsignacionD] = useState("");
  const [AsignacionD2, setAsignacionD2] = useState("");
  const [AsignacionD3, setAsignacionD3] = useState("");
  //Cargar Padres
  const CargarPadres = async () => {
    try {
      const ressponse = await PadresGET();
      setPadres(ressponse.data);
    } catch (err) {
      console.log(err);
    }
  };
  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Inicio", path: "/coordinacion" },
    { label: "Coordinación Administrativa", path: "/coordinacion" },
    { label: "Gestión de Usuarios", path: "/coordinacion/gestion-usuarios" },
    ...(currentSubSection
      ? [
          {
            label:
              currentSubSection === "carga-estudiantes"
                ? "Estudiantes"
                : currentSubSection === "carga-profesores"
                ? "Profesores"
                : currentSubSection === "estudiantes"
                ? "Gestión de Estudiantes"
                : currentSubSection === "profesores"
                ? "Gestión de Profesores"
                : currentSubSection,
            path: `/coordinacion/gestion-usuarios/${currentSubSection}`,
          },
        ]
      : []),
  ];

  useEffect(() => {
    CargarEstudiante();
    CargarProfesor();
    CargarPadres();
  }, []);

  // Navegación
  const handleNavigate = (path) => {
    if (path === "/coordinacion") {
      onBack();
    } else if (path === "/coordinacion/gestion-usuarios") {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split("/").pop();
      if (
        [
          "profesores",
          "estudiantes",
          "carga-masiva",
          "carga-estudiantes",
        ].includes(subsection)
      ) {
        setCurrentSubSection(subsection);
      }
    }
  };
  const handleSectionClick = (id) => {
    setCurrentSubSection(id);
  };
  //cerrar modal
  const cerrarModal = () => {
    //ditar
    setEditar(false);
    //cerrar modal
    setModal(false);
    //habilitamos
    setDisabled(false);
    //limpiar campos de el estudiante
    setDocumento("");
    setPrimerNombre("");
    setSegundoNombre("");
    setPrimerApellido("");
    setSegundoApellido("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setEstadoE("");
    setEdad("");
    setInstitucionP("");
    setFechaN("");
    setGenero("");
    setSisben("");
    setTipoDocumento("");
    setTipoSangre("");
    setReligion("");
    setCiudad("");
    //campos profesor
    setDocumentoP("");
    setPrimerNombreP("");
    setSegundoNombreP("");
    setPrimerApellidoP("");
    setSegundoApellidoP("");
    setDireccionP("");
    setCorreoP("");
    setTelefonoP("");
    setTelefono2P("");
    setEstadoP("");
    setTipoDocumentoP("");
    setTipoSangreP("");
    setCiudadP("");
    //campos Padre
    setDocumentoC("");
    setPrimerNombreC("");
    setSegundoNombreC("");
    setPrimerApellidoC("");
    setSegundoApellidoC("");
    setTelefonoC("");
    setTelefono2C("");
    setDireccionC("");
    setTipoDocumentoC("");
    setCiudadC("");
  };
  // Secciones del dashboard
  const userSections = [
    {
      id: "profesores",
      title: "Profesores",
      description:
        "Gestiona la información de los profesores, asignaciones y horarios de clase.",
      icon: "👨‍🏫",
      buttonText: "Gestionar Profesores",
    },
    {
      id: "estudiantes",
      title: "Estudiantes",
      description:
        "Administra los registros de estudiantes, inscripciones y seguimiento académico.",
      icon: "👨‍🎓",
      buttonText: "Gestionar Estudiantes",
    },
    {
      id: "padres",
      title: "Padres de familia",
      description:
        "Registra y edita los datos de los padres de familia. Estos se suelen vincular a estudiantes individualmente.",
      icon: "👪",
      buttonText: "Gestionar Padres",
    },
    {
      id: "carga-masiva",
      title: "Carga Masiva",
      description:
        "Realiza carga masiva de datos para estudiantes y profesores mediante archivos.",
      icon: "📤",
      buttonText: "Carga Masiva",
    },
  ];
  //cruds Estudiante
  const AbrirModalParaEditarE = (item) => {
    if (item) {
      //Abrir modal
      setModal(true);
      //Edicion
      setEditar(true);
      if (item.numero_documento_estudiante) {
        //primary keys
        setDocumento(item.numero_documento_estudiante);
        //deshabilitamos documento porque es la llave primaria y no se puede modificar
        setDisabled(true);
        setPrimerNombre(item.nombre1);
        setSegundoNombre(item.nombre2);
        setPrimerApellido(item.apellido1);
        setSegundoApellido(item.apellido2);
        setCorreo(item.correo);
        setTelefono(item.telefono);
        setDireccion(item.direccion);
        setEstadoE(item.fk_tipo_estado);
        setGenero(item.fk_id_genero);
        setEdad(item.edad);
        setInstitucionP(item.institucion_procedencia);
        setFechaN(item.fecha_nacimiento);
        setSisben(item.fk_id_tipo_sisben);
        setTipoDocumento(item.fk_id_tipo_documento);
        setTipoSangre(item.fk_id_tipo_sangre);
        setReligion(item.religion);
        setAlergia(item.fk_id_tipo_alergia);
        setCiudad(item.fk_codigo_municipio);
      } else if (item.numero_documento_profesor) {
        //primary keys
        setDocumentoP(item.numero_documento_profesor);
        //deshabilitamos documento porque es la llave primaria y no se puede modificar
        setDisabled(true);
        setPrimerNombreP(item.nombre1);
        setSegundoNombreP(item.nombre2);
        setPrimerApellidoP(item.apellido1);
        setSegundoApellidoP(item.apellido2);
        setDireccionP(item.direccion);
        setCorreoP(item.correo);
        setTelefonoP(item.telefono1);
        setTelefono2P(item.telefono2);
        setEstadoP(item.fk_id_estado);
        setTipoDocumentoP(item.fk_id_tipo_documento);
        setTipoSangreP(item.fk_id_tipo_sangre);
        setCiudadP(item.fk_codigo_municipio);
      } else if (item.numero_documento_acudiente) {
        setDocumentoC(item.numero_documento_acudiente);
        setDisabled(true);
        setPrimerNombreC(item.nombre1);
        setSegundoNombreC(item.nombre2);
        setPrimerApellidoC(item.apellido1);
        setSegundoApellidoC(item.apellido2);
        setTelefonoC(item.telefono1);
        setTelefono2C(item.telefono2);
        setDireccionC(item.direccion);
        setTipoDocumentoC(item.fk_id_tipo_documento);
        setCiudadC(item.fk_codigo_municipio);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Error, los datos no coinciden",
        timer: 3000,
      });
    }
  };

  const editarEstudiante = async () => {
    try {
      if (
        estadoE != 0 &&
        genero != 0 &&
        sisben != 0 &&
        tipoDocumento != 0 &&
        tipoSangre != 0 &&
        ciudad != 0 &&
        Edad != 0 &&
        Alergia != 0 &&
        Discapacidad != 0
      ) {
        const respons = await EditarEstudiante(documento, {
          numero_documento_estudiante: documento,
          nombre1: primerNombre,
          nombre2: segundoNombre,
          apellido1: primerApellido,
          apellido2: segundoApellido,
          correo: correo,
          institucion_procedencia: InstitucionP,
          fk_id_tipo_documento: tipoDocumento,
          direccion: direccion,
          fk_id_genero: genero,
          edad: Edad,
          fecha_nacimiento: FechaN,
          fk_codigo_municipio: ciudad,
          telefono: telefono,
          fk_id_tipo_sangre: tipoSangre,
          fk_id_tipo_sisben: sisben,
          fk_id_tipo_discapacidad: Discapacidad,
          fk_id_tipo_alergia: Alergia,
          fk_tipo_estado: estadoE,
          religion: religion,
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Esudiante Editado Con Exito",
              timer: 3000,
            });
            CargarEstudiante();
            cerrarModal();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error Con El Servidor",
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          text: "Algunos de los campos de seleccion estan vacios por favor llenelos",
          timer: 5000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deshabilitarE = async (item) => {
    try {
      if (item) {
        if (item.numero_documento_estudiante) {
          const respons = await EditarEstudiante(
            item.numero_documento_estudiante,
            {
              fk_tipo_estado: 2,
            }
          )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: "Estudiante deshabilitado con exito",
                timer: 3000,
              });
              CargarEstudiante();
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                text: "Estudiante no se pudo deshabilitar",
                timer: 3000,
              });
            });
        } else if (item.numero_documento_profesor) {
          const respons = await EditarProfesores(
            item.numero_documento_profesor,
            {
              fk_id_estado: 2,
            }
          )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: "Profesor deshabilitado con exito",
                timer: 3000,
              });
              CargarProfesor();
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                text: "Profesor no se pudo deshabilitar",
                timer: 3000,
              });
            });
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "No se encontro el item necesario para deshabilitar el usuario",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const crearProfesor = async () => {
    try {
      if (
        documentoP &&
        primerNombreP &&
        primerApellidoP &&
        correoP &&
        telefonoP &&
        direccionP &&
        estadoP != 0 &&
        tipoDocumentoP != 0 &&
        tipoSangreP != 0 &&
        ciudadP != 0
      ) {
        const respons = await CrearProfesores({
          numero_documento_profesor: documentoP,
          nombre1: primerNombreP,
          nombre2: segundoNombreP,
          apellido1: primerApellidoP,
          apellido2: segundoApellidoP,
          correo: correoP,
          telefono1: telefonoP,
          telefono2: telefono2P,
          fk_id_tipo_documento: tipoDocumentoP,
          direccion: direccionP,
          fk_codigo_municipio: ciudadP,
          fk_id_tipo_sangre: tipoSangreP,
          fk_id_estado: estadoP,
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Profesor Creado Con Exito",
              timer: 3000,
            });
            CargarProfesor();
            cerrarModal();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error Con El Servidor",
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          text: "Llene Todos Los Campos",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  //cruds profesores
  const editarProfesor = async () => {
    try {
      if (
        estadoP != 0 &&
        tipoDocumentoP != 0 &&
        tipoSangreP != 0 &&
        ciudadP != 0
      ) {
        const respons = await EditarProfesores(documentoP, {
          numero_documento_profesor: documentoP,
          nombre1: primerNombreP,
          nombre2: segundoNombreP,
          apellido1: primerApellidoP,
          apellido2: segundoApellidoP,
          correo: correoP,
          telefono1: telefonoP,
          telefono2: telefono2P,
          fk_id_tipo_documento: tipoDocumentoP,
          direccion: direccionP,
          fk_codigo_municipio: ciudadP,
          fk_id_tipo_sangre: tipoSangreP,
          fk_id_estado: estadoP,
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Profesor editado con exito",
              timer: 3000,
            });
            CargarProfesor();
            cerrarModal();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error Con El Servidor",
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          text: "Algunos de los campos de seleccion estan vacios por favor llenelos",
          timer: 5000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const crearEstudiante = async () => {
    try {
      if (
        documento &&
        primerNombre &&
        primerApellido &&
        correo &&
        telefono &&
        direccion &&
        estadoE != 0 &&
        genero != 0 &&
        sisben != 0 &&
        tipoDocumento != 0 &&
        tipoSangre != 0 &&
        ciudad != 0 &&
        religion &&
        Edad != 0 &&
        Alergia != 0 &&
        Discapacidad != 0 &&
        InstitucionP &&
        FechaN
      ) {
        const respons = await CrearEstudiante({
          numero_documento_estudiante: documento,
          nombre1: primerNombre,
          nombre2: segundoNombre,
          apellido1: primerApellido,
          apellido2: segundoApellido,
          correo: correo,
          institucion_procedencia: InstitucionP,
          fk_id_tipo_documento: tipoDocumento,
          direccion: direccion,
          fk_id_genero: genero,
          edad: Edad,
          fecha_nacimiento: FechaN,
          fk_codigo_municipio: ciudad,
          telefono: telefono,
          fk_id_tipo_sangre: tipoSangre,
          fk_id_tipo_sisben: sisben,
          fk_id_tipo_discapacidad: Discapacidad,
          fk_id_tipo_alergia: Alergia,
          fk_tipo_estado: estadoE,
          religion: religion,
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Esudiante Creado Con Exito",
              timer: 3000,
            });
            CargarEstudiante();
            cerrarModal();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error Con El Servidor",
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          text: "Llene Todos Los Campos",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  //Cruds Padres
  const crearPadres = async () => {
    try {
      if (
        !documentoC ||
        !primerNombreC ||
        !primerApellidoC ||
        !telefonoC ||
        !direccionC ||
        tipoDocumentoC === "0" ||
        ciudadC === "0"
      ) {
        return Swal.fire({
          icon: "info",
          text: "Llene Todos Los Campos",
          timer: 3000,
        });
      }
      const response = await CrearPadres({
        numero_documento_acudiente: documentoC,
        nombre1: primerNombreC,
        nombre2: segundoNombreC,
        apellido1: primerApellidoC,
        apellido2: segundoApellidoC,
        telefono1: telefonoC,
        telefono2: telefono2C,
        fk_id_tipo_documento: tipoDocumentoC,
        direccion: direccionC,
        fk_codigo_municipio: ciudadC,
      });
      await CrearUsuarioPadre({
        username: documentoC,
        password: documentoC,
        rol: "padres",
        first_name: primerNombreC,
        last_name: primerApellidoC,
      });
      Swal.fire({
        icon: "success",
        text: "Se creó el acudiente de manera exitosa",
        timer: 3000,
      });
      CargarPadres();
      cerrarModal();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Error con el servidor",
        timer: 3000,
      });
    }
  };

  const editarPadres = async () => {
    try {
      if (tipoDocumentoC != 0 && ciudadC != 0) {
        const respons = await EditarPadres(documentoC, {
          numero_documento_acudiente: documentoC,
          nombre1: primerNombreC,
          nombre2: segundoNombreC,
          apellido1: primerApellidoC,
          apellido2: segundoApellidoC,
          telefono1: telefonoC,
          telefono2: telefono2C,
          fk_id_tipo_documento: tipoDocumentoC,
          direccion: direccionC,
          fk_codigo_municipio: ciudadC,
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Padre editado con exito",
              timer: 3000,
            });
            CargarPadres();
            cerrarModal();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error Con El Servidor",
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          text: "Algunos de los campos de seleccion estan vacios por favor llenelos",
          timer: 5000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const eliminarPadres = async (item) => {
    try {
      if (item.numero_documento_acudiente) {
        const result = await Swal.fire({
          title: "¿Eliminar curso?",
          text: "Esta acción eliminará el acudiente permanentemente.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#c41e3a",
          cancelButtonColor: "#c41e3a",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "No, cancelar",
        });
        if (result.isConfirmed) {
          try {
            const respons = await EliminarPadres(
              item.numero_documento_acudiente
            )
              .then(() => {
                Swal.fire({
                  icon: "success",
                  text: "El acudiente se elimino exitosamente",
                  timer: 3000,
                });
                CargarPadres();
              })
              .catch((err) => {
                console.log(err);
                Swal.fire({
                  icon: "error",
                  text: "Error, intente nuevamente",
                  timer: 3000,
                });
              });
          } catch (err) {
            console.log(err);
            Swal.fire({
              icon: "error",
              text: "Error en la respuesta del servidor, intente nuevamente",
              timer: 3000,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AsignacionAE = async (e) => {
    e.preventDefault();

    const estudiante = Estudiantes.find(
      (est) => est.numero_documento_estudiante == AsignacionD
    );
    const padre = padres.find(
      (pdr) => pdr.numero_documento_acudiente == AsignacionD2
    );

    if (estudiante) {
      if (padre) {
        if (AsignacionD3 != 0) {
          try {
            const respons = await AsignacionDeAcudienteAEstudiante({
              fk_numero_documento_acudiente: parseInt(AsignacionD2),
              fk_numero_documento_estudiante: parseInt(AsignacionD),
              fk_id_tipo_acudiente: AsignacionD3,
            })
              .then(() => {
                Swal.fire({
                  icon: "success",
                  text: "Asignacion creada con exito",
                  timer: 3000,
                });
                setAsignacionD("");
                setAsignacionD2("");
                setAsignacionD3("");
              })
              .catch((err) => {
                console.log(err);
                Swal.fire({
                  icon: "error",
                  text: "Error al crear la asignacion",
                  timer: 3000,
                });
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          Swal.fire({
            icon: "info",
            text: "Seleccione un campo en el tipo padre",
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "El padre no existe",
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "El estudiante no existe",
        timer: 3000,
      });
    }
  };
  const renderSubSection = () => {
    switch (currentSubSection) {
      case "padres":
        return activate == "Padres" ? (
          <div>
            <div className="selector_padres">
              <div
                className={`Tergetas-cambio ${
                  activate == "Padres" ? "activate" : ""
                }`}
                onClick={() => setActivate("Padres")}
              >
                Acudientes
              </div>
              <div
                className={`Tergetas-cambio ${
                  activate == "Asignacion" ? "activate" : ""
                }`}
                onClick={() => setActivate("Asignacion")}
              >
                Asignar Estudiante
              </div>
            </div>
            {modal && (
              <Modal
                titulo={editar ? "Editar Padre" : "Crear Padre"}
                inputs={[
                  {
                    nombre: "Documento",
                    type: "text",
                    value: documentoC ?? "",
                    disabled: Disabled,
                    onChange: (e) => setDocumentoC(e.target.value),
                  },
                  {
                    nombre: "Primer Nombre",
                    type: "text",
                    value: primerNombreC ?? "",
                    onChange: (e) => setPrimerNombreC(e.target.value),
                  },
                  {
                    nombre: "Segundo Nombre",
                    type: "text",
                    value: segundoNombreC ?? "",
                    onChange: (e) => setSegundoNombreC(e.target.value),
                  },
                  {
                    nombre: "Primer Apellido",
                    type: "text",
                    value: primerApellidoC ?? "",
                    onChange: (e) => setPrimerApellidoC(e.target.value),
                  },
                  {
                    nombre: "Segundo Apellido",
                    type: "text",
                    value: segundoApellidoC ?? "",
                    onChange: (e) => setSegundoApellidoC(e.target.value),
                  },
                  {
                    nombre: "Dirección",
                    type: "text",
                    value: direccionC ?? "",
                    onChange: (e) => setDireccionC(e.target.value),
                  },
                  {
                    nombre: "Teléfono 1",
                    type: "text",
                    value: telefonoC ?? "",
                    onChange: (e) => setTelefonoC(e.target.value),
                  },
                  {
                    nombre: "Teléfono 2",
                    type: "text",
                    value: telefono2C ?? "",
                    onChange: (e) => setTelefono2C(e.target.value),
                  },
                ]}
                acciones={[
                  editar
                    ? { nombre: "Editar", click: () => editarPadres() }
                    : { nombre: "Guardar", click: () => crearPadres() },
                  { nombre: "cerrar", click: () => cerrarModal() },
                ]}
                select={[
                  {
                    nombre: "Tipo Documento",
                    value: tipoDocumentoC ?? 0,
                    onChange: (e) => setTipoDocumentoC(e.target.value),
                    opciones: [
                      { value: 1, title: "Cédula" },
                      { value: 2, title: "Tarjeta de Identidad" },
                    ],
                  },
                ]}
                selectConBusqueda={[
                  {
                    nombre: "Ciudades",
                    value: ciudadC ?? 0,
                    placeholder: "Buscar Ciudad...",
                    options: ciudadesE.map((item) => ({
                      value: item.codigo_municipio,
                      label: item.nombre,
                    })),
                    onChange: (seleccion) =>
                      setCiudadC(seleccion ? seleccion.value : null),
                  },
                ]}
                SalirM={() => cerrarModal()}
              />
            )}
            <Table
              id="Acudientes"
              title="Gestión de Padres"
              description="Registro manual de padres de familia."
              columns={[
                { key: "nombre_completo", label: "Nombre" },
                { key: "numero_documento_acudiente", label: "Documento" },
                { key: "telefono1", label: "Telefono" },
              ]}
              data={padres}
              searchPlaceholder="Buscar por nombre..."
              addButtonText="Añadir Padre"
              actions={[
                {
                  label: "Editar",
                  onClick: (item) => AbrirModalParaEditarE(item),
                },
                {
                  label: "Eliminar",
                  onClick: (item) => eliminarPadres(item),
                },
              ]}
              onAdd={() => setModal(true)}
            />
          </div>
        ) : (
          <div>
            <div className="selector_padres">
              <div
                className={`Tergetas-cambio ${
                  activate == "Padres" ? "activate" : ""
                }`}
                onClick={() => setActivate("Padres")}
              >
                Acudientes
              </div>
              <div
                className={`Tergetas-cambio ${
                  activate == "Asignacion" ? "activate" : ""
                }`}
                onClick={() => setActivate("Asignacion")}
              >
                Asignar Estudiante
              </div>
            </div>
            <div className="ContenedorAsignacion">
              <h1>Asignacion manual de estudiantes</h1>
              <div className="Contenedor_Infomarcion">
                <p>
                  En este apartado se va a asociar un estudiante con su padre de
                  familia correspondiente. A continuacion ingrese en los campos
                  lo datos necessarios para hacer la asociacion
                </p>
              </div>
              <form
                className="Contenedor-Inputs-padres"
                onSubmit={(e) => {
                  AsignacionAE(e);
                }}
              >
                <section>
                  <div className="InputsG">
                    <label>Documento estudiante</label>
                    <input
                      placeholder="Documento E."
                      type="number"
                      value={AsignacionD}
                      onChange={(e) => setAsignacionD(e.target.value)}
                    ></input>
                  </div>
                  <div className="InputsG">
                    <label>Documento padre</label>
                    <input
                      placeholder="Documento P."
                      type="number"
                      value={AsignacionD2}
                      onChange={(e) => setAsignacionD2(e.target.value)}
                    ></input>
                  </div>
                  <div className="InputsG">
                    <label>Tipo de acudiente</label>
                    <select
                      value={AsignacionD3}
                      onChange={(e) => setAsignacionD3(e.target.value)}
                    >
                      <option value="" hidden>
                        Seleccione
                      </option>
                      <option value={1}>Madre</option>
                      <option value={2}>Padre</option>
                      <option value={3}>Tio</option>
                      <option value={4}>Tia</option>
                      <option value={5}>Hermano</option>
                      <option value={6}>Hermana</option>
                      <option value={7}>Otro</option>
                    </select>
                  </div>
                </section>
                <button className="BTN-asociar" type="submit">
                  Asociar
                </button>
              </form>
            </div>
          </div>
        );

      case "estudiantes":
        return (
          <div>
            {modal && (
              <Modal
                titulo={editar ? "Editar Estudiante" : "Crear Estudiante"}
                inputs={[
                  {
                    nombre: "Documento",
                    type: "text",
                    value: documento ?? "",
                    disabled: Disabled,
                    onChange: (e) => setDocumento(e.target.value),
                  },
                  {
                    nombre: "Primer Nombre",
                    type: "text",
                    value: primerNombre ?? "",
                    onChange: (e) => setPrimerNombre(e.target.value),
                  },
                  {
                    nombre: "Segundo Nombre",
                    type: "text",
                    value: segundoNombre ?? "",
                    onChange: (e) => setSegundoNombre(e.target.value),
                  },
                  {
                    nombre: "Primer Apellido",
                    type: "text",
                    value: primerApellido ?? "",
                    onChange: (e) => setPrimerApellido(e.target.value),
                  },
                  {
                    nombre: "Segundo Apellido",
                    type: "text",
                    value: segundoApellido ?? "",
                    onChange: (e) => setSegundoApellido(e.target.value),
                  },
                  {
                    nombre: "Correo",
                    type: "email",
                    value: correo ?? "",
                    onChange: (e) => setCorreo(e.target.value),
                  },
                  {
                    nombre: "Teléfono",
                    type: "text",
                    value: telefono ?? "",
                    onChange: (e) => setTelefono(e.target.value),
                  },
                  {
                    nombre: "Dirección",
                    type: "text",
                    value: direccion ?? "",
                    onChange: (e) => setDireccion(e.target.value),
                  },
                  {
                    nombre: "Institucion de procedencia",
                    type: "text",
                    value: InstitucionP ?? "",
                    onChange: (e) => setInstitucionP(e.target.value),
                  },
                  {
                    nombre: "Edad",
                    type: "number",
                    value: Edad ?? "",
                    onChange: (e) => setEdad(e.target.value),
                  },
                  {
                    nombre: "Fecha nacimiento",
                    type: "date",
                    value: FechaN ?? "",
                    onChange: (e) => setFechaN(e.target.value),
                  },
                ]}
                acciones={[
                  editar
                    ? { nombre: "Editar", click: () => editarEstudiante() }
                    : { nombre: "Guardar", click: () => crearEstudiante() },
                  { nombre: "cerrar", click: () => cerrarModal() },
                ]}
                select={[
                  {
                    nombre: "Estado",
                    value: estadoE ?? 1,
                    onChange: (e) => setEstadoE(e.target.value),
                    opciones: [
                      { value: 1, title: "Activo" },
                      { value: 2, title: "InActivo" },
                    ],
                  },
                  {
                    nombre: "Género",
                    value: genero ?? 0,
                    onChange: (e) => setGenero(e.target.value),
                    opciones: [
                      { value: 1, title: "Masculino" },
                      { value: 2, title: "Femenino" },
                      { value: 3, title: "No binario" },
                      { value: 4, title: "Prefiere no decirlo" },
                      { value: 5, title: "Otro" },
                    ],
                  },
                  {
                    nombre: "Sisbén",
                    value: sisben ?? 0,
                    onChange: (e) => setSisben(e.target.value),
                    opciones: sisbenE.map((item) => ({
                      value: item.id_tipo_sisben,
                      title: item.descripcion,
                    })),
                  },
                  {
                    nombre: "Tipo Documento",
                    value: tipoDocumento ?? 0,
                    onChange: (e) => setTipoDocumento(e.target.value),
                    opciones: [
                      { value: 1, title: "Cédula" },
                      { value: 2, title: "Tarjeta de Identidad" },
                    ],
                  },
                  {
                    nombre: "Tipo de Sangre",
                    value: tipoSangre ?? 0,
                    onChange: (e) => setTipoSangre(e.target.value),
                    opciones: [
                      { value: 1, title: "O+" },
                      { value: 2, title: "O-" },
                      { value: 3, title: "A+" },
                      { value: 4, title: "A-" },
                      { value: 5, title: "B+" },
                      { value: 6, title: "B-" },
                      { value: 7, title: "AB+" },
                      { value: 8, title: "AB-" },
                    ],
                  },
                  {
                    nombre: "Religión",
                    value: religion ?? "",
                    onChange: (e) => setReligion(e.target.value),
                    opciones: [
                      { value: "Catolica", title: "Católica" },
                      { value: "Cristiana", title: "Cristiana" },
                      { value: "Ateo", title: "Ateo" },
                    ],
                  },
                  {
                    nombre: "Discapacidad",
                    value: Discapacidad ?? 1,
                    onChange: (e) => setDiscapacidad(e.target.value),
                    opciones: [
                      { value: 1, title: "Ninguna" },
                      { value: 2, title: "Discapacidad física" },
                      { value: 3, title: "Discapacidad visual" },
                      { value: 4, title: "Discapacidad auditiva" },
                      { value: 5, title: "Discapacidad cognitiva" },
                      { value: 6, title: "Discapacidad múltiple" },
                      { value: 7, title: "Discapacidad psicosocial" },
                      { value: 8, title: "Discapacidad intelectual" },
                      { value: 9, title: "Discapacidad del habla" },
                      { value: 10, title: "Movilidad reducida" },
                    ],
                  },
                  {
                    nombre: "Alergias",
                    value: Alergia ?? 1,
                    onChange: (e) => setAlergia(e.target.value),
                    opciones: [
                      { value: 1, title: "Ninguna" },
                      { value: 2, title: "Asma" },
                      { value: 3, title: "Polen" },
                      { value: 4, title: "Ácaros" },
                      { value: 5, title: "Picaduras de insectos" },
                      { value: 6, title: "Medicamentos" },
                      { value: 7, title: "Lácteos" },
                      { value: 8, title: "Gluten" },
                      { value: 9, title: "Mariscos" },
                      { value: 10, title: "Frutos secos" },
                    ],
                  },
                ]}
                selectConBusqueda={[
                  {
                    nombre: "Ciudades",
                    value: ciudad ?? 0,
                    placeholder: "Buscar Ciudad...",
                    options: ciudadesE.map((item) => ({
                      value: item.codigo_municipio,
                      label: item.nombre,
                    })),
                    onChange: (seleccion) =>
                      setCiudad(seleccion ? seleccion.value : null),
                  },
                ]}
                SalirM={() => cerrarModal()}
              />
            )}
            <Table
              id="Estudiantes"
              busqueda={["numero_documento_estudiante", "nombre_completo"]}
              title="Gestión de Estudiantes"
              description="Registro manual de estudiantes."
              columns={[
                { key: "nombre_completo", label: "NOMBRE" },
                { key: "numero_documento_estudiante", label: "IDENTIFICACIÓN" },
                {
                  key: "cursos",
                  label: "CURSO",
                  render: (row) => {
                    const curso = row.cursos.find(
                      (c) => c.estado_curso === "Activo"
                    );
                    return curso ? curso.curso_nombre : "Sin curso";
                  },
                },
                { key: "estado", label: "ESTADO" },
              ]}
              data={BTNfiltro ? filtro1 : Estudiantes}
              check={[
                {
                  title: "filtro solo activos",
                  check: BTNfiltro,
                  onChange: (e) => setBTNfiltro(e.target.checked),
                },
              ]}
              searchPlaceholder="Buscar por Documento..."
              addButtonText="Añadir estudiante"
              actions={[
                {
                  label: "Editar",
                  onClick: (item) => AbrirModalParaEditarE(item),
                },
                {
                  label: "Eliminar",
                  onClick: (item) => deshabilitarE(item),
                },
              ]}
              onAdd={() => setModal(true)}
            />
          </div>
        );
      case "profesores":
        return (
          <div>
            {verMaterias && (
              <VerMaterias
                ProfesorSeleccionado={seleccionP}
                titulo="Materias Asignadas"
                salir={() => {
                  setVerMaterias(false);
                  setSeleccionP([]);
                }}
              />
            )}
            {modal && (
              <Modal
                titulo={editar ? "Editar Profesor" : "Crear Profesor"}
                inputs={[
                  {
                    nombre: "Documento",
                    type: "text",
                    value: documentoP ?? "",
                    disabled: Disabled,
                    onChange: (e) => setDocumentoP(e.target.value),
                  },
                  {
                    nombre: "Primer Nombre",
                    type: "text",
                    value: primerNombreP ?? "",
                    onChange: (e) => setPrimerNombreP(e.target.value),
                  },
                  {
                    nombre: "Segundo Nombre",
                    type: "text",
                    value: segundoNombreP ?? "",
                    onChange: (e) => setSegundoNombreP(e.target.value),
                  },
                  {
                    nombre: "Primer Apellido",
                    type: "text",
                    value: primerApellidoP ?? "",
                    onChange: (e) => setPrimerApellidoP(e.target.value),
                  },
                  {
                    nombre: "Segundo Apellido",
                    type: "text",
                    value: segundoApellidoP ?? "",
                    onChange: (e) => setSegundoApellidoP(e.target.value),
                  },
                  {
                    nombre: "Correo",
                    type: "email",
                    value: correoP ?? "",
                    onChange: (e) => setCorreoP(e.target.value),
                  },
                  {
                    nombre: "Dirección",
                    type: "text",
                    value: direccionP ?? "",
                    onChange: (e) => setDireccionP(e.target.value),
                  },
                  {
                    nombre: "Teléfono 1",
                    type: "text",
                    value: telefonoP ?? "",
                    onChange: (e) => setTelefonoP(e.target.value),
                  },
                  {
                    nombre: "Teléfono 2",
                    type: "text",
                    value: telefono2P ?? "",
                    onChange: (e) => setTelefono2P(e.target.value),
                  },
                ]}
                acciones={[
                  editar
                    ? { nombre: "Editar", click: () => editarProfesor() }
                    : { nombre: "Guardar", click: () => crearProfesor() },
                  { nombre: "cerrar", click: () => cerrarModal() },
                ]}
                select={[
                  {
                    nombre: "Estado",
                    value: estadoP ?? 1,
                    onChange: (e) => setEstadoP(e.target.value),
                    opciones: [
                      { value: 1, title: "Activo" },
                      { value: 2, title: "InActivo" },
                    ],
                  },
                  {
                    nombre: "Tipo Documento",
                    value: tipoDocumentoP ?? 0,
                    onChange: (e) => setTipoDocumentoP(e.target.value),
                    opciones: [
                      { value: 1, title: "Cédula" },
                      { value: 2, title: "Tarjeta de Identidad" },
                    ],
                  },
                  {
                    nombre: "Tipo de Sangre",
                    value: tipoSangreP ?? 0,
                    onChange: (e) => setTipoSangreP(e.target.value),
                    opciones: [
                      { value: 1, title: "O+" },
                      { value: 2, title: "O-" },
                      { value: 3, title: "A+" },
                      { value: 4, title: "A-" },
                      { value: 5, title: "B+" },
                      { value: 6, title: "B-" },
                      { value: 7, title: "AB+" },
                      { value: 8, title: "AB-" },
                    ],
                  },
                ]}
                selectConBusqueda={[
                  {
                    nombre: "Ciudades",
                    value: ciudadP ?? 0,
                    placeholder: "Buscar Ciudad...",
                    options: ciudadesE.map((item) => ({
                      value: item.codigo_municipio,
                      label: item.nombre,
                    })),
                    onChange: (seleccion) =>
                      setCiudadP(seleccion ? seleccion.value : null),
                  },
                ]}
                SalirM={() => cerrarModal()}
              />
            )}

            <Table
              id="Profesores"
              busqueda={["numero_documento_profesor", "nombre_completo"]}
              title="Gestión de Profesores"
              description="Registro manual de profesores."
              columns={[
                { key: "nombre_completo", label: "NOMBRE" },
                { key: "numero_documento_profesor", label: "IDENTIFICACIÓN" },
                { key: "estado_desc", label: "ESTADO" },
              ]}
              data={BTNfiltro ? filtro2 : Profesores}
              searchPlaceholder="Buscar por cedula..."
              addButtonText="Añadir Profesor"
              check={[
                {
                  title: "filtro solo activos",
                  check: BTNfiltro,
                  onChange: (e) => setBTNfiltro(e.target.checked),
                },
              ]}
              actions={[
                {
                  label: "Ver Materias",
                  onClick: (item) => {
                    setSeleccionP(item);
                    setVerMaterias(true);
                  },
                },
                {
                  label: "Editar",
                  onClick: (item) => AbrirModalParaEditarE(item),
                },
                {
                  label: "Eliminar",
                  onClick: (item) => deshabilitarE(item),
                },
              ]}
              onAdd={() => setModal(true)}
            />
          </div>
        );
      case "carga-masiva":
        return <CargaMasiva CargarEstudiante={CargarEstudiante} />;
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
              <h1 className="gestion-academica-title">Gestión de Usuarios</h1>
              <p className="gestion-academica-subtitle">
                Administra profesores y estudiantes del sistema académico
              </p>
            </div>

            <div className="gestion-academica-grid">
              {userSections.map((section) => (
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

export default GestionUsuarios;
