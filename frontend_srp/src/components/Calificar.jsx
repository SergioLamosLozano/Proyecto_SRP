import { useEffect, useState } from "react";
import "../styles/Calificacion.css";
import Swal from "sweetalert2";
import {
  Calificar_Estudiante,
  Estudiante_id_curso,
  TraerActividadesPorRA,
} from "../api/cursos";
import { Alert } from "../utils/alert";

function Calificar({ listaRAs }) {
  const [RA, setRA] = useState("");
  const [Actividades, setActividades] = useState([]);
  const [ActividadSeleccionada, setActividSeleccionada] = useState("");
  const [Actividadbuscada, setActividBuscada] = useState([]);
  const [Estudiantes, setEstudiantes] = useState([]);
  const [idActividad, setIdActividad] = useState("");
  const [calificacion, setCalificacion] = useState({});
  const tarea = [
    { nombre: "tarea", descripcion: "ecuaciones", curso: "Grado 6A" },
  ];

  const handleChange = (id, value) => {
    const numero = value === "" ? "" : Number(value);

    setCalificacion((prev) => ({
      ...prev,
      [id]: numero,
    }));
  };

  const res = async () => {
    const resp = await TraerActividadesPorRA(RA);
    setActividades(resp.data);
  };

  const calificar_estudiante = (id_estudiante) => {
    const nota = calificacion[id_estudiante];

    if (nota === undefined || nota === "" || nota < 0 || nota > 5) {
      return Alert("info", "la calificación debe estar entre 0 y 5");
    }
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await Calificar_Estudiante({
          fk_numero_documento_estudiante: id_estudiante,
          fk_id_actividad: ActividadSeleccionada,
          calificacion: nota,
        });

        console.log(res);
      }
    });
  };

  const filtroactividades = (idact) => {
    const filtro1 = Actividades.find((act) => act.id_actividades == idact);

    setActividBuscada(filtro1);
    TraerEstudiantesCurso(filtro1?.id_curso);
  };

  const TraerEstudiantesCurso = async (id) => {
    const res = await Estudiante_id_curso(id);
    setEstudiantes(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    if (ActividadSeleccionada != "") {
      filtroactividades(ActividadSeleccionada);
    }
  }, [ActividadSeleccionada]);

  useEffect(() => {
    if (RA != "") {
      res();
    }
  }, [RA]);

  return (
    <div className="libreta-calificar-contenedor-padre">
      <div className="libreta-calificar-titulo-adorno">
        <div className="libreta-calificar-titulo-adorno-2" />
      </div>
      <div className="libreta-calificar-contenedor">
        <div className="libreta-calificar-titulo">
          <h1>Calificaciones</h1>
          <p>¡Aqui podras calificar la actividad para cada estudiante!</p>
        </div>
        <div className="libreta-calificar-contenedor-seleccion">
          <div className="libreta-calificar-contenedor-seleccion-titulo">
            <h1>Seleccione un R.A y una actividad</h1>
            <p>
              Seleccione primero un R.A y despues podra seleccionar una
              actividad, y a continuacion apareceran los estudiantes a calificar
            </p>
          </div>
          <div className="libreta-calificar-contenedor-seleccion-inputs">
            <section>
              <label>Resultado de aperndizaje</label>
              <select value={RA} onChange={(e) => setRA(e.target.value)}>
                <option hidden>Seleccione una opcion</option>
                {listaRAs.map((item, index) => (
                  <option key={index} value={item.id_ra}>
                    {item.nombre_ra} / {item.materia}
                  </option>
                ))}
              </select>
            </section>
            <section>
              <section>
                <label>Actividades</label>
                <select
                  value={ActividadSeleccionada}
                  onChange={(e) => setActividSeleccionada(e.target.value)}
                  disabled={RA == ""}
                >
                  <option hidden>Seleccione una opcion</option>
                  {Actividades.map((item, index) => (
                    <option key={index} value={item.id_actividades}>
                      {item.descripcion || item.Tipo_Actividad}
                    </option>
                  ))}
                </select>
              </section>
            </section>
          </div>
          <div className="libreta-calificar-contenedor-seleccion-descripcion">
            <div className="libreta-calificar-contenedor-seleccion-descripcion-titulo">
              <h1 onClick={() => console.log(Actividadbuscada)}>
                Descripcion tarea
              </h1>
            </div>
            {ActividadSeleccionada ? (
              <div className="libreta-calificar-contenedor-seleccion-descripcion-tarea">
                <span>
                  titulo: <label>{Actividadbuscada?.nombre}</label>
                </span>
                <span>
                  descripcion: <label>{Actividadbuscada?.descripcion}</label>
                </span>
                <span>
                  curso: <label>{Actividadbuscada?.curso}</label>
                </span>
                <span>
                  Materia: <label>{Actividadbuscada?.materia}</label>
                </span>
                <span>
                  Fecha inicio: <label>{Actividadbuscada?.fecha_inicio}</label>
                </span>
              </div>
            ) : (
              <div className="libreta-calificar-contenedor-seleccion-descripcion-tarea-sin-tarea">
                <h1>Seleccione una actividad</h1>
              </div>
            )}
          </div>
        </div>
        <div className="libreta-calificar-contenedor-estudiantes">
          <h1>Estudiantes</h1>
          <div className="libreta-calificar-contenedor-estudiantes-lista">
            {Estudiantes.length > 0 ? (
              Estudiantes.map((item) => (
                <div
                  key={item.id_estudiantes_cursos}
                  className="libreta-calificar-contenedor-estudiantes-lista-calificar"
                >
                  <span>
                    Documento: <label>{item.numero_documento_estudiante}</label>
                  </span>
                  <span>
                    Nombre: <label>{item.estudiante.nombre}</label>
                  </span>
                  <span>
                    curso: <label>{item.nombre_curso}</label>
                  </span>
                  <span>
                    Nota:{" "}
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Ej: 4.5"
                      value={
                        calificacion[item.numero_documento_estudiante] ?? ""
                      }
                      onChange={(e) =>
                        handleChange(
                          item.numero_documento_estudiante,
                          e.target.value,
                        )
                      }
                    />
                  </span>
                  <button
                    className="libreta-calificar-contenedor-estudiantes-lista-calificar-boton"
                    onClick={() =>
                      calificar_estudiante(item.numero_documento_estudiante)
                    }
                  >
                    Realizar Calificacion
                  </button>
                </div>
              ))
            ) : (
              <h1 className="libreta-calificar-contenedor-estudiantes-lista-sin-estudiantes">
                No hay estudiantes
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calificar;
