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
  Estudiantes_definitivas,
  ObtenerEstadoBoletines,
} from "../api/cursos";
import { jwtDecode } from "jwt-decode";
import { Periodos, PeriodoById } from "../api/cursos";
import { Alert } from "../utils/alert";
import Swal from "sweetalert2";
import { nombrePeriodo } from "../utils/periodo";

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
  
  // Estados para descarga de boletines
  const [descargaBoletinesHabilitada, setDescargaBoletinesHabilitada] = useState(true);
  const [loadingBoletin, setLoadingBoletin] = useState(false);

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

  // Cargar estado de descarga de boletines
  useEffect(() => {
    const cargarEstadoBoletines = async () => {
      try {
        const response = await ObtenerEstadoBoletines();
        setDescargaBoletinesHabilitada(response.descarga_habilitada);
      } catch (error) {
        console.error('Error cargando estado de boletines:', error);
        // Por defecto, asumir que está habilitado
      }
    };
    
    cargarEstadoBoletines();
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
      
      // Cargar notas para las actividades
      const resp = periodoId
        ? await Estudiantes_notas_por_periodo(doc, periodoId)
        : await Estudiantes_notas(doc);
      const data = resp.data || [];
      setNotas(data);
      
      // Procesar actividades por materia
      const porMateriaActs = {};
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
      }
      setActividadesPorMateria(porMateriaActs);
      
      // Set first subject as selected by default
      const materias = Object.keys(porMateriaActs);
      if (materias.length > 0) {
        setMateriaSeleccionada(materias[0]);
      }
      
      // Cargar definitivas desde la base de datos (única fuente de verdad)
      // El backend SIEMPRE recalcula desde las notas, así que estos valores
      // son siempre correctos.
      if (periodoId) {
        try {
          const defResp = await Estudiantes_definitivas(doc, periodoId);
          const definitivas = defResp.data || [];
          const resumen = definitivas.map(def => ({
            materia: def.nombre_materia,
            definitiva: parseFloat(def.valor_definitiva),
            estado: def.estado
          }));
          setCalificaciones(resumen);
        } catch (e) {
          console.error('Error cargando definitivas:', e);
          setCalificaciones([]);
        }
      } else {
        setCalificaciones([]);
      }
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

  const descargarBoletin = async () => {
    if (!descargaBoletinesHabilitada) {
      Swal.fire({
        icon: 'warning',
        title: 'Descarga no disponible',
        text: 'La descarga de boletines está temporalmente deshabilitada. Por favor, contacte con la institución.',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }

    if (!periodoSel) {
      Alert('warning', 'Por favor seleccione un periodo');
      return;
    }

    if (!estudianteSeleccionado) {
      Alert('warning', 'No hay estudiante seleccionado');
      return;
    }

    try {
      setLoadingBoletin(true);
      
      const documento = estudianteSeleccionado.numero_documento || 
                       estudianteSeleccionado.numero_documento_estudiante;
      
      const url = `http://127.0.0.1:8000/api/reportes/boletines-pdf/?periodo=${periodoSel}&estudiante=${documento}&formato=individual`;

      // Necesitamos enviar el token JWT del padre porque el endpoint requiere auth
      const token = sessionStorage.getItem("token");
      const response = await fetch(url, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || 'Error al generar el boletín');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Boletin_${estudianteSeleccionado.nombre_completo}_Periodo_${periodoSel}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      Alert('success', 'Boletín descargado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      Alert('error', error.message || 'Error al descargar el boletín');
    } finally {
      setLoadingBoletin(false);
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
                          {nombrePeriodo(p, { includeFechas: true })}
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
                
                {/* Botón de descarga de boletín */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  display: 'flex', 
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={descargarBoletin}
                    disabled={!descargaBoletinesHabilitada || loadingBoletin || !periodoSel}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: descargaBoletinesHabilitada ? '#d32f2f' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: descargaBoletinesHabilitada && !loadingBoletin && periodoSel ? 'pointer' : 'not-allowed',
                      opacity: (!descargaBoletinesHabilitada || loadingBoletin || !periodoSel) ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (descargaBoletinesHabilitada && !loadingBoletin && periodoSel) {
                        e.target.style.backgroundColor = '#b71c1c';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (descargaBoletinesHabilitada && !loadingBoletin && periodoSel) {
                        e.target.style.backgroundColor = '#d32f2f';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📄</span>
                    {loadingBoletin ? 'Generando boletín...' : 'Descargar Boletín (PDF)'}
                  </button>
                  
                  {!descargaBoletinesHabilitada && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#fff3cd',
                      border: '1px solid #ffc107',
                      borderRadius: '8px',
                      color: '#856404',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: 1,
                      minWidth: '250px'
                    }}>
                      <span>⚠️</span>
                      <span>La descarga de boletines está temporalmente deshabilitada</span>
                    </div>
                  )}
                </div>
                
                <button
                  className="btn-volver"
                  onClick={() => setVista("inicio")}
                  style={{ marginTop: '1rem' }}
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
                          {nombrePeriodo(p, { includeFechas: true })}
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
