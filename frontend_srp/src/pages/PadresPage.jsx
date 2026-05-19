import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/PadresPage.css";
import "../styles/Table.css";
import Logout from "../components/Logout";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Table from "../components/Table";
import { padresAPI } from "../api/usuarios";
import {
  Estudiantes_notas,
  Estudiantes_notas_por_periodo,
} from "../api/cursos";
import { jwtDecode } from "jwt-decode";
import { Periodos, PeriodoById } from "../api/cursos";

function PadresPage() {
  const [vista, setVista] = useState("inicio");
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [periodoSel, setPeriodoSel] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [actividadesPorMateria, setActividadesPorMateria] = useState({});
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarEstudiantesVinculados = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No se encontró token de sesión.");
          return;
        }

        // Decodificar el token → obtener username (número de documento del acudiente)
        const decoded = jwtDecode(token);
        const acudienteId = decoded?.username;

        if (!acudienteId) {
          setError("No se encontró identificador de acudiente en el token.");
          return;
        }

        // Llamar a la API: busca coincidencia entre user_name y número_documento_acudiente
        const response = await padresAPI(acudienteId);

        // Guardar los estudiantes vinculados
        const lista = response.data.estudiantes_relacionados || [];
        setEstudiantes(lista);
        setFiltrados(lista); // importante: inicializa los filtrados también
      } catch (e) {
        console.error("Error al cargar estudiantes:", e);
        setError("Error cargando estudiantes vinculados.");
      } finally {
        setLoading(false);
      }
    };

    cargarEstudiantesVinculados();
  }, []);

  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const resp = await Periodos();
        let lista = resp?.data?.results || resp?.data || [];
        if (!Array.isArray(lista)) lista = [];
        setPeriodos(lista);
        if (!lista || lista.length === 0) {
          const token = sessionStorage.getItem("token");
          const decoded = token ? jwtDecode(token) : null;
          const acudienteId = decoded?.username;
          if (acudienteId && estudiantes.length > 0) {
            const doc =
              estudiantes[0].numero_documento ||
              estudiantes[0].numero_documento_estudiante;
            await ensurePeriodos(doc);
            return;
          }
        }
        if (lista.length && !periodoSel) {
          setPeriodoSel(lista[0].id_periodo || lista[0].id);
        }
      } catch (e) {}
    };
    cargarPeriodos();
  }, []);

  const cargarNotas = async (doc, periodoId) => {
    try {
      setLoadingNotas(true);
      const resp = periodoId
        ? await Estudiantes_notas_por_periodo(doc, periodoId)
        : await Estudiantes_notas(doc);
      const data = resp.data || [];
      setNotas(data);
      const porMateriaActs = {};
      const porMateria = {};
      for (const n of data) {
        const act = n.actividad;
        const mat = act?.MateriaProfesores?.materia_nombre || "";
        const porc = parseFloat(act?.porcentaje || 0);
        const cal = parseFloat(n.calificacion || 0);
        const actId = act?.id_actividades || act?.id;
        const actNombre = act?.nombre || "";
        if (!porMateriaActs[mat]) porMateriaActs[mat] = [];
        porMateriaActs[mat].push({
          id: actId,
          nombre: actNombre,
          porcentaje: porc,
          calificacion: cal,
        });
        if (!porMateria[mat]) {
          porMateria[mat] = { suma: 0, totalPorc: 0 };
        }
        porMateria[mat].suma += cal * (porc / 100);
        porMateria[mat].totalPorc += porc;
      }
      setActividadesPorMateria(porMateriaActs);
      // Set first subject as selected by default
      const materias = Object.keys(porMateriaActs);
      if (materias.length > 0) {
        setMateriaSeleccionada(materias[0]);
      }
      const resumen = Object.entries(porMateria).map(([materia, v]) => ({
        materia,
        definitiva: Number(v.suma.toFixed(2)),
      }));
      setCalificaciones(resumen);
    } catch (e) {
      setNotas([]);
      setCalificaciones([]);
    } finally {
      setLoadingNotas(false);
    }
  };

  const ensurePeriodos = async (doc) => {
    try {
      if (periodos.length > 0) return;
      const resp = await Periodos();
      let lista = resp.data || [];
      if (!lista.length) {
        const notasResp = await Estudiantes_notas(doc);
        const ns = notasResp.data || [];
        const ids = Array.from(
          new Set(
            ns.map((n) => n?.actividad?.fk_id_periodo_academico).filter(Boolean)
          )
        );
        const detalles = [];
        for (const id of ids) {
          try {
            const r = await PeriodoById(id);
            detalles.push(r.data);
          } catch (e) {
            detalles.push({ id_periodo: id, fecha_inicio: "", fecha_fin: "" });
          }
        }
        lista = detalles;
      }
      setPeriodos(lista);
      if (lista.length && !periodoSel) {
        setPeriodoSel(lista[0].id_periodo || lista[0].id);
      }
    } catch (e) {
      // noop
    }
  };

  return (
    <div className="dashboard padres-page">
      <Logout />

      <div className="dashboard-content-1 padres-content">
        <main className="content padres-scroll">
          {vista === "inicio" && (
            <div className="padres-container">
              <div className="padres-hero">
                <h1>Padres de Familia</h1>
                <p>Consulta de calificaciones y notas del estudiante</p>
              </div>

              {/* Solo dejamos la lista de estudiantes vinculados */}

              <div className="card wide" style={{ marginTop: 20 }}>
                <h3>Estudiantes vinculados</h3>
                {loading ? (
                  <p>Cargando...</p>
                ) : error ? (
                  <p style={{ color: "#b02a37" }}>{error}</p>
                ) : estudiantes.length === 0 ? (
                  <p>No hay estudiantes vinculados a su cuenta.</p>
                ) : (
                  <Table
                    id="EstudiantesAcudientes"
                    title=""
                    columns={[
                      {
                        key: "numero_documento",
                        label: "Documento",
                      },
                      { key: "nombre_completo", label: "Nombre" },
                    ]}
                    data={filtrados}
                    searchPlaceholder="Buscar por documento..."
                    actions={[
                      {
                        label: "Ver Calificaciones",
                        className: "table-action-btn btn-primary",
                        title: "Ver calificaciones del estudiante",
                        onClick: async (est) => {
                          setEstudianteSeleccionado(est);
                          setVista("calificaciones");
                          const pid = periodoSel;
                          const doc =
                            est.numero_documento ||
                            est.numero_documento_estudiante;
                          ensurePeriodos(doc);
                          cargarNotas(doc, pid);
                        },
                      },
                      {
                        label: "Ver Notas",
                        className: "table-action-btn btn-secondary",
                        title: "Ver notas del estudiante",
                        onClick: async (est) => {
                          setEstudianteSeleccionado(est);
                          setVista("notas");
                          const pid = periodoSel;
                          const doc =
                            est.numero_documento ||
                            est.numero_documento_estudiante;
                          ensurePeriodos(doc);
                          cargarNotas(doc, pid);
                        },
                      },
                    ]}
                    filtroParaEstudiantePadres={filtrados}
                  />
                )}
              </div>
            </div>
          )}

          {vista === "calificaciones" && (
            <div className="padres-container">
              <div className="card wide">
                <h3>Calificaciones</h3>
                <p>
                  Estudiante: {estudianteSeleccionado?.nombre_completo} (
                  {estudianteSeleccionado?.numero_documento_estudiante})
                </p>
                <div className="periodo-selector-container">
                  <select
                    className="gestion-academica-select"
                    value={periodoSel || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriodoSel(v);
                      const doc =
                        estudianteSeleccionado?.numero_documento ||
                        estudianteSeleccionado?.numero_documento_estudiante;
                      cargarNotas(doc, v);
                    }}
                  >
                    {periodos.length === 0 ? (
                      <option value="" disabled>
                        Sin periodos
                      </option>
                    ) : (
                      periodos.map((p) => (
                        <option
                          key={p.id_periodo || p.id}
                          value={p.id_periodo || p.id}
                        >
                          {p.fecha_inicio} - {p.fecha_fin}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {loadingNotas ? (
                  <p>Cargando...</p>
                ) : (
                  <div className="preview-table-wrapper">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Materia</th>
                          <th>Definitiva</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calificaciones.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.materia}</td>
                            <td>{row.definitiva}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button
                  className="btn-volver"
                  onClick={() => setVista("inicio")}
                >
                  Volver
                </button>
              </div>
            </div>
          )}

          {vista === "notas" && (
            <div className="padres-container">
              <div className="card wide">
                <h3>Consulta de notas</h3>
                <p>
                  Estudiante: {estudianteSeleccionado?.nombre_completo} (
                  {estudianteSeleccionado?.numero_documento_estudiante})
                </p>
                <div className="periodo-selector-container">
                  <select
                    className="gestion-academica-select"
                    value={periodoSel || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPeriodoSel(v);
                      const doc =
                        estudianteSeleccionado?.numero_documento ||
                        estudianteSeleccionado?.numero_documento_estudiante;
                      cargarNotas(doc, v);
                    }}
                  >
                    {periodos.length === 0 ? (
                      <option value="" disabled>
                        Sin periodos
                      </option>
                    ) : (
                      periodos.map((p) => (
                        <option
                          key={p.id_periodo || p.id}
                          value={p.id_periodo || p.id}
                        >
                          {p.fecha_inicio} - {p.fecha_fin}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {loadingNotas ? (
                  <p>Cargando...</p>
                ) : Object.keys(actividadesPorMateria).length === 0 ? (
                  <p>No hay actividades registradas para este periodo.</p>
                ) : (
                  <div className="notas-panel-container">
                    {/* Lista de materias */}
                    <div className="materias-list">
                      {Object.keys(actividadesPorMateria).map((materia) => (
                        <button
                          key={materia}
                          className={
                            materiaSeleccionada === materia
                              ? "materia-btn active"
                              : "materia-btn"
                          }
                          onClick={() => setMateriaSeleccionada(materia)}
                        >
                          {materia}
                        </button>
                      ))}
                    </div>

                    {/* Actividades de la materia seleccionada */}
                    {materiaSeleccionada && (
                      <div className="actividades-detail">
                        <h4>{materiaSeleccionada}</h4>
                        <div className="preview-table-wrapper">
                          <table className="preview-table">
                            <thead>
                              <tr>
                                <th>Actividad</th>
                                <th>Porcentaje</th>
                                <th>Calificación</th>
                              </tr>
                            </thead>
                            <tbody>
                              {actividadesPorMateria[materiaSeleccionada].map(
                                (actividad) => (
                                  <tr key={actividad.id}>
                                    <td>{actividad.nombre}</td>
                                    <td>{actividad.porcentaje}%</td>
                                    <td>{actividad.calificacion}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  className="btn-volver btn-with-top-spacing"
                  onClick={() => setVista("inicio")}
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default PadresPage;
