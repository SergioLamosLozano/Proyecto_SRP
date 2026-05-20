import React, { useState, useEffect } from 'react';
import '../styles/Coordinacion.css';
import { Periodos, Cursos, Materias } from '../api/cursos';
import { Alert } from '../utils/alert';

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

  useEffect(() => {
    cargarDatos();
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

      // Usar fetch directo sin token
      const response = await fetch(`http://127.0.0.1:8000/api${url}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al generar el reporte');
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

      // Usar fetch directo sin token
      const response = await fetch(`http://127.0.0.1:8000/api${url}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al generar los boletines');
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
                    Periodo {periodo.id_periodo} ({periodo.fecha_inicio} - {periodo.fecha_fin})
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
                    Periodo {periodo.id_periodo} ({periodo.fecha_inicio} - {periodo.fecha_fin})
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
