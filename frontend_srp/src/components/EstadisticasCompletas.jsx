import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  obtenerEstadisticasGenerales,
  obtenerEstadisticasDemograficas,
  obtenerEstadisticasAcademicas,
  obtenerEstadisticasInstitucionales,
  obtenerEstadisticasComparativas,
  obtenerFiltrosDisponibles,
} from '../api/estadisticas';
import toast from 'react-hot-toast';
import '../styles/EstadisticasCompletas.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EstadisticasCompletas = ({ onBack }) => {
  // Estados para datos
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [estadisticasDemograficas, setEstadisticasDemograficas] = useState(null);
  const [estadisticasAcademicas, setEstadisticasAcademicas] = useState(null);
  const [estadisticasInstitucionales, setEstadisticasInstitucionales] = useState(null);
  const [estadisticasComparativas, setEstadisticasComparativas] = useState(null);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState(null);

  // Estados para filtros
  const [filtrosPeriodo, setFiltrosPeriodo] = useState('');
  const [filtrosCurso, setFiltrosCurso] = useState('');

  // Estados de carga
  const [cargando, setCargando] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState('general');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar estadísticas académicas cuando cambien los filtros
  useEffect(() => {
    if (seccionActiva === 'academicas') {
      cargarEstadisticasAcademicas();
    }
  }, [filtrosPeriodo, filtrosCurso]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [generales, demograficas, academicas, institucionales, comparativas, filtros] =
        await Promise.all([
          obtenerEstadisticasGenerales(),
          obtenerEstadisticasDemograficas(),
          obtenerEstadisticasAcademicas(),
          obtenerEstadisticasInstitucionales(),
          obtenerEstadisticasComparativas(),
          obtenerFiltrosDisponibles(),
        ]);

      setEstadisticasGenerales(generales);
      setEstadisticasDemograficas(demograficas);
      setEstadisticasAcademicas(academicas);
      setEstadisticasInstitucionales(institucionales);
      setEstadisticasComparativas(comparativas);
      setFiltrosDisponibles(filtros);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticasAcademicas = async () => {
    try {
      const filtros = {};
      if (filtrosPeriodo) filtros.periodo_id = filtrosPeriodo;
      if (filtrosCurso) filtros.curso_id = filtrosCurso;

      const academicas = await obtenerEstadisticasAcademicas(filtros);
      setEstadisticasAcademicas(academicas);
    } catch (error) {
      console.error('Error al cargar estadísticas académicas:', error);
      toast.error('Error al cargar estadísticas académicas');
    }
  };

  // Colores para gráficas
  const colores = {
    primario: ['#dc3545', '#c82333', '#a71d2a', '#8b1924', '#6f141d'],
    secundario: ['#28a745', '#218838', '#1e7e34', '#19692c', '#155724'],
    terciario: ['#007bff', '#0069d9', '#0056b3', '#004085', '#003366'],
    cuaternario: ['#ffc107', '#e0a800', '#c69500', '#a67c00', '#8b6914'],
    variados: [
      '#dc3545', '#28a745', '#007bff', '#ffc107', '#17a2b8',
      '#6610f2', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
    ]
  };

  // Función para preparar datos de gráfica circular
  const prepararDatosCirculares = (datos, campoLabel, campoCantidad) => {
    if (!datos || datos.length === 0) return null;

    const labels = datos.map(item => item[campoLabel] || 'Sin especificar');
    const values = datos.map(item => item[campoCantidad]);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colores.variados,
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };

  // Función para preparar datos de gráfica de barras
  const prepararDatosBarras = (datos, campoLabel, campoCantidad, titulo = 'Cantidad') => {
    if (!datos || datos.length === 0) return null;

    const labels = datos.map(item => item[campoLabel] || 'Sin especificar');
    const values = datos.map(item => item[campoCantidad]);

    return {
      labels,
      datasets: [
        {
          label: titulo,
          data: values,
          backgroundColor: colores.primario[0],
          borderColor: colores.primario[1],
          borderWidth: 1,
        },
      ],
    };
  };

  // Opciones comunes para gráficas
  const opcionesGraficas = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  // Renderizar tarjetas de resumen
  const renderTarjetasResumen = () => {
    if (!estadisticasGenerales) return null;

    const tarjetas = [
      {
        titulo: 'Total Estudiantes',
        valor: estadisticasGenerales.totales.estudiantes,
        subtitulo: `${estadisticasGenerales.totales.estudiantes_activos} activos`,
        icono: '👥',
        color: '#dc3545',
      },
      {
        titulo: 'Total Profesores',
        valor: estadisticasGenerales.totales.profesores,
        subtitulo: `${estadisticasGenerales.totales.profesores_activos} activos`,
        icono: '👨‍🏫',
        color: '#28a745',
      },
      {
        titulo: 'Cursos Activos',
        valor: estadisticasGenerales.totales.cursos,
        subtitulo: `${estadisticasGenerales.totales.materias} materias`,
        icono: '📚',
        color: '#007bff',
      },
      {
        titulo: 'Promedio General',
        valor: estadisticasGenerales.academico.promedio_general.toFixed(2),
        subtitulo: `${estadisticasGenerales.academico.tasa_aprobacion.toFixed(1)}% aprobación`,
        icono: '🎓',
        color: '#ffc107',
      },
    ];

    return (
      <div className="tarjetas-resumen">
        {tarjetas.map((tarjeta, index) => (
          <div key={index} className="tarjeta-resumen" style={{ borderTopColor: tarjeta.color }}>
            <div className="tarjeta-icono" style={{ backgroundColor: `${tarjeta.color}20` }}>
              <span style={{ fontSize: '2rem' }}>{tarjeta.icono}</span>
            </div>
            <div className="tarjeta-contenido">
              <h3 className="tarjeta-titulo">{tarjeta.titulo}</h3>
              <p className="tarjeta-valor" style={{ color: tarjeta.color }}>
                {tarjeta.valor}
              </p>
              <p className="tarjeta-subtitulo">{tarjeta.subtitulo}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar sección demográfica
  const renderSeccionDemografica = () => {
    if (!estadisticasDemograficas) return null;

    return (
      <div className="seccion-estadisticas">
        <h2 className="seccion-titulo">📊 Estadísticas Demográficas</h2>
        
        <div className="graficas-grid">
          {/* Distribución por género */}
          {estadisticasDemograficas.genero && estadisticasDemograficas.genero.length > 0 && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Distribución por Género</h3>
              <div className="grafica-contenedor">
                <Pie
                  data={prepararDatosCirculares(
                    estadisticasDemograficas.genero,
                    'fk_id_genero__descripcion',
                    'cantidad'
                  )}
                  options={opcionesGraficas}
                />
              </div>
            </div>
          )}

          {/* Distribución por tipo de sangre */}
          {estadisticasDemograficas.tipo_sangre && estadisticasDemograficas.tipo_sangre.length > 0 && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Distribución por Tipo de Sangre</h3>
              <div className="grafica-contenedor">
                <Bar
                  data={prepararDatosBarras(
                    estadisticasDemograficas.tipo_sangre,
                    'fk_id_tipo_sangre__descripcion',
                    'cantidad',
                    'Estudiantes'
                  )}
                  options={{
                    ...opcionesGraficas,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Distribución por Sisben */}
          {estadisticasDemograficas.sisben && estadisticasDemograficas.sisben.length > 0 && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Distribución por Nivel de Sisben</h3>
              <div className="grafica-contenedor">
                <Pie
                  data={prepararDatosCirculares(
                    estadisticasDemograficas.sisben,
                    'fk_id_tipo_sisben__descripcion',
                    'cantidad'
                  )}
                  options={opcionesGraficas}
                />
              </div>
            </div>
          )}

          {/* Rangos de edad */}
          {estadisticasDemograficas.rangos_edad && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Distribución por Rangos de Edad</h3>
              <div className="grafica-contenedor">
                <Bar
                  data={{
                    labels: Object.keys(estadisticasDemograficas.rangos_edad),
                    datasets: [
                      {
                        label: 'Estudiantes',
                        data: Object.values(estadisticasDemograficas.rangos_edad),
                        backgroundColor: colores.secundario[0],
                        borderColor: colores.secundario[1],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...opcionesGraficas,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Top ciudades */}
          {estadisticasDemograficas.top_ciudades && estadisticasDemograficas.top_ciudades.length > 0 && (
            <div className="grafica-card grafica-card-wide">
              <h3 className="grafica-titulo">Top 10 Ciudades con Más Estudiantes</h3>
              <div className="grafica-contenedor">
                <Bar
                  data={prepararDatosBarras(
                    estadisticasDemograficas.top_ciudades,
                    'fk_codigo_municipio__nombre',
                    'cantidad',
                    'Estudiantes'
                  )}
                  options={{
                    ...opcionesGraficas,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sección académica
  const renderSeccionAcademica = () => {
    if (!estadisticasAcademicas) return null;

    return (
      <div className="seccion-estadisticas">
        <h2 className="seccion-titulo">🎓 Estadísticas Académicas</h2>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-grupo">
            <label htmlFor="filtro-periodo">Periodo:</label>
            <select
              id="filtro-periodo"
              value={filtrosPeriodo}
              onChange={(e) => setFiltrosPeriodo(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todos los periodos</option>
              {filtrosDisponibles?.periodos?.map((periodo) => (
                <option key={periodo.id_periodo} value={periodo.id_periodo}>
                  Periodo {periodo.id_periodo}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-curso">Curso:</label>
            <select
              id="filtro-curso"
              value={filtrosCurso}
              onChange={(e) => setFiltrosCurso(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todos los cursos</option>
              {filtrosDisponibles?.cursos?.map((curso) => (
                <option key={curso.id_curso} value={curso.id_curso}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setFiltrosPeriodo('');
              setFiltrosCurso('');
            }}
            className="btn-limpiar-filtros"
          >
            Limpiar Filtros
          </button>
        </div>

        <div className="graficas-grid">
          {/* Distribución de calificaciones */}
          {estadisticasAcademicas.distribucion_calificaciones && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Distribución de Calificaciones</h3>
              <div className="grafica-contenedor">
                <Pie
                  data={{
                    labels: Object.keys(estadisticasAcademicas.distribucion_calificaciones),
                    datasets: [
                      {
                        data: Object.values(estadisticasAcademicas.distribucion_calificaciones),
                        backgroundColor: colores.variados,
                        borderColor: '#fff',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={opcionesGraficas}
                />
              </div>
            </div>
          )}

          {/* Rendimiento por curso */}
          {estadisticasAcademicas.rendimiento_cursos && estadisticasAcademicas.rendimiento_cursos.length > 0 && (
            <div className="grafica-card">
              <h3 className="grafica-titulo">Promedio por Curso</h3>
              <div className="grafica-contenedor">
                <Bar
                  data={{
                    labels: estadisticasAcademicas.rendimiento_cursos.map((c) => c.curso),
                    datasets: [
                      {
                        label: 'Promedio',
                        data: estadisticasAcademicas.rendimiento_cursos.map((c) => c.promedio),
                        backgroundColor: colores.terciario[0],
                        borderColor: colores.terciario[1],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...opcionesGraficas,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Top 10 estudiantes */}
          {estadisticasAcademicas.top_estudiantes && estadisticasAcademicas.top_estudiantes.length > 0 && (
            <div className="grafica-card grafica-card-wide">
              <h3 className="grafica-titulo">🏆 Top 10 Estudiantes</h3>
              <div className="tabla-container">
                <table className="tabla-estadisticas">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Documento</th>
                      <th>Nombre Completo</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estadisticasAcademicas.top_estudiantes.map((estudiante, index) => (
                      <tr key={estudiante.numero_documento}>
                        <td className="tabla-posicion">{index + 1}</td>
                        <td>{estudiante.numero_documento}</td>
                        <td>{estudiante.nombre_completo}</td>
                        <td className="tabla-promedio">
                          <span className="badge-promedio">{estudiante.promedio}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Materias con mayor reprobación */}
          {estadisticasAcademicas.materias_mayor_reprobacion &&
            estadisticasAcademicas.materias_mayor_reprobacion.length > 0 && (
              <div className="grafica-card grafica-card-wide">
                <h3 className="grafica-titulo">⚠️ Materias con Mayor Tasa de Reprobación</h3>
                <div className="grafica-contenedor">
                  <Bar
                    data={{
                      labels: estadisticasAcademicas.materias_mayor_reprobacion.map((m) => m.materia),
                      datasets: [
                        {
                          label: 'Tasa de Reprobación (%)',
                          data: estadisticasAcademicas.materias_mayor_reprobacion.map(
                            (m) => m.tasa_reprobacion
                          ),
                          backgroundColor: colores.primario[0],
                          borderColor: colores.primario[1],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      ...opcionesGraficas,
                      indexAxis: 'y',
                      scales: {
                        x: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  // Renderizar sección institucional
  const renderSeccionInstitucional = () => {
    if (!estadisticasInstitucionales) return null;

    return (
      <div className="seccion-estadisticas">
        <h2 className="seccion-titulo">🏫 Estadísticas Institucionales</h2>

        <div className="graficas-grid">
          {/* Estudiantes por curso */}
          {estadisticasInstitucionales.estudiantes_por_curso &&
            estadisticasInstitucionales.estudiantes_por_curso.length > 0 && (
              <div className="grafica-card grafica-card-wide">
                <h3 className="grafica-titulo">Estudiantes por Curso</h3>
                <div className="grafica-contenedor">
                  <Bar
                    data={prepararDatosBarras(
                      estadisticasInstitucionales.estudiantes_por_curso,
                      'id_curso__nombre',
                      'cantidad',
                      'Estudiantes'
                    )}
                    options={{
                      ...opcionesGraficas,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

          {/* Materias por área */}
          {estadisticasInstitucionales.materias_por_area &&
            estadisticasInstitucionales.materias_por_area.length > 0 && (
              <div className="grafica-card">
                <h3 className="grafica-titulo">Materias por Área de Conocimiento</h3>
                <div className="grafica-contenedor">
                  <Pie
                    data={prepararDatosCirculares(
                      estadisticasInstitucionales.materias_por_area,
                      'fk_Id_area_conocimiento__nombre',
                      'cantidad'
                    )}
                    options={opcionesGraficas}
                  />
                </div>
              </div>
            )}

          {/* Profesores por área */}
          {estadisticasInstitucionales.profesores_por_area &&
            estadisticasInstitucionales.profesores_por_area.length > 0 && (
              <div className="grafica-card">
                <h3 className="grafica-titulo">Profesores por Área</h3>
                <div className="grafica-contenedor">
                  <Bar
                    data={prepararDatosBarras(
                      estadisticasInstitucionales.profesores_por_area,
                      'fk_id_materia__fk_Id_area_conocimiento__nombre',
                      'cantidad',
                      'Profesores'
                    )}
                    options={{
                      ...opcionesGraficas,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

          {/* Carga académica de profesores */}
          {estadisticasInstitucionales.carga_profesores &&
            estadisticasInstitucionales.carga_profesores.length > 0 && (
              <div className="grafica-card grafica-card-wide">
                <h3 className="grafica-titulo">Carga Académica por Profesor (Top 15)</h3>
                <div className="tabla-container">
                  <table className="tabla-estadisticas">
                    <thead>
                      <tr>
                        <th>Profesor</th>
                        <th>Total Materias</th>
                        <th>Total Cursos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadisticasInstitucionales.carga_profesores.map((profesor, index) => (
                        <tr key={index}>
                          <td>
                            {profesor.fk_numero_documento_profesor__nombre1}{' '}
                            {profesor.fk_numero_documento_profesor__apellido1}
                          </td>
                          <td className="tabla-numero">{profesor.total_materias}</td>
                          <td className="tabla-numero">{profesor.total_cursos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  // Renderizar sección comparativa
  const renderSeccionComparativa = () => {
    if (!estadisticasComparativas || !estadisticasComparativas.comparativa_periodos) return null;

    return (
      <div className="seccion-estadisticas">
        <h2 className="seccion-titulo">📈 Estadísticas Comparativas</h2>

        <div className="graficas-grid">
          {/* Comparativa de promedios por periodo */}
          <div className="grafica-card grafica-card-wide">
            <h3 className="grafica-titulo">Evolución de Promedios por Periodo</h3>
            <div className="grafica-contenedor">
              <Line
                data={{
                  labels: estadisticasComparativas.comparativa_periodos.map((p) => p.periodo),
                  datasets: [
                    {
                      label: 'Promedio',
                      data: estadisticasComparativas.comparativa_periodos.map((p) => p.promedio),
                      borderColor: colores.terciario[0],
                      backgroundColor: `${colores.terciario[0]}20`,
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  ...opcionesGraficas,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Comparativa de tasa de aprobación */}
          <div className="grafica-card grafica-card-wide">
            <h3 className="grafica-titulo">Evolución de Tasa de Aprobación por Periodo</h3>
            <div className="grafica-contenedor">
              <Line
                data={{
                  labels: estadisticasComparativas.comparativa_periodos.map((p) => p.periodo),
                  datasets: [
                    {
                      label: 'Tasa de Aprobación (%)',
                      data: estadisticasComparativas.comparativa_periodos.map(
                        (p) => p.tasa_aprobacion
                      ),
                      borderColor: colores.secundario[0],
                      backgroundColor: `${colores.secundario[0]}20`,
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  ...opcionesGraficas,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Tabla comparativa */}
          <div className="grafica-card grafica-card-wide">
            <h3 className="grafica-titulo">Tabla Comparativa por Periodo</h3>
            <div className="tabla-container">
              <table className="tabla-estadisticas">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Promedio</th>
                    <th>Tasa Aprobación</th>
                    <th>Total Evaluaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticasComparativas.comparativa_periodos.map((periodo, index) => (
                    <tr key={index}>
                      <td>{periodo.periodo}</td>
                      <td className="tabla-promedio">
                        <span className="badge-promedio">{periodo.promedio}</span>
                      </td>
                      <td className="tabla-numero">{periodo.tasa_aprobacion}%</td>
                      <td className="tabla-numero">{periodo.total_evaluaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="estadisticas-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">
      {/* Header */}
      <div className="estadisticas-header">
        <div className="header-content">
          <h1 className="header-titulo">📊 Estadísticas del Sistema</h1>
          <p className="header-subtitulo">
            Análisis completo de datos demográficos, académicos e institucionales
          </p>
        </div>
        <button onClick={cargarDatos} className="btn-actualizar">
          🔄 Actualizar Datos
        </button>
      </div>

      {/* Tarjetas de resumen */}
      {renderTarjetasResumen()}

      {/* Navegación por pestañas */}
      <div className="tabs-container">
        <button
          className={`tab-button ${seccionActiva === 'general' ? 'active' : ''}`}
          onClick={() => setSeccionActiva('general')}
        >
          📊 General
        </button>
        <button
          className={`tab-button ${seccionActiva === 'demograficas' ? 'active' : ''}`}
          onClick={() => setSeccionActiva('demograficas')}
        >
          👥 Demográficas
        </button>
        <button
          className={`tab-button ${seccionActiva === 'academicas' ? 'active' : ''}`}
          onClick={() => setSeccionActiva('academicas')}
        >
          🎓 Académicas
        </button>
        <button
          className={`tab-button ${seccionActiva === 'institucionales' ? 'active' : ''}`}
          onClick={() => setSeccionActiva('institucionales')}
        >
          🏫 Institucionales
        </button>
        <button
          className={`tab-button ${seccionActiva === 'comparativas' ? 'active' : ''}`}
          onClick={() => setSeccionActiva('comparativas')}
        >
          📈 Comparativas
        </button>
      </div>

      {/* Contenido de la sección activa */}
      <div className="tabs-content">
        {seccionActiva === 'general' && (
          <div className="seccion-estadisticas">
            <h2 className="seccion-titulo">📊 Vista General del Sistema</h2>
            <p className="seccion-descripcion">
              Resumen ejecutivo de las estadísticas más relevantes del sistema académico
            </p>

            <div className="graficas-grid">
              {/* Distribución por género */}
              {estadisticasDemograficas?.genero && estadisticasDemograficas.genero.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">👥 Distribución por Género</h3>
                  <div className="grafica-contenedor">
                    <Pie
                      data={prepararDatosCirculares(
                        estadisticasDemograficas.genero,
                        'fk_id_genero__descripcion',
                        'cantidad'
                      )}
                      options={opcionesGraficas}
                    />
                  </div>
                </div>
              )}

              {/* Estudiantes por curso */}
              {estadisticasInstitucionales?.estudiantes_por_curso && 
                estadisticasInstitucionales.estudiantes_por_curso.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">🏫 Estudiantes por Curso</h3>
                  <div className="grafica-contenedor">
                    <Bar
                      data={prepararDatosBarras(
                        estadisticasInstitucionales.estudiantes_por_curso,
                        'id_curso__nombre',
                        'cantidad',
                        'Estudiantes'
                      )}
                      options={{
                        ...opcionesGraficas,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Distribución de calificaciones */}
              {estadisticasAcademicas?.distribucion_calificaciones && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">📈 Distribución de Calificaciones</h3>
                  <div className="grafica-contenedor">
                    <Pie
                      data={{
                        labels: Object.keys(estadisticasAcademicas.distribucion_calificaciones),
                        datasets: [
                          {
                            data: Object.values(estadisticasAcademicas.distribucion_calificaciones),
                            backgroundColor: colores.variados,
                            borderColor: '#fff',
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={opcionesGraficas}
                    />
                  </div>
                </div>
              )}

              {/* Rendimiento por curso */}
              {estadisticasAcademicas?.rendimiento_cursos && 
                estadisticasAcademicas.rendimiento_cursos.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">🎓 Promedio por Curso</h3>
                  <div className="grafica-contenedor">
                    <Bar
                      data={{
                        labels: estadisticasAcademicas.rendimiento_cursos.map((c) => c.curso),
                        datasets: [
                          {
                            label: 'Promedio',
                            data: estadisticasAcademicas.rendimiento_cursos.map((c) => c.promedio),
                            backgroundColor: colores.terciario[0],
                            borderColor: colores.terciario[1],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        ...opcionesGraficas,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Distribución por Sisben */}
              {estadisticasDemograficas?.sisben && estadisticasDemograficas.sisben.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">💰 Distribución por Nivel de Sisben</h3>
                  <div className="grafica-contenedor">
                    <Pie
                      data={prepararDatosCirculares(
                        estadisticasDemograficas.sisben,
                        'fk_id_tipo_sisben__descripcion',
                        'cantidad'
                      )}
                      options={opcionesGraficas}
                    />
                  </div>
                </div>
              )}

              {/* Evolución de promedios */}
              {estadisticasComparativas?.comparativa_periodos && 
                estadisticasComparativas.comparativa_periodos.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">📊 Evolución de Promedios</h3>
                  <div className="grafica-contenedor">
                    <Line
                      data={{
                        labels: estadisticasComparativas.comparativa_periodos.map((p) => p.periodo),
                        datasets: [
                          {
                            label: 'Promedio',
                            data: estadisticasComparativas.comparativa_periodos.map((p) => p.promedio),
                            borderColor: colores.terciario[0],
                            backgroundColor: `${colores.terciario[0]}20`,
                            fill: true,
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        ...opcionesGraficas,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Top 5 estudiantes */}
              {estadisticasAcademicas?.top_estudiantes && 
                estadisticasAcademicas.top_estudiantes.length > 0 && (
                <div className="grafica-card grafica-card-wide">
                  <h3 className="grafica-titulo">🏆 Top 5 Estudiantes con Mejor Promedio</h3>
                  <div className="tabla-container">
                    <table className="tabla-estadisticas">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Documento</th>
                          <th>Nombre Completo</th>
                          <th>Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estadisticasAcademicas.top_estudiantes.slice(0, 5).map((estudiante, index) => (
                          <tr key={estudiante.numero_documento}>
                            <td className="tabla-posicion">{index + 1}</td>
                            <td>{estudiante.numero_documento}</td>
                            <td>{estudiante.nombre_completo}</td>
                            <td className="tabla-promedio">
                              <span className="badge-promedio">{estudiante.promedio}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Materias por área */}
              {estadisticasInstitucionales?.materias_por_area && 
                estadisticasInstitucionales.materias_por_area.length > 0 && (
                <div className="grafica-card">
                  <h3 className="grafica-titulo">📚 Materias por Área de Conocimiento</h3>
                  <div className="grafica-contenedor">
                    <Pie
                      data={prepararDatosCirculares(
                        estadisticasInstitucionales.materias_por_area,
                        'fk_Id_area_conocimiento__nombre',
                        'cantidad'
                      )}
                      options={opcionesGraficas}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje informativo */}
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              borderLeft: '4px solid #dc3545'
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                💡 <strong>Tip:</strong> Utiliza las pestañas superiores para explorar estadísticas detalladas por categoría: 
                Demográficas, Académicas, Institucionales y Comparativas.
              </p>
            </div>
          </div>
        )}
        {seccionActiva === 'demograficas' && renderSeccionDemografica()}
        {seccionActiva === 'academicas' && renderSeccionAcademica()}
        {seccionActiva === 'institucionales' && renderSeccionInstitucional()}
        {seccionActiva === 'comparativas' && renderSeccionComparativa()}
      </div>
    </div>
  );
};

export default EstadisticasCompletas;
