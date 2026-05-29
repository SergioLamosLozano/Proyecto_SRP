import React, { useState, useEffect } from 'react';
import '../styles/Coordinacion.css';
import { Periodos, Cursos, Materias, ObtenerConfiguracionBoletines, ActualizarConfiguracionBoletines } from '../api/cursos';
import { Alert } from '../utils/alert';
import Swal from 'sweetalert2';
import { nombrePeriodo } from '../utils/periodo';

const ReportesAcademicos = ({ onBack }) => {
  const [periodos, setPeriodos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  
  // Estados para Reporte de Notas
  const [periodoSeleccionadoNotas, setPeriodoSeleccionadoNotas] = useState('');
  const [cursoSeleccionadoNotas, setCursoSeleccionadoNotas] = useState('');
  const [materiaSeleccionadaNotas, setMateriaSeleccionadaNotas] = useState('');
  const [loadingNotas, setLoadingNotas] = useState(false);
  
  // Estados para Boletines
  const [periodoSeleccionadoBoletin, setPeriodoSeleccionadoBoletin] = useState('');
  const [cursoSeleccionadoBoletin, setCursoSeleccionadoBoletin] = useState('');
  const [formatoBoletin, setFormatoBoletin] = useState('lote');
  const [loadingBoletin, setLoadingBoletin] = useState(false);
  
  // Estados para Configuración de Boletines
  const [descargaHabilitada, setDescargaHabilitada] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    cargarDatos();
    cargarConfiguracionBoletines();
  }, []);

  const cargarDatos = async () => {
    try {
      const [periodosRes, cursosRes, materiasRes] = await Promise.all([
        Periodos(),
        Cursos(),
        Materias()
      ]);
      
      setPeriodos(periodosRes.data || []);
      setCursos(cursosRes.data || []);
      setMaterias(materiasRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert('error', 'Error al cargar los datos');
    }
  };

  const cargarConfiguracionBoletines = async () => {
    try {
      const response = await ObtenerConfiguracionBoletines();
      setDescargaHabilitada(response.data.descarga_habilitada);
    } catch (error) {
      console.error('Error cargando configuración de boletines:', error);
      // No mostrar error al usuario, usar valor por defecto
    }
  };

  const cambiarEstadoBoletines = async (nuevoEstado) => {
    const accion = nuevoEstado ? 'habilitar' : 'deshabilitar';
    
    const result = await Swal.fire({
      title: `¿${nuevoEstado ? 'Habilitar' : 'Deshabilitar'} descarga de boletines?`,
      html: `
        <p>Esto ${nuevoEstado ? 'permitirá' : 'bloqueará'} que los padres/acudientes puedan descargar boletines desde:</p>
        <ul style="text-align: left; margin: 1rem 2rem;">
          <li>La aplicación web (Portal de Padres)</li>
          <li>La aplicación móvil</li>
        </ul>
        <p style="margin-top: 1rem;"><strong>¿Desea continuar?</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? '#4caf50' : '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setLoadingConfig(true);
        await ActualizarConfiguracionBoletines({ descarga_habilitada: nuevoEstado });
        setDescargaHabilitada(nuevoEstado);
        
        Swal.fire({
          icon: 'success',
          title: '¡Configuración actualizada!',
          text: `La descarga de boletines ha sido ${nuevoEstado ? 'habilitada' : 'deshabilitada'} exitosamente.`,
          confirmButtonColor: '#4caf50'
        });
      } catch (error) {
        console.error('Error actualizando configuración:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la configuración. Intente nuevamente.',
          confirmButtonColor: '#d32f2f'
        });
      } finally {
        setLoadingConfig(false);
      }
    }
  };

  const descargarReporteNotas = async () => {
    if (!periodoSeleccionadoNotas) {
      Alert('warning', 'Por favor seleccione un periodo');
      return;
    }

    try {
      setLoadingNotas(true);
      
      let url = `/reportes/notas-excel/?periodo=${periodoSeleccionadoNotas}`;
      
      if (cursoSeleccionadoNotas) {
        url += `&curso=${cursoSeleccionadoNotas}`;
      }
      
      if (materiaSeleccionadaNotas) {
        url += `&materia=${materiaSeleccionadaNotas}`;
      }

      // El endpoint requiere autenticación; enviamos el JWT del coordinador
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api${url}`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || 'Error al generar el reporte');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Reporte_Notas_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      Alert('success', 'Reporte generado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      Alert('error', error.message || 'Error al generar el reporte');
    } finally {
      setLoadingNotas(false);
    }
  };

  const descargarBoletines = async () => {
    if (!periodoSeleccionadoBoletin) {
      Alert('warning', 'Por favor seleccione un periodo');
      return;
    }

    if (!cursoSeleccionadoBoletin) {
      Alert('warning', 'Por favor seleccione un curso');
      return;
    }

    try {
      setLoadingBoletin(true);
      
      let url = `/reportes/boletines-pdf/?periodo=${periodoSeleccionadoBoletin}&curso=${cursoSeleccionadoBoletin}&formato=${formatoBoletin}`;

      // El endpoint requiere autenticación; enviamos el JWT del coordinador
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api${url}`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || 'Error al generar los boletines');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const extension = formatoBoletin === 'lote' ? 'zip' : 'pdf';
      link.download = `Boletines_${new Date().getTime()}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      Alert('success', 'Boletines generados exitosamente');
    } catch (error) {
      console.error('Error:', error);
      Alert('error', error.message || 'Error al generar los boletines');
    } finally {
      setLoadingBoletin(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Reportes Académicos</h1>
        <p className="dashboard-subtitle">Genera y descarga reportes de notas y boletines estudiantiles</p>
      </div>

      <div className="dashboard-grid">
        {/* Card: Reporte de Notas en Excel */}
        <div className="dashboard-card" style={{ gridColumn: 'span 1' }}>
          <div className="card-header">
            <span className="card-icon">📊</span>
            <h3 className="card-title">Reporte de Notas (Excel)</h3>
          </div>
          <p className="card-description">
            Descarga un consolidado de notas en formato Excel organizado por grados y materias.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Periodo Académico: <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <select
                value={periodoSeleccionadoNotas}
                onChange={(e) => setPeriodoSeleccionadoNotas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">-- Seleccione un periodo --</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id_periodo} value={periodo.id_periodo}>
                    {nombrePeriodo(periodo, { includeFechas: true })}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Curso (Opcional):
              </label>
              <select
                value={cursoSeleccionadoNotas}
                onChange={(e) => setCursoSeleccionadoNotas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Todos los cursos</option>
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Materia (Opcional):
              </label>
              <select
                value={materiaSeleccionadaNotas}
                onChange={(e) => setMateriaSeleccionadaNotas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Todas las materias</option>
                {materias.map((materia) => (
                  <option key={materia.id_materia} value={materia.id_materia}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="card-button"
              onClick={descargarReporteNotas}
              disabled={loadingNotas}
              style={{
                opacity: loadingNotas ? 0.6 : 1,
                cursor: loadingNotas ? 'not-allowed' : 'pointer'
              }}
            >
              {loadingNotas ? 'Generando...' : '📥 Descargar Excel'}
            </button>
          </div>
        </div>

        {/* Card: Boletines en PDF */}
        <div className="dashboard-card" style={{ gridColumn: 'span 1' }}>
          <div className="card-header">
            <span className="card-icon">📄</span>
            <h3 className="card-title">Boletines Estudiantiles (PDF)</h3>
          </div>
          <p className="card-description">
            Genera boletines académicos en PDF. Puedes descargarlos por lote (ZIP) o individuales.
          </p>

          {/* Switch de Control de Descarga para Padres */}
          <div style={{
            backgroundColor: descargaHabilitada ? '#e8f5e9' : '#ffebee',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            marginBottom: '1rem',
            border: `2px solid ${descargaHabilitada ? '#4caf50' : '#d32f2f'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: descargaHabilitada ? '#2e7d32' : '#c62828',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  🔐 Control de Descarga para Padres/Acudientes
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.85rem', 
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {descargaHabilitada 
                    ? 'Los padres pueden descargar boletines desde la web y app móvil' 
                    : 'La descarga de boletines está bloqueada para padres/acudientes'}
                </p>
              </div>
              
              <div style={{ marginLeft: '1rem' }}>
                <label style={{ 
                  position: 'relative', 
                  display: 'inline-block', 
                  width: '60px', 
                  height: '34px',
                  cursor: loadingConfig ? 'not-allowed' : 'pointer',
                  opacity: loadingConfig ? 0.6 : 1
                }}>
                  <input
                    type="checkbox"
                    checked={descargaHabilitada}
                    onChange={(e) => cambiarEstadoBoletines(e.target.checked)}
                    disabled={loadingConfig}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: loadingConfig ? 'not-allowed' : 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: descargaHabilitada ? '#4caf50' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '26px',
                      width: '26px',
                      left: descargaHabilitada ? '30px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>
            </div>
            
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#555'
            }}>
              <strong>ℹ️ Nota:</strong> Este control solo afecta la descarga desde el portal de padres. 
              Los coordinadores siempre pueden generar boletines desde aquí.
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Periodo Académico: <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <select
                value={periodoSeleccionadoBoletin}
                onChange={(e) => setPeriodoSeleccionadoBoletin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">-- Seleccione un periodo --</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id_periodo} value={periodo.id_periodo}>
                    {nombrePeriodo(periodo, { includeFechas: true })}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Curso: <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <select
                value={cursoSeleccionadoBoletin}
                onChange={(e) => setCursoSeleccionadoBoletin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">-- Seleccione un curso --</option>
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Formato de Descarga:
              </label>
              <select
                value={formatoBoletin}
                onChange={(e) => setFormatoBoletin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="lote">Por Lote (ZIP con todos los boletines)</option>
                <option value="individual">Individual (Un solo PDF)</option>
              </select>
            </div>

            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#1976d2'
            }}>
              <strong>💡 Recomendación:</strong> Use "Por Lote" para descargar todos los boletines del curso en un archivo ZIP.
            </div>

            <button
              className="card-button"
              onClick={descargarBoletines}
              disabled={loadingBoletin}
              style={{
                opacity: loadingBoletin ? 0.6 : 1,
                cursor: loadingBoletin ? 'not-allowed' : 'pointer'
              }}
            >
              {loadingBoletin ? 'Generando...' : '📥 Descargar Boletines'}
            </button>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>ℹ️ Información sobre los Reportes</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>📊 Reporte de Notas (Excel)</h4>
          <ul style={{ marginLeft: '1.5rem', color: '#666' }}>
            <li>Incluye una hoja de resumen general con estadísticas</li>
            <li>Una hoja por cada grado con todas las materias y promedios</li>
            <li>Puedes filtrar por curso o materia específica</li>
            <li>Formato compatible con Excel y Google Sheets</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>📄 Boletines Estudiantiles (PDF)</h4>
          <ul style={{ marginLeft: '1.5rem', color: '#666' }}>
            <li>Boletín individual por estudiante con todas sus calificaciones</li>
            <li>Incluye información del estudiante, grado y periodo</li>
            <li>Descarga por lote genera un ZIP con todos los boletines del curso</li>
            <li>Formato PDF listo para imprimir o enviar digitalmente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportesAcademicos;
