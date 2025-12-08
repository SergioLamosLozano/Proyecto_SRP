import { useEffect, useState } from "react";
import "../styles/Actividades.css";
import Breadcrumbs from "./Breadcrumbs";
import { actividadesAnteriores, EstudiantesGET } from "../api/usuarios";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import Modal from "./modal";
import {
  ActividadesDelete,
  ActividadesPatch,
  ActividadesPost,
  BuscarCoincidenciaNotas,
  BuscarMateriasAsignadas,
  Estudiantes_notasPost,
} from "../api/cursos";
import Swal from "sweetalert2";

function Actividades({ onBack }) {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [ActividadesA, setActividadesA] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");
  const [tipoA, setTipoA] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [materiaP, setMateriaP] = useState("");
  const [MateriaProfesor, setMateriaProfesor] = useState([]);
  const [materiaseleccionada, setMateriaseleccionada] = useState("");
  const [cursoseleccionada, setCursoseleccionada] = useState("");
  const [ModalEliminarOEditar, setModalEliminarOEditar] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState([]);
  const [modalA, setModalA] = useState(false);
  //
  const [estudiantes, setEstudiantes] = useState([]);
  const [DocumentoE, setDocumentoE] = useState("");
  const [MateriasAsignadaP, setMateriasAsignadaP] = useState([]);
  const filter = materiaseleccionada
    ? MateriasAsignadaP.filter(
        (mat) => mat.materia_nombre == materiaseleccionada
      )
    : [];
  const filter2 = cursoseleccionada
    ? estudiantes.filter(
        (est) =>
          est.estado == "Activo" &&
          est.cursos?.some((cur) => cur.curso_nombre == cursoseleccionada)
      )
    : [];

  const filtroparaselect = filter2
    ? filter2.map((fil) => ({
        value: fil.numero_documento_estudiante,
        label: fil.nombre_completo,
      }))
    : [];

  const filtroActividad = materiaseleccionada
    ? ActividadesA.filter(
        (act) => act.MateriaProfesores?.materia_nombre == materiaseleccionada
      )
    : [];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("error al obtener el token");
    }

    const decoded = jwtDecode(token);
    CargarActividades(decoded.username);
    CargarActividades2(decoded.username);
  }, []);

  const cerrar = () => {
    setNombre("");
    setDescripcion("");
    setPorcentaje("");
    setFecha_inicio("");
    setFecha_fin("");
    setTipoA("");
    setPeriodo("");
    setMateriaP("");
    setModalA(false);
  };

  const CargarActividades = async (id) => {
    try {
      const response = await actividadesAnteriores(id);
      const response2 = await BuscarMateriasAsignadas(id);
      const response3 = await EstudiantesGET();
      setEstudiantes(response3.data);
      setActividadesA(response.data);
      setMateriaProfesor(response2.data);
      setMateriasAsignadaP(response2.data);
    } catch (err) {
      console.log(err);
    }
  };

  const CargarActividades2 = async (id) => {
    try {
      const response = await actividadesAnteriores(id);
      setActividadesA(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminarActividad = async (item) => {
    if (!item) return console.log("Error no se encuentra el item");

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await BuscarCoincidenciaNotas(item);

      if (response.data.length === 0) {
        await ActividadesDelete(item);

        Swal.fire({
          icon: "success",
          text: "Actividad eliminada con éxito",
          timer: 2000,
          showConfirmButton: false,
        });
        CargarActividades2();
        setModalEliminarOEditar(false);
      } else {
        Swal.fire({
          icon: "error",
          text: "La actividad está asociada a una nota",
          timer: 2000,
          showConfirmButton: false,
        });
        setModalEliminarOEditar(false);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Error con el servidor",
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(err);
    }
  };

  const PostActividades = async (e) => {
    e.preventDefault();
    if (
      !nombre ||
      !descripcion ||
      !fecha_inicio ||
      !fecha_fin ||
      !porcentaje ||
      !tipoA ||
      !materiaP ||
      !periodo
    ) {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
      return; // detener la función si falta algún campo
    }
    try {
      const response = await ActividadesPost({
        nombre: nombre,
        descripcion: descripcion,
        porcentaje: porcentaje,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        fk_id_materia_profesores: materiaP,
        fk_id_periodo_academico: periodo,
        fk_id_tipo_actividad: tipoA,
      });
      Swal.fire({
        icon: "success",
        text: "Actividad creada con exito",
        timer: 3000,
      });
      const token = sessionStorage.getItem("token");
      const decoded = jwtDecode(token);
      cerrar();
      CargarActividades2(decoded.username);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Error con el servidor",
        timer: 3000,
      });
      console.log(err);
    }
  };

  const EliminarOEditar = async (item) => {
    setModalEliminarOEditar(true);
    setItemSeleccionado(item);
  };
  const Sections = [
    {
      nombre: "actividades anteriores 🗒️",
      descripcion:
        "En este apartado se podran ver las actividades anteriormente asignadas",
    },
    {
      nombre: "Crear actividades 📒",
      descripcion:
        "En este apartado se podra crear nuevas actividades para los distintas materias ",
    },
    {
      nombre: "Calificar ✏️",
      descripcion:
        "En este apartado se podra calificar las actividades que se an asignado a los distintos cursos",
    },
  ];

  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Pagina Docentes", path: "/docentes" },
    { label: "Actividades", path: "/docentes/actividades" },
    ...(currentSubSection
      ? [
          {
            label: currentSubSection,
            path: `/docentes/actividades/${currentSubSection}`,
          },
        ]
      : []),
  ];

  const modal = async () => {
    if (!itemSeleccionado) return console.log("no hay item");
    setId(itemSeleccionado.id_actividades);
    setNombre(itemSeleccionado.nombre || "");
    setDescripcion(itemSeleccionado.descripcion || "");
    setPorcentaje(itemSeleccionado.porcentaje || "");
    setFecha_inicio(itemSeleccionado.fecha_inicio || "");
    setFecha_fin(itemSeleccionado.fecha_fin || "");
    setTipoA(itemSeleccionado.fk_id_tipo_actividad || "");
    setPeriodo(itemSeleccionado.fk_id_periodo_academico || "");
    setMateriaP(itemSeleccionado.fk_id_materia_profesores || "");
    setModalA(true);
    setModalEliminarOEditar(false);
  };

  const actualizarActividad = async () => {
    if (!id)
      return console.log(
        "no se puede actualizar debido al que el id no se encontro"
      );

    if (
      nombre &&
      descripcion &&
      porcentaje &&
      fecha_fin &&
      fecha_inicio &&
      tipoA &&
      periodo &&
      materiaP
    ) {
      try {
        const response = await ActividadesPatch(id, {
          nombre: nombre,
          descripcion: descripcion,
          porcentaje: porcentaje,
          fecha_inicio: fecha_inicio,
          fecha_fin: fecha_fin,
          fk_id_materia_profesores: materiaP,
          fk_id_periodo_academico: periodo,
          fk_id_tipo_actividad: tipoA,
        });
        Swal.fire({
          icon: "success",
          text: "Actividad editada con exito",
          timer: 3000,
        });
        const token = sessionStorage.getItem("token");
        const decoded = jwtDecode(token);
        CargarActividades2(decoded.username);
        cerrar();
      } catch (err) {
        Swal.fire({
          icon: "error",
          text: "Error con el servidor",
          timer: 3000,
        });
        console.log(err);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Llene todos los campos",
        timer: 3000,
      });
    }
  };

  const handleNavigate = (path) => {
    if (path === "/docentes") {
      onBack();
    } else if (path === "/docentes/actividades") {
      setCurrentSubSection(null);
    }
  };
  const render = () => {
    switch (currentSubSection) {
      case "actividades anteriores 🗒️":
        return (
          <div className="ActividadesContenedor2">
            <h1 className="TituloActividades">Actividades anteriores</h1>
            <div className="ActividadesContenedor3">
              {ModalEliminarOEditar && (
                <div className="fonNegroA">
                  <div className="SeleccionA">
                    <h1>{itemSeleccionado?.nombre}</h1>
                    <span
                      onClick={() => {
                        setModalEliminarOEditar(false);
                        setItemSeleccionado([]);
                      }}
                    >
                      x
                    </span>
                    <div>
                      <button onClick={() => modal()}>Editar</button>
                      <button
                        onClick={() =>
                          eliminarActividad(itemSeleccionado.id_actividades)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {modalA && (
                <Modal
                  titulo={"Editar Actividad"}
                  inputs={[
                    {
                      nombre: "Nombre Actividad",
                      type: "text",
                      value: nombre ?? "",
                      onChange: (e) => setNombre(e.target.value),
                    },
                    {
                      nombre: "Descripcion",
                      type: "text",
                      value: descripcion ?? "",
                      onChange: (e) => setDescripcion(e.target.value),
                    },
                    {
                      nombre: "Porcentaje",
                      type: "text",
                      value: porcentaje ?? "",
                      onChange: (e) => setPorcentaje(e.target.value),
                    },
                    {
                      nombre: "Fecha inicio",
                      type: "date",
                      value: fecha_inicio ?? "",
                      onChange: (e) => setFecha_inicio(e.target.value),
                    },
                    {
                      nombre: "Fecha fin",
                      type: "date",
                      value: fecha_fin ?? "",
                      onChange: (e) => setFecha_fin(e.target.value),
                    },
                  ]}
                  acciones={[
                    { nombre: "Guardar", click: () => actualizarActividad() },
                    { nombre: "cerrar", click: () => cerrar() },
                  ]}
                  select={[
                    {
                      nombre: "Materia",
                      value: materiaP ?? 0,
                      onChange: (e) => setMateriaP(e.target.value),
                      opciones: MateriaProfesor.map((item) => ({
                        value: item.id_materia_profesores,
                        title: item.materia_nombre,
                      })),
                    },
                    {
                      nombre: "Periodo",
                      value: periodo ?? 0,
                      onChange: (e) => setPeriodo(e.target.value),
                      opciones: [
                        { value: 1, title: "periodo 1" },
                        { value: 2, title: "periodo 2" },
                        { value: 3, title: "periodo 3" },
                        { value: 4, title: "periodo 4" },
                      ],
                    },
                    {
                      nombre: "Tipo actividad",
                      value: tipoA ?? 0,
                      onChange: (e) => setTipoA(e.target.value),
                      opciones: [
                        { value: 1, title: "Examen" },
                        { value: 2, title: "Taller" },
                        { value: 3, title: "Tarea" },
                      ],
                    },
                  ]}
                  SalirM={() => cerrar()}
                />
              )}
              {ActividadesA.map((item, index) => (
                <div
                  className="actividadCard"
                  key={index}
                  onClick={() => EliminarOEditar(item)}
                >
                  <h3 className="actividadTitulo">{item.nombre}</h3>

                  <p>
                    <strong>Tipo:</strong> {item.Tipo_Actividad}
                  </p>
                  <p>
                    <strong>Porcentaje:</strong> {item.porcentaje}%
                  </p>

                  <p>
                    <strong>Fecha Inicio/Fin:</strong> {item.fecha_inicio} →{" "}
                    {item.fecha_fin}
                  </p>

                  <p>
                    <strong>Materia:</strong>{" "}
                    {item.MateriaProfesores.materia_nombre}
                  </p>
                  <p>
                    <strong>Curso:</strong>{" "}
                    {item.MateriaProfesores.curso_nombre}
                  </p>

                  <p>
                    <strong>Profesor:</strong>{" "}
                    {item.MateriaProfesores.profesor_nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Crear actividades 📒":
        return (
          <div className="crearActividadContenedorFull">
            <h1 className="TituloCrearActividad">Crear nueva actividad</h1>

            <form
              className="formCrearActividad"
              onSubmit={(e) => PostActividades(e)}
            >
              <div className="formCrearActividad">
                <div className="campoActividad">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre de la actividad"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="campoActividad">
                  <label>Descripción</label>
                  <textarea
                    placeholder="Descripción..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>

                <div className="campoActividad">
                  <label>Porcentaje</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 4.5"
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(e.target.value)}
                  />
                </div>

                <div className="filaActividad">
                  <div className="campoActividad">
                    <label>Fecha inicio</label>
                    <input
                      type="date"
                      value={fecha_inicio}
                      onChange={(e) => setFecha_inicio(e.target.value)}
                    />
                  </div>

                  <div className="campoActividad">
                    <label>Fecha fin</label>
                    <input
                      type="date"
                      value={fecha_fin}
                      onChange={(e) => setFecha_fin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="campoActividad">
                  <label>Tipo actividad</label>
                  <select
                    value={tipoA}
                    onChange={(e) => setTipoA(e.target.value)}
                  >
                    <option hidden>Seleccione...</option>
                    <option value={1}>Examen</option>
                    <option value={2}>Taller</option>
                    <option value={3}>Tarea</option>
                  </select>
                </div>

                <div className="campoActividad">
                  <label>Periodo académico</label>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option hidden>Seleccione...</option>
                    <option value={1}>1 periodo</option>
                    <option value={2}>2 periodo</option>
                    <option value={3}>3 periodo</option>
                    <option value={4}>4 periodo</option>
                  </select>
                </div>

                <div className="campoActividad">
                  <label>Materia / Profesor</label>
                  <select
                    value={materiaP}
                    onChange={(e) => setMateriaP(e.target.value)}
                  >
                    <option hidden>Seleccione...</option>
                    {MateriaProfesor.map((item, index) => (
                      <option key={index} value={item.id_materia_profesores}>
                        {item.materia_nombre} / {item.curso_nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="btnCrearActividad" type="submit">
                Guardar actividad
              </button>
            </form>
          </div>
        );

      case "Calificar ✏️":
        return (
          <div className="calificarContenedorFull">
            <h1 className="TituloCalificar">Calificar actividad</h1>

            <div className="formCalificar">
              <div className="campoCalificar">
                <div className="SeleccionarMaterias">
                  <div>
                    <label>Materia</label>
                    <select
                      value={materiaseleccionada}
                      onChange={(e) => setMateriaseleccionada(e.target.value)}
                    >
                      <option hidden>seleciona...</option>
                      {MateriasAsignadaP.map((item, index) => (
                        <option key={index} value={item.materia_nombre}>
                          {item.materia_nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Curso</label>
                    <select
                      value={cursoseleccionada}
                      onChange={(e) => setCursoseleccionada(e.target.value)}
                    >
                      <option hidden>seleciona...</option>
                      {filter.map((item, index) => (
                        <option key={index} value={item.curso_nombre}>
                          {item.curso_nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <label>Documento del estudiante</label>
                <Select
                  className="SelectA"
                  classNamePrefix="selectA"
                  isDisabled={!cursoseleccionada}
                  value={
                    filtroparaselect.find((e) => e.value === DocumentoE) || null
                  }
                  options={filtroparaselect}
                  onChange={(option) => setDocumentoE(option?.value || "")}
                  placeholder="Seleccione un estudiante..."
                  isClearable
                />
              </div>

              <div className="campoCalificar">
                <label>Seleccione actividad</label>
                <select disabled={!cursoseleccionada}>
                  <option hidden>Seleccione...</option>
                  {filtroActividad.map((item, index) => (
                    <option key={index} value={item.id_actividades}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campoCalificar">
                <label>Calificación</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 4,5"
                  className="inputsA"
                  disabled={!cursoseleccionada}
                />
              </div>

              <button className="btnCalificar">Guardar calificación</button>
            </div>
          </div>
        );
    }
  };
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div className="ActividadesContainer">
        {currentSubSection ? (
          render()
        ) : (
          <>
            <h1 className="TituloActividades">Actividades</h1>
            <div className="ActividadesContenedor2">
              {Sections.map((item, index) => (
                <div
                  className="TargetaActividades"
                  key={index}
                  onClick={() => setCurrentSubSection(item.nombre)}
                >
                  <h2>{item.nombre}</h2>
                  <p>{item.descripcion}</p>
                  <button onClick={() => setCurrentSubSection(item.nombre)}>
                    Ingresar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Actividades;
