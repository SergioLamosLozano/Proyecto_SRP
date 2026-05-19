import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/Definitivas.css";
import { TraerMateriasProfesor, ObtenerDefinitivas } from "../api/cursos";
import { Alert } from "../utils/alert";

export default function DefinitivasModal() {
  const [listaDefinitivas, setListaDefinitivas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estados heredados para la selección interactiva
  const [idProfe, setIdProfe] = useState("");
  const [modal, setModal] = useState(false);
  const [modalSeleccionCurso, setModalSeleccionCurso] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState([]);
  const [textoSeleccion, setTextoSeleccion] = useState(
    "No se ha seleccionado ninguna asignatura",
  );

  // Payloads limpios para Django
  const [idCursoPayload, setIdCursoPayload] = useState(null);
  const [idMateriaPayload, setIdMateriaPayload] = useState(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(1);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIdProfe(decoded.username);
      cargarMateriasDelProfesor(decoded.username);
    }
  }, []);

  const cargarMateriasDelProfesor = async (profesorUsername) => {
    try {
      const res = await TraerMateriasProfesor(profesorUsername);
      setMaterias(res.data);
    } catch (error) {
      console.error("Error al cargar materias:", error);
    }
  };

  const handleFiltroMateria = (nombreMateria) => {
    const filter = materias.filter(
      (mat) => mat.nombre_materia === nombreMateria,
    );
    setMateriaSeleccionada(filter);
    setModalSeleccionCurso(true);
  };

  const handleSeleccionarCursoYMateria = (
    idMateriaProfesor,
    fkIdMateria,
    idCursoReal,
    stringLegible,
  ) => {
    setIdMateriaPayload(parseInt(fkIdMateria));
    setIdCursoPayload(parseInt(idCursoReal));
    setTextoSeleccion(stringLegible);

    setModalSeleccionCurso(false);
    setModal(false);
  };

  const handleProcesarLoteDefinitivas = async (modoConsulta) => {
    if (!idCursoPayload || !idMateriaPayload || !periodoSeleccionado) {
      Alert(
        "error",
        "Por favor selecciona una materia y un curso usando el menú interactivo.",
      );
      return;
    }

    setCargando(true);
    try {
      const payload = {
        id_curso: idCursoPayload,
        fk_id_materia: idMateriaPayload,
        fk_id_periodo: parseInt(periodoSeleccionado),
        consulta: modoConsulta,
      };

      const response = await ObtenerDefinitivas(payload);

      if (Array.isArray(response.data)) {
        setListaDefinitivas(response.data);
        if (modoConsulta === "crear") {
          Alert(
            "success",
            `¡Mapeo completado! Definitivas guardadas con éxito.`,
          );
        }
      } else {
        setListaDefinitivas([]);
      }
    } catch (error) {
      console.error(error);
      Alert(
        "error",
        error.response?.data || "Error en el procesamiento en bloque.",
      );
    } finally {
      setCargando(false);
    }
  };

  // Sub-componente modal heredado para mantener compatibilidad con tu diseño actual
  const ComponenteModalMaterias = () => {
    return (
      <div className="modal-fondo-negro">
        {modalSeleccionCurso ? (
          <div className="modal-campos-materias">
            <div className="modal-campos-materias-titulo">
              <h1>Seleccione un curso</h1>
              <p
                onClick={() => setModalSeleccionCurso(false)}
                style={{ cursor: "pointer" }}
              >
                X
              </p>
            </div>
            <div className="modal-campos-materias-selecionar-materia-2">
              {materiaSeleccionada.length > 0 ? (
                materiaSeleccionada.map((item, index) => (
                  <div
                    key={index}
                    className="modal-campos-materias-selecionar-materia-2-cursos"
                  >
                    {item.cursos.map((item2, index2) => (
                      <div
                        key={index2}
                        onClick={() =>
                          handleSeleccionarCursoYMateria(
                            item2.id_materia_profesores,
                            item.fk_id_materia,
                            item2.id_curso || item2.fk_id_curso,
                            `${item.nombre_materia} • ${item2.nombre_curso}`,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          ID Materia: <label>{item.fk_id_materia}</label>
                        </span>
                        <span>
                          Materia: <label>{item.nombre_materia}</label>
                        </span>
                        <span>
                          Curso: <label>{item2.nombre_curso}</label>
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>
                  <h1>No se seleccionó ninguna materia</h1>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modal-campos-materias">
            <div className="modal-campos-materias-titulo">
              <h1>Seleccione una materia</h1>
              <p onClick={() => setModal(false)} style={{ cursor: "pointer" }}>
                X
              </p>
            </div>
            <div className="modal-campos-materias-selecionar-materia">
              {materias.length ? (
                materias.map((item, index) => (
                  <div
                    key={index}
                    className="modal-campos-materias-selecionar-materia-tarjeta"
                    onClick={() => handleFiltroMateria(item.nombre_materia)}
                    style={{ cursor: "pointer" }}
                  >
                    <h2>{item.nombre_materia}</h2>
                  </div>
                ))
              ) : (
                <div>
                  <h1>No hay materias para mostrar</h1>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="definitivas-contenedor-padre">
      <div className="definitivas-contenedor">
        <div className="definitivas-titulo">
          <h1>Generador Masivo de Definitivas</h1>
          <p>
            Mapea y procesa las notas finales de todo un grupo de manera
            automática.
          </p>
        </div>

        {/* Panel de criterios estilizado mediante clases CSS */}
        <div className="definitivas-explicacion-contenedor">
          <div className="definitivas-filtros-grid">
            {/* Campo de asignación académica */}
            <div className="definitivas-campo-grupo">
              <label>Asignación Académica</label>
              <div className="definitivas-selector-wrapper">
                <button
                  className="definitivas-btn definitivas-btn-secundario"
                  onClick={() => setModal(true)}
                >
                  🔍 Buscar Cátedra
                </button>
                <input
                  readOnly
                  value={textoSeleccion}
                  className="definitivas-input-vista"
                />
              </div>
            </div>

            {/* Campo del Periodo */}
            <div
              className="definitivas-campo-grupo"
              style={{ flex: "0 0 180px" }}
            >
              <label>Periodo Escolar</label>
              <select
                value={periodoSeleccionado}
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                className="definitivas-select-periodo"
              >
                <option value={1}>Periodo 1</option>
                <option value={2}>Periodo 2</option>
              </select>
            </div>
          </div>

          {/* Botones de acción inferiores dentro del panel */}
          <div className="definitivas-acciones-wrapper">
            <button
              className="definitivas-btn definitivas-btn-secundario"
              onClick={() => handleProcesarLoteDefinitivas("consulta")}
              disabled={cargando}
            >
              Ver Registros Existentes
            </button>
            <button
              className="definitivas-btn definitivas-btn-primario"
              onClick={() => handleProcesarLoteDefinitivas("crear")}
              disabled={cargando}
            >
              {cargando ? "Calculando..." : "⚡ Mapear y Guardar Definitivas"}
            </button>
          </div>
        </div>

        {/* Tabla de Rendimiento Académico */}
        <div className="tabla-definitivas">
          <table className="definitivas-html-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Estudiante</th>
                <th style={{ textAlign: "center" }}>Nota Final</th>
                <th style={{ textAlign: "center" }}>Estado Académico</th>
              </tr>
            </thead>
            <tbody>
              {listaDefinitivas.length > 0 ? (
                listaDefinitivas.map((item, index) => {
                  const esReprobado =
                    item.estado?.toLowerCase() === "reprobado";
                  return (
                    <tr key={index}>
                      <td>
                        {item.documento_estudiante ||
                          item.fk_id_estudiantes_cursos}
                      </td>
                      <td>{item.nombre_estudiante || "Alumno Activo"}</td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>
                        {item.valor_definitiva}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`definitivas-badge ${
                            esReprobado ? "reprobado" : "aprobado"
                          }`}
                        >
                          {item.estado ? item.estado : "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--gris-secundario)",
                    }}
                  >
                    No hay información en pantalla. Selecciona los criterios
                    superiores para consultar o calcular.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ComponenteModalMaterias />}
    </div>
  );
}
