import { useEffect, useState } from "react";
import "../styles/modificarnota.css";
import {
  Calificar_Estudiante_buscar_estudiante,
  Modificar_Nota_estudiante,
} from "../api/cursos";
import { Alert } from "../utils/alert";

function ModificarNota({ listaRA }) {
  const [RA, setRA] = useState("");
  const [Estudiante, setEstudiante] = useState("");
  const [Actividad, setActividad] = useState("");
  const [NuevaNota, setNuevaNota] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [EstudianteTraido, setEstudianteTraido] = useState([]);
  const [actividadseleccionada, setActividadSeleccionada] = useState([]);

  const filtroActividad = () => {
    const filtro = EstudianteTraido.find(
      (est) => est.fk_id_actividad === Number(Actividad),
    );
    setActividadSeleccionada(filtro);
  };

  useEffect(() => {
    if (Actividad != "") {
      filtroActividad();
    }
  }, [Actividad]);

  const manejarCambio = (e) => {
    const texto = e.target.value;

    // Solo números
    if (/^\d*$/.test(texto)) {
      setEstudiante(texto);
    }
  };

  const buscar_estudinte = async () => {
    if (!Estudiante) {
      return Alert("info", "Llene el campo documento estudiante");
    }
    const res = await Calificar_Estudiante_buscar_estudiante(Estudiante, RA);

    console.log(res.data);
    setEstudianteTraido(res.data);
  };

  const Modificar_Nota = async () => {
    if (!RA || !Estudiante || !Actividad || !NuevaNota || !Descripcion) {
      return Alert("info", "Llene todos los campos requeridos porfavor");
    }
    const res = await Modificar_Nota_estudiante(
      parseInt(actividadseleccionada.id_estudiante_notas),
      {
        nota_anterior: parseFloat(actividadseleccionada.calificacion),
        nota_nueva: NuevaNota,
        motivo_cambio: Descripcion,
        fk_nota_estudiante: actividadseleccionada.id_estudiante_notas,
      },
    );
  };

  return (
    <div className="modificar-nota-contenedor">
      <div className="modificar-nota-contenedor-titulo">
        <h1>Modificar Nota</h1>
        <p>
          ¡modifica la notas de los estudiantes en los diferentes R.A y
          actividades!
        </p>
      </div>
      <div className="modificar-nota-contenedor-campos-requeridos">
        <div className="modificar-nota-campos-requeridos">
          <div className="modificar-nota-campos-requeridos-informacion">
            <h1>informacion</h1>
            <p>
              Para realizar el cambio de nota debe selecciona primero un R.A y
              luego busca el estudiante a calificar, seleccione una actividad, y
              coloque el motivo por el cual se esta haciendo este cambio de nota
            </p>
          </div>
          <section className="modificar-nota-campos-requeridos-sections">
            <label>Resultados de aprendizaje</label>
            <select
              className="modificar-nota-campos-requeridos-sections"
              value={RA}
              onChange={(e) => setRA(e.target.value)}
            >
              <option hidden>Seleccione una opcion</option>
              {listaRA.map((item, index) => (
                <option key={index} value={item.id_ra}>
                  {item.nombre_ra} / {item.materia}
                </option>
              ))}
            </select>
          </section>
          <section className="modificar-nota-campos-requeridos-sections">
            <label>Documento estudiante</label>
            <input
              placeholder="Documento"
              value={Estudiante}
              onChange={manejarCambio}
              disabled={RA == ""}
            />
            <div
              className={`modificar-nota-campos-requeridos-sections-lupa ${
                RA == "" ? "disabled" : ""
              }`}
              onClick={() => buscar_estudinte()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 485.213 485.213"
              >
                <path
                  d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324
			c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z"
                />
                <path
                  d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951
			C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46
			c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465
			C318.424,257.208,257.206,318.416,181.956,318.416z"
                />
                <path d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" />
              </svg>
            </div>
          </section>
          <section className="modificar-nota-campos-requeridos-sections">
            <label>Actividades</label>
            <select
              value={Actividad}
              onChange={(e) => setActividad(e.target.value)}
              disabled={EstudianteTraido.length === 0}
            >
              <option hidden value="">
                Seleccione una opción
              </option>

              {EstudianteTraido.map((item) => (
                <option
                  key={item.id_estudiante_notas}
                  value={item.fk_id_actividad}
                >
                  {`${item.nombre_actividad} / ${item.nombre_grado}`}
                </option>
              ))}
            </select>
          </section>
          <section className="modificar-nota-campos-requeridos-sections">
            <label>Nueva Nota</label>
            <input
              placeholder="Nota"
              type="number"
              step="0.1"
              value={NuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              disabled={Actividad == ""}
            />
          </section>
          <section className="modificar-nota-campos-requeridos-sections">
            <label>Motivo de cambio</label>
            <textarea
              placeholder="Cual es el motivo por lo cual se va hacer el cambio de nota"
              value={Descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={Actividad == ""}
            ></textarea>
          </section>
        </div>
        <div className="modificar-nota-descripciones">
          <div>
            <h1 className="modificar-nota-descripciones-titulo-estudiantes">
              Descripcion Estudiante
            </h1>
            {EstudianteTraido.length > 0 ? (
              <div className="modificar-nota-descripciones-contenedor-1">
                <span>
                  Nombre:{" "}
                  <label>
                    {EstudianteTraido[0].nombre_completo_estudiante}
                  </label>
                </span>
                <span>
                  Documento:{" "}
                  <label>
                    {EstudianteTraido[0].fk_numero_documento_estudiante}
                  </label>
                </span>
                <span>
                  Grado: <label>{EstudianteTraido[0].nombre_grado}</label>
                </span>
              </div>
            ) : (
              <div className="modificar-nota-descripciones-contenedor-1-sin-estudiantes">
                <h1>No hay estudiantes, por favor busque uno</h1>
              </div>
            )}
          </div>
          <div className="modificar-nota-descripciones-contenedor-2">
            <h1 className="modificar-nota-descripciones-titulo-estudiantes">
              Descripcion Actividad
            </h1>
            {Actividad ? (
              <div className="modificar-nota-descripciones-contenedor-1">
                <span>
                  Nombre:{" "}
                  <label>{actividadseleccionada.nombre_actividad}</label>
                </span>
                <span>
                  Calificacion Estudiante:{" "}
                  <label>{actividadseleccionada.calificacion}</label>
                </span>
                <span>
                  Materia: <label>{actividadseleccionada.nombre_materia}</label>
                </span>
                <span>
                  Descripcion:{" "}
                  <label>{actividadseleccionada.descripcion_actividad}</label>
                </span>
              </div>
            ) : (
              <div className="modificar-nota-descripciones-contenedor-1-sin-estudiantes">
                <h1>No hay Actividades, por favor seleccione una</h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modificar-nota-contenedor-campos-requeridos-boton">
        <button onClick={() => Modificar_Nota()}>Registrar Nota</button>
      </div>
    </div>
  );
}

export default ModificarNota;
