/**
 * Servicio para manejar operaciones relacionadas con estudiantes
 */

import apiService from './apiService';
import { STUDENT_ENDPOINTS, API_BASE_URL } from '../config/api';

class StudentService {
  /**
   * Obtiene los estudiantes (hijos) asociados a un acudiente
   * @param {string} documentoAcudiente - Número de documento del acudiente
   * @returns {Promise} Lista de estudiantes
   */
  async getStudentsByParent(documentoAcudiente) {
    try {
      console.log('📚 Obteniendo estudiantes del acudiente:', documentoAcudiente);
      
      const response = await apiService.get(
        STUDENT_ENDPOINTS.BY_PARENT(documentoAcudiente)
      );

      if (response.success && response.data) {
        // Transformar los datos al formato que espera la app
        // El backend retorna "estudiantes_relacionados" en la respuesta
        const estudiantes = response.data.estudiantes_relacionados || [];
        
        return {
          success: true,
          data: estudiantes.map(est => ({
            id: est.numero_documento,
            name: est.nombre_completo,
            grade: this.formatGrade(est),
            email: est.correo,
            age: est.edad,
            phone: est.telefono,
            address: est.direccion,
          })),
          userName: response.data.usuario || response.data.acudiente, // Nombre del acudiente
        };
      }

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo estudiantes:', error);
      return {
        success: false,
        error: 'No se pudieron cargar los estudiantes.'
      };
    }
  }

  /**
   * Formatea el grado del estudiante
   * @param {Object} estudiante - Datos del estudiante
   * @returns {string} Grado formateado
   */
  formatGrade(estudiante) {
    // El backend ahora retorna el campo "grado" directamente
    return estudiante.grado || 'Sin grado asignado';
  }

  /**
   * Obtiene los detalles de un estudiante específico
   * @param {string} studentId - ID del estudiante
   * @returns {Promise} Detalles del estudiante
   */
  async getStudentDetails(studentId) {
    try {
      console.log('👤 Obteniendo detalles del estudiante:', studentId);
      
      const response = await apiService.get(
        STUDENT_ENDPOINTS.DETAIL(studentId)
      );

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo detalles del estudiante:', error);
      return {
        success: false,
        error: 'No se pudieron cargar los detalles del estudiante.'
      };
    }
  }

  /**
   * Obtiene las notas de un estudiante y las agrupa por materia
   * @param {string} studentId - ID del estudiante
   * @param {number} periodoId - ID del periodo (opcional, si no se envía trae todos)
   * @returns {Promise} Materias con sus notas agrupadas
   */
  async getStudentGrades(studentId, periodoId = null) {
    try {
      console.log('📊 Obteniendo notas del estudiante:', studentId, 'periodo:', periodoId);
      
      // Construir URL con filtro de periodo si se proporciona
      let url = STUDENT_ENDPOINTS.GRADES(studentId);
      if (periodoId) {
        url += `&periodo=${periodoId}`;
      }
      
      const response = await apiService.get(url);

      console.log('📊 Respuesta del backend:', response);

      if (response.success && response.data) {
        console.log('📊 Total de notas recibidas:', response.data.length);
        
        if (response.data.length === 0) {
          console.log('⚠️ No hay notas registradas para este estudiante');
          return {
            success: true,
            data: []
          };
        }
        
        // Agrupar notas por materia
        const notasPorMateria = {};
        
        response.data.forEach((nota, index) => {
          console.log(`📝 Nota ${index + 1}:`, {
            materia: nota.nombre_materia,
            actividad: nota.nombre_actividad,
            calificacion: nota.calificacion,
            periodo: nota.periodo
          });
          
          const materiaId = nota.id_materia;
          const materiaNombre = nota.nombre_materia;
          
          if (!materiaId || !materiaNombre) {
            console.log('⚠️ Nota sin materia asociada:', nota);
            return;
          }
          
          if (!notasPorMateria[materiaId]) {
            notasPorMateria[materiaId] = {
              id: materiaId,
              name: materiaNombre,
              grades: [],
              average: 0,
              icon: this.getSubjectIcon(materiaNombre),
            };
          }
          
          notasPorMateria[materiaId].grades.push({
            id: nota.id_estudiante_notas,
            activity: nota.nombre_actividad || 'Actividad sin nombre',
            grade: parseFloat(nota.calificacion) || 0,
            description: nota.descripcion_actividad,
            period: nota.periodo,
            percentage: parseFloat(nota.porcentaje_actividad) || 0,
          });
        });
        
        // Calcular promedios por materia
        const materias = Object.values(notasPorMateria).map(materia => {
          const totalGrades = materia.grades.reduce((sum, g) => sum + g.grade, 0);
          materia.average = materia.grades.length > 0 
            ? parseFloat((totalGrades / materia.grades.length).toFixed(2))
            : 0;
          return materia;
        });
        
        console.log('✅ Materias procesadas:', materias.length);
        
        return {
          success: true,
          data: materias
        };
      }

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo notas:', error);
      return {
        success: false,
        error: 'No se pudieron cargar las notas.'
      };
    }
  }

  /**
   * Obtiene la lista de periodos académicos disponibles
   * @returns {Promise} Lista de periodos
   */
  async getPeriodos() {
    try {
      console.log('📅 Obteniendo periodos académicos');
      
      const response = await apiService.get(`${API_BASE_URL}/periodo/`);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.map(p => ({
            id: p.id_periodo,
            nombre: `Periodo ${p.id_periodo}`,
            fechaInicio: p.fecha_inicio,
            fechaFin: p.fecha_fin,
          }))
        };
      }

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo periodos:', error);
      return {
        success: false,
        error: 'No se pudieron cargar los periodos.'
      };
    }
  }

  /**
   * Obtiene el ícono apropiado para una materia según su nombre
   * @param {string} materiaNombre - Nombre de la materia
   * @returns {string} Nombre del ícono de MaterialCommunityIcons
   */
  getSubjectIcon(materiaNombre) {
    const nombre = materiaNombre.toLowerCase();
    
    if (nombre.includes('matemática') || nombre.includes('algebra') || nombre.includes('cálculo')) {
      return 'calculator';
    } else if (nombre.includes('español') || nombre.includes('lengua') || nombre.includes('literatura')) {
      return 'book-open-variant';
    } else if (nombre.includes('ciencia') || nombre.includes('biología') || nombre.includes('química') || nombre.includes('física')) {
      return 'flask';
    } else if (nombre.includes('inglés') || nombre.includes('francés')) {
      return 'translate';
    } else if (nombre.includes('social') || nombre.includes('historia') || nombre.includes('geografía')) {
      return 'earth';
    } else if (nombre.includes('educación física') || nombre.includes('deporte')) {
      return 'run';
    } else if (nombre.includes('estadística')) {
      return 'chart-bar';
    } else if (nombre.includes('religión') || nombre.includes('ética')) {
      return 'hands-pray';
    } else if (nombre.includes('arte') || nombre.includes('música')) {
      return 'palette';
    } else if (nombre.includes('tecnología') || nombre.includes('informática')) {
      return 'laptop';
    } else {
      return 'book';
    }
  }

  /**
   * Obtiene el horario de un estudiante
   * @param {string} studentId - ID del estudiante
   * @returns {Promise} Horario del estudiante
   */
  async getStudentSchedule(studentId) {
    try {
      console.log('📅 Obteniendo horario del estudiante:', studentId);
      
      const response = await apiService.get(
        STUDENT_ENDPOINTS.SCHEDULE(studentId)
      );

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo horario:', error);
      return {
        success: false,
        error: 'No se pudo cargar el horario.'
      };
    }
  }

  /**
   * Obtiene las definitivas de un estudiante por periodo
   * @param {string} studentId - ID del estudiante
   * @param {number} periodoId - ID del periodo (opcional)
   * @returns {Promise} Definitivas del estudiante
   */
  async getStudentDefinitivas(studentId, periodoId = null) {
    try {
      console.log('📊 Obteniendo definitivas del estudiante:', studentId, 'periodo:', periodoId);
      
      let url = `${API_BASE_URL}/definitivas-estudiante/?estudiante=${studentId}`;
      if (periodoId) {
        url += `&periodo=${periodoId}`;
      }
      
      const response = await apiService.get(url);

      if (response.success && response.data) {
        // Agrupar definitivas por periodo
        const porPeriodo = {};
        
        response.data.forEach(def => {
          const periodo = def.fk_id_periodo || 'Sin periodo';
          
          if (!porPeriodo[periodo]) {
            porPeriodo[periodo] = {
              periodo: periodo,
              materias: [],
              promedio: 0,
            };
          }
          
          porPeriodo[periodo].materias.push({
            id: def.id_definitiva,
            materia: def.nombre_materia,
            definitiva: parseFloat(def.valor_definitiva) || 0,
            estado: def.estado,
          });
        });
        
        // Calcular promedios por periodo
        Object.values(porPeriodo).forEach(periodo => {
          if (periodo.materias.length > 0) {
            const suma = periodo.materias.reduce((acc, m) => acc + m.definitiva, 0);
            periodo.promedio = parseFloat((suma / periodo.materias.length).toFixed(2));
          }
        });
        
        return {
          success: true,
          data: Object.values(porPeriodo)
        };
      }

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo definitivas:', error);
      return {
        success: false,
        error: 'No se pudieron cargar las definitivas.'
      };
    }
  }
}

// Exportar instancia única (Singleton)
export default new StudentService();
