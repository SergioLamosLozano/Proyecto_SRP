import React, { useState, useEffect, useRef } from 'react';

import * as XLSX from 'xlsx';
import '../styles/GestionAcademica.css';
import Breadcrumbs from './Breadcrumbs';
import Table from './Table';
import UsuarioModal from './UsuarioModal';
import AsignarEstudianteModal from './AsignarEstudianteModal';
import Swal from 'sweetalert2';
import { estudiantesAPI, profesoresAPI, catalogoAPI, acudientesAPI, estudiantesAcudientesAPI } from '../api/usuarios';

const GestionUsuarios = ({ onBack }) => {
  // Estados y refs del componente
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal principal (UsuarioModal)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [modalTipo, setModalTipo] = useState('profesor');
  const [modalData, setModalData] = useState(null);

  // Listas de datos
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [padres, setPadres] = useState([]);

  // Upload estudiantes
  const [selectedEstudiantesFile, setSelectedEstudiantesFile] = useState(null);
  const [estudiantesUploadResult, setEstudiantesUploadResult] = useState(null);
  const [estudiantesPreview, setEstudiantesPreview] = useState(null);
  const [estudiantesValidationErrors, setEstudiantesValidationErrors] = useState([]);
  const [estudiantesEditableRows, setEstudiantesEditableRows] = useState(null);
  const [estudiantesHeadersFromFile, setEstudiantesHeadersFromFile] = useState(null);
  const [uploadingEstudiantes, setUploadingEstudiantes] = useState(false);

  // Upload profesores
  const profesoresFileInputRef = useRef(null);
  const [selectedProfesoresFile, setSelectedProfesoresFile] = useState(null);
  const [profesoresUploadResult, setProfesoresUploadResult] = useState(null);
  const [profesoresPreview, setProfesoresPreview] = useState(null);
  const [profesoresValidationErrors, setProfesoresValidationErrors] = useState([]);
  const [profesoresEditableRows, setProfesoresEditableRows] = useState(null);
  const [profesoresHeadersFromFile, setProfesoresHeadersFromFile] = useState(null);
  const [uploadingProfesores, setUploadingProfesores] = useState(false);

  // Cache de catálogos para validaciones
  const [catalogosCache, setCatalogosCache] = useState(null);

  // Asignación de estudiantes a padres
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activePadreId, setActivePadreId] = useState(null);

  const downloadWorkbookFromRows = (tipo) => {
    try {
      let headers = [];
      let rows = [];
      if (tipo === 'estudiantes') {
        headers = estudiantesHeadersFromFile || (estudiantesEditableRows && Object.keys(estudiantesEditableRows[0] || {})) || [];
        rows = estudiantesEditableRows || [];
      }
      const aoa = [headers];
      rows.forEach((r) => {
        const rowArr = headers.map((h) => r[h] ?? '');
        aoa.push(rowArr);
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(wb, ws, tipo === 'estudiantes' ? 'Estudiantes' : 'Profesores');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const filename = tipo === 'estudiantes' ? 'estudiantes_corregido.xlsx' : 'profesores_corregido.xlsx';
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Error descargando workbook corregido:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo generar el archivo corregido.' });
    }
  };

  const uploadEditedWorkbook = async (tipo) => {
    try {
      let headers = [];
      let rows = [];
      if (tipo === 'estudiantes') {
        headers = estudiantesHeadersFromFile || (estudiantesEditableRows && Object.keys(estudiantesEditableRows[0] || {})) || [];
        rows = estudiantesEditableRows || [];
      }
      const aoa = [headers];
      rows.forEach((r) => {
        const rowArr = headers.map((h) => r[h] ?? '');
        aoa.push(rowArr);
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(wb, ws, tipo === 'estudiantes' ? 'Estudiantes' : 'Profesores');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const filename = tipo === 'estudiantes' ? 'estudiantes_corregido.xlsx' : 'profesores_corregido.xlsx';
      const fileObj = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (tipo === 'estudiantes') {
        setUploadingEstudiantes(true);
        const resp = await estudiantesAPI.bulkUpload(fileObj);
        setEstudiantesUploadResult(resp.data);
        setUploadingEstudiantes(false);
        Swal.fire({ icon: 'success', title: 'Subida completada', text: 'Se subió la versión corregida.' });
      }
    } catch (err) {
      console.error('Error subiendo versión corregida:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la versión corregida.' });
    }
  };

  // Referencias para los inputs de archivo
  const estudiantesFileInputRef = useRef(null);

  // Helper: leer un workbook usando SheetJS (XLSX)
  const readWorkbook = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = (e) => reject(e);
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          resolve(wb);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Helper: cargar catálogos necesarios para validar/interpretar el Excel
  const loadCatalogsForValidation = async () => {
    try {
      const [tiposDocResp, generosResp, estadosResp, tiposSangreResp, sisbenResp, departamentosResp, ciudadesResp, tiposAcudienteResp] = await Promise.all([
        catalogoAPI.getTiposDocumento(),
        catalogoAPI.getGeneros(),
        catalogoAPI.getEstados(),
        catalogoAPI.getTiposSangre(),
        catalogoAPI.getSisben(),
        catalogoAPI.getDepartamentos(),
        catalogoAPI.getCiudades(),
        catalogoAPI.getTipoAcudiente()
      ]);
      return {
        tiposDocumento: tiposDocResp.data || [],
        generos: generosResp.data || [],
        estados: estadosResp.data || [],
        tiposSangre: tiposSangreResp.data || [],
        sisben: sisbenResp.data || [],
        departamentos: departamentosResp.data || [],
        ciudades: ciudadesResp.data || [],
        tiposAcudiente: tiposAcudienteResp.data || []
      };
    } catch (err) {
      console.warn('No se pudieron cargar catálogos para validación:', err);
      return null;
    }
  };

  // Construir índices simples para búsqueda rápida en catálogos
  const buildCatalogIndex = (catalogs) => {
    if (!catalogs) return null;
    const idx = {};
    Object.keys(catalogs).forEach((k) => {
      idx[k] = {
        byId: {},
        byName: {}
      };
      (catalogs[k] || []).forEach((item) => {
        const id = item.id || item.pk || item.codigo_municipio || item.id_tipo_documento || item.id_tipo_estado || item.id_tipo_sangre || item.id_tipo_sisben || item.id_tipo_acudiente || item.id_tipo_acudiente;
        const name = (item.descripcion || item.nombre || item.sigla || item.nombre_completo || '').toString().toLowerCase();
        if (id != null) idx[k].byId[id] = item;
        if (name) idx[k].byName[name] = item;
      });
    });
    return idx;
  };

  // Validación mínima y previsualización para Estudiantes
  const validateEstudiantesWorkbook = (wb, catalogsIndex) => {
    const errors = [];
    try {
      const sheetName = wb.SheetNames.find(n => /estudiantes?/i.test(n)) || wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      if (!raw || raw.length === 0) {
        errors.push('No se detectó contenido en la hoja de estudiantes');
        return { errors, preview: null };
      }
      const headers = raw[0].map(h => String(h || '').trim());
      const dataRows = raw.slice(1).map(r => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
        return obj;
      });
      const preview = {
        rowsCount: dataRows.length,
        headers,
        sample: dataRows.slice(0, 5),
        rows: dataRows
      };
      return { errors, preview };
    } catch (err) {
      errors.push(`Error parseando workbook: ${err.message || err}`);
      return { errors, preview: null };
    }
  };

  // Validación mínima y previsualización para Profesores (similar)
  const validateProfesoresWorkbook = (wb, catalogsIndex) => {
    const errors = [];
    try {
      const sheetName = wb.SheetNames.find(n => /profesores?/i.test(n)) || wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      if (!raw || raw.length === 0) {
        errors.push('No se detectó contenido en la hoja de profesores');
        return { errors, preview: null };
      }
      const headers = raw[0].map(h => String(h || '').trim());
      const dataRows = raw.slice(1).map(r => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
        return obj;
      });
      const preview = {
        rowsCount: dataRows.length,
        headers,
        sample: dataRows.slice(0, 5),
        rows: dataRows
      };
      return { errors, preview };
    } catch (err) {
      errors.push(`Error parseando workbook: ${err.message || err}`);
      return { errors, preview: null };
    }
  };

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Gestión de Usuarios', path: '/coordinacion/gestion-usuarios' },
    ...(currentSubSection
      ? [
          {
            label:
              currentSubSection === 'carga-estudiantes'
                ? 'Estudiantes'
                : currentSubSection === 'carga-profesores'
                ? 'Profesores'
                : currentSubSection === 'estudiantes'
                ? 'Gestión de Estudiantes'
                : currentSubSection === 'profesores'
                ? 'Gestión de Profesores'
                : currentSubSection,
            path: `/coordinacion/gestion-usuarios/${currentSubSection}`
          }
        ]
      : [])
  ];

  const userSections = [
    {
      id: 'profesores',
      title: 'Profesores',
      description: 'Gestiona la información de los profesores, asignaciones y horarios de clase.',
      icon: '👨‍🏫',
      buttonText: 'Gestionar Profesores'
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Administra los registros de estudiantes, inscripciones y seguimiento académico.',
      icon: '👨‍🎓',
      buttonText: 'Gestionar Estudiantes'
    },
    {
      id: 'padres',
      title: 'Padres de familia',
      description: 'Registra y edita los datos de los padres de familia. Estos se suelen vincular a estudiantes individualmente.',
      icon: '👪',
      buttonText: 'Gestionar Padres'
    },
    {
      id: 'carga-masiva',
      title: 'Carga Masiva',
      description: 'Realiza carga masiva de datos para estudiantes y profesores mediante archivos.',
      icon: '📤',
      buttonText: 'Carga Masiva'
    }
  ];

  // Función para cargar estudiantes desde el backend
  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await estudiantesAPI.getAll();
      
      // Transformar los datos del backend al formato esperado por la tabla
      const estudiantesFormateados = response.data.map(estudiante => ({
        id: estudiante.numero_documento_estudiante,
        nombre: estudiante.nombre_completo || `${estudiante.nombre1} ${estudiante.nombre2 || ''} ${estudiante.apellido1} ${estudiante.apellido2 || ''}`.trim(),
        identificacion: estudiante.numero_documento_estudiante,
        curso: 'Sin asignar',
        estado: estudiante.estado_desc || 'Sin estado'
      }));
      
      setEstudiantes(estudiantesFormateados);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar los estudiantes');
      // No usar datos de ejemplo; mantener la tabla vacía para evitar confusión
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar padres (acudientes) desde el backend
  const cargarPadres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await acudientesAPI.getAll();
      const padresFormateados = response.data.map(a => ({
        id: a.numero_documento_acudiente,
        nombre: a.nombre_completo || `${a.nombre1} ${a.nombre2 || ''} ${a.apellido1} ${a.apellido2 || ''}`.trim(),
        identificacion: a.numero_documento_acudiente,
        telefono: a.telefono1 || a.telefono2 || '',
        municipio: a.ciudad_nombre || ''
      }));
      setPadres(padresFormateados);
    } catch (error) {
      console.error('Error al cargar padres:', error);
      setError('Error al cargar los padres');
      setPadres([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar profesores desde el backend
  const cargarProfesores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profesoresAPI.getAll();
      
      // Transformar los datos del backend al formato esperado por la tabla
      const profesoresFormateados = response.data.map(profesor => ({
        id: profesor.numero_documento_profesor,
        nombre: profesor.nombre_completo || `${profesor.nombre1} ${profesor.nombre2 || ''} ${profesor.apellido1} ${profesor.apellido2 || ''}`.trim(),
        identificacion: profesor.numero_documento_profesor,
        materia: 'Sin asignar',
        estado: profesor.estado_desc || 'Sin estado'
      }));
      
      setProfesores(profesoresFormateados);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
      setError('Error al cargar los profesores');
      // No usar datos de ejemplo; mantener la tabla vacía para evitar confusión
      setProfesores([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = async (mode, tipo, id = null) => {
    setModalMode(mode);
    setModalTipo(tipo);
    setModalData(null);
    if (id) {
      try {
        let resp;
        if (tipo === 'profesor') resp = await profesoresAPI.getById(id);
        else if (tipo === 'estudiante') resp = await estudiantesAPI.getById(id);
        else if (tipo === 'acudiente') resp = await acudientesAPI.getById(id);
        else resp = null;
        setModalData(resp.data);
      } catch (e) {
        console.error('Error cargando detalle', e);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el detalle.' });
        return;
      }
    }
    setModalOpen(true);
  };

  const onSaved = async () => {
    if (modalTipo === 'profesor') await cargarProfesores();
    else await cargarEstudiantes();
  };

  const eliminarItem = async (tipo, id) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;
    try {
      if (tipo === 'profesor') await profesoresAPI.delete(id);
      else if (tipo === 'estudiante') await estudiantesAPI.delete(id);
      else if (tipo === 'acudiente') await acudientesAPI.delete(id);
      Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Registro eliminado correctamente' });
      if (tipo === 'profesor') await cargarProfesores();
      else if (tipo === 'estudiante') await cargarEstudiantes();
  else if (tipo === 'acudiente') await cargarPadres();
    } catch (e) {
      console.error('Error al eliminar', e);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
    }
  };

  // Cargar datos cuando se cambia de sección
  useEffect(() => {
    if (currentSubSection === 'estudiantes') {
      cargarEstudiantes();
    } else if (currentSubSection === 'profesores') {
      cargarProfesores();
    } else if (currentSubSection === 'padres') {
      cargarPadres();
    }
  }, [currentSubSection]);

  const cursos = [
    { label: 'Todos', value: '' },
    { label: 'Sexto A', value: 'Sexto A' },
    { label: 'Séptimo B', value: 'Séptimo B' },
    { label: 'Octavo A', value: 'Octavo A' },
    { label: 'Noveno B', value: 'Noveno B' }
  ];
  const materias = [
    { label: 'Todas', value: '' },
    { label: 'Matemáticas', value: 'Matemáticas' },
    { label: 'Ciencias Naturales', value: 'Ciencias Naturales' },
    { label: 'Español y Literatura', value: 'Español y Literatura' },
    { label: 'Tecnología e Informática', value: 'Tecnología e Informática' },
    { label: 'Educación Física', value: 'Educación Física' },
    { label: 'Ciencias Sociales', value: 'Ciencias Sociales' }
  ];

  const handleSectionClick = (sectionId) => {
    setCurrentSubSection(sectionId);
  };

  const handleNavigate = (path) => {
    if (path === '/coordinacion') {
      onBack();
    } else if (path === '/coordinacion/gestion-usuarios') {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split('/').pop();
      if (['profesores', 'estudiantes', 'carga-masiva', 'carga-estudiantes'].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
    }
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 'profesores':
        // Configuración de columnas para profesores
        const profesoresColumns = [
          { key: 'nombre', label: 'NOMBRE' },
          { key: 'identificacion', label: 'IDENTIFICACIÓN' },
          { key: 'materia', label: 'MATERIA' },
          { key: 'estado', label: 'ESTADO' }
        ];

        // Configuración de acciones para profesores
        const profesoresActions = [
          { label: 'Ver Detalles', onClick: (item) => abrirModal('view', 'profesor', item.id) },
          { label: 'Editar', onClick: (item) => abrirModal('edit', 'profesor', item.id) },
          { label: 'Eliminar', onClick: (item) => eliminarItem('profesor', item.id) }
        ];

        return (
          <Table
            title="Lista de Profesores"
            columns={profesoresColumns}
            data={profesores}
            searchPlaceholder="Buscar por nombre..."
            filterOptions={materias}
            filterPlaceholder="Filtrar por Materia"
            addButtonText="Añadir Profesor"
            actions={profesoresActions}
            onAdd={() => abrirModal('create', 'profesor')}
            loading={loading}
            error={error}
          />
        );
      case 'estudiantes':
        // Configuración de columnas - Cambia los 'label' para modificar los títulos de las columnas
        const estudiantesColumns = [
          { key: 'nombre', label: 'NOMBRE' },
          { key: 'identificacion', label: 'IDENTIFICACIÓN' },
          { key: 'curso', label: 'CURSO' },
          { key: 'estado', label: 'ESTADO' }
        ];

        // Configuración de acciones - Cambia los 'label' para modificar el texto de los botones
        const estudiantesActions = [
          { label: 'Ver Detalles', onClick: (item) => abrirModal('view', 'estudiante', item.id) },
          { label: 'Editar', onClick: (item) => abrirModal('edit', 'estudiante', item.id) },
          { label: 'Eliminar', onClick: (item) => eliminarItem('estudiante', item.id) }
        ];

        return (
            <Table
              title="Lista de Estudiantes"
              columns={estudiantesColumns}
              data={estudiantes}
              searchPlaceholder="Buscar por nombre..."
              filterOptions={cursos}
              filterPlaceholder="Filtrar por Curso"
              addButtonText="Añadir Estudiante"
              actions={estudiantesActions}
              onAdd={() => abrirModal('create', 'estudiante')}
              loading={loading}
              error={error}
            />
          
        );
      case 'carga-masiva':
        const cargaMasivaSections = [
          {
            id: 'carga-estudiantes',
            title: 'Carga Masiva de Estudiantes',
            description: 'Importa múltiples estudiantes desde un archivo Excel o CSV.',
            icon: '👨‍🎓',
            buttonText: 'Cargar Estudiantes'
          }
        ];

        return (
          <>
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Carga Masiva</h1>
              <p className="gestion-academica-subtitle">Selecciona el tipo de carga masiva que deseas realizar</p>
            </div>

            <div className="gestion-academica-grid">
              {cargaMasivaSections.map((section) => (
                <div
                  key={section.id}
                  className="gestion-academica-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="gestion-academica-card-header">
                    <span className="gestion-academica-icon">{section.icon}</span>
                    <h3 className="gestion-academica-card-title">{section.title}</h3>
                  </div>
                  
                  <p className="gestion-academica-description">{section.description}</p>
                  
                  <button className="gestion-academica-button">
                    {section.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </>
        );
      case 'carga-estudiantes':
        // Función para abrir el selector de archivos directamente
        const openFileSelector = () => {
          console.log('openFileSelector called'); // Debug log
          if (estudiantesFileInputRef.current) {
            console.log('Clicking file input via ref'); // Debug log
            estudiantesFileInputRef.current.click();
          } else {
            console.log('File input ref not found'); // Debug log
          }
        };

        const handleEstudiantesFileChange = async (e) => {
          console.log('handleEstudiantesFileChange called', e); // Debug log
          const file = e.target.files?.[0] || null;
          console.log('Selected file:', file); // Debug log
          setSelectedEstudiantesFile(file);
          setEstudiantesUploadResult(null);
          setEstudiantesPreview(null);
          setEstudiantesValidationErrors([]);
          if (!file) return;
          if (!/\.(xlsx|xls)$/i.test(file.name)) {
            setEstudiantesValidationErrors(['Formato inválido. Solo se admite Excel (.xlsx/.xls).']);
            return;
          }
          try {
            const wb = await readWorkbook(file);

            // Cargar catálogos para validación
            const catalogs = await loadCatalogsForValidation();
            const catalogsIndex = buildCatalogIndex(catalogs);

            // Validar workbook completo
            const { errors, preview } = validateEstudiantesWorkbook(wb, catalogsIndex);

            setEstudiantesPreview(preview);
            setEstudiantesValidationErrors(errors);
            if (errors.length === 0) {
              // permitir edición en UI
              setEstudiantesEditableRows(preview.rows);
              setEstudiantesHeadersFromFile(preview.headers || null);
            } else {
              setEstudiantesEditableRows(null);
              setEstudiantesHeadersFromFile(null);
            }
          } catch (err) {
            console.error('Error leyendo Excel estudiantes:', err);
            setEstudiantesValidationErrors([`No se pudo leer el archivo Excel: ${err.message || err}`]);
          }
        };

        const handleEstudiantesUpload = async () => {
          alert('🚀 Función handleEstudiantesUpload ejecutada!');
          console.log('🚀 handleEstudiantesUpload iniciado');
          console.log('📁 Archivo seleccionado:', selectedEstudiantesFile);
          console.log('⚠️ Errores de validación:', estudiantesValidationErrors);
          console.log('📤 Estado de carga:', uploadingEstudiantes);
          
          if (!selectedEstudiantesFile) {
            console.log('❌ No hay archivo seleccionado');
            alert('❌ No hay archivo seleccionado');
            Swal.fire({ icon: 'warning', title: 'Sin archivo', text: 'Selecciona un archivo Excel (.xlsx).' });
            return;
          }
          
          if (estudiantesValidationErrors && estudiantesValidationErrors.length > 0) {
            console.log('❌ Hay errores de validación:', estudiantesValidationErrors);
            alert('❌ Hay errores de validación: ' + estudiantesValidationErrors.join(', '));
            Swal.fire({ icon: 'warning', title: 'Errores de validación', text: 'Corrige los errores antes de subir el archivo.' });
            return;
          }
          
          try {
            // Validación previa: asegurarse de que los fk_* referencien IDs válidos o nombres que existan en los catálogos
            let catalogos = catalogosCache;
            if (!catalogos) {
              try {
                const [tiposDocResp, generosResp, estadosResp, tiposSangreResp, sisbenResp, departamentosResp, ciudadesResp, tiposAcudienteResp] = await Promise.all([
                  catalogoAPI.getTiposDocumento(),
                  catalogoAPI.getGeneros(),
                  catalogoAPI.getEstados(),
                  catalogoAPI.getTiposSangre(),
                  catalogoAPI.getSisben(),
                  catalogoAPI.getDepartamentos(),
                  catalogoAPI.getCiudades(),
                  catalogoAPI.getTipoAcudiente()
                ]);
                catalogos = {
                  tiposDocumento: tiposDocResp.data,
                  generos: generosResp.data,
                  estados: estadosResp.data,
                  tiposSangre: tiposSangreResp.data,
                  sisben: sisbenResp.data,
                  departamentos: departamentosResp.data,
                  ciudades: ciudadesResp.data,
                  tiposAcudiente: tiposAcudienteResp.data
                };
                setCatalogosCache(catalogos);
              } catch (err) {
                console.warn('No se pudo obtener catálogos para validación previa:', err);
                catalogos = null;
              }
            }

            // Si hay catálogos disponibles, validar el Excel cargado contra ellos (simple check)
            if (catalogos) {
              // No hacemos parsing completo aquí; asumimos que el backend realizará la validación definitiva.
              // Solo bloquearemos si detectamos formatos claramente inválidos (p. ej. campos obligatorios vacíos)
              if (!selectedEstudiantesFile) throw new Error('No hay archivo seleccionado');
            }

            console.log('🔄 Iniciando carga...');
            alert('🔄 Iniciando carga del archivo...');
            setUploadingEstudiantes(true);
            const token = sessionStorage.getItem('token');
            console.log('📡 Llamando a estudiantesAPI.bulkUpload...');
            console.log('🔐 Token (localStorage.token) preview:', token ? `${token.slice(0,20)}...` : 'NO_TOKEN');
            // Llamada al API (se usa el interceptor que agrega Authorization)
            const resp = await estudiantesAPI.bulkUpload(selectedEstudiantesFile);
            console.log('✅ Respuesta recibida:', resp);
            setEstudiantesUploadResult(resp.data);
            Swal.fire({ icon: 'success', title: 'Carga completada', text: 'Se procesó el archivo correctamente.' });
            // Refrescar lista de estudiantes para reflejar los cambios
            try {
              await cargarEstudiantes();
              console.log('Lista de estudiantes actualizada después de la carga.');
            } catch (e) {
              console.warn('No se pudo refrescar la lista de estudiantes automáticamente:', e);
            }
          } catch (err) {
              console.error('❌ Error en carga masiva estudiantes:', err);
              console.error('📋 Detalles del error:', err.response?.data || err.message || err);
              console.error('🧾 Error.config (request):', err.config || null);
              console.error('🧾 Error.response (full):', err.response || null);
            // Manejo específico para 403 (Forbidden) - autenticación/permiso
            if (err.response && err.response.status === 403) {
              const msg = 'No tiene permiso para realizar esta acción. Inicie sesión con una cuenta autorizada.';
              alert('❌ Error: ' + msg);
              Swal.fire({ icon: 'error', title: 'Permisos insuficientes', text: msg });
            } else {
              alert('❌ Error: ' + (err.response?.data?.message || err.message || 'Error desconocido'));
              Swal.fire({ 
                icon: 'error', 
                title: 'Error', 
                text: err.response?.data?.message || err.message || 'No se pudo procesar el archivo.' 
              });
            }
          } finally {
            console.log('🏁 Finalizando carga...');
            setUploadingEstudiantes(false);
          }
        };

        const handleDownloadEstudiantesTemplate = async () => {
          try {
            console.log('🔥 DEBUG: Descargando plantilla desde servidor...');
            const response = await estudiantesAPI.downloadTemplate();
            
            // Crear blob y descargar
            const blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'plantilla_estudiantes.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            console.log('✅ Plantilla descargada exitosamente');
          } catch (error) {
            console.error('❌ Error al descargar plantilla:', error);
            alert('Error al descargar la plantilla. Por favor, intenta nuevamente.');
          }
        };

        // Eventos de drag and drop para estudiantes
        const handleEstudiantesDragOver = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleEstudiantesDragEnter = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleEstudiantesDragLeave = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleEstudiantesDrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.xlsx') || 
                file.name.endsWith('.xls')) {
              setSelectedEstudiantesFile(file);
              handleEstudiantesFileChange({ target: { files: [file] } });
            } else {
              Swal.fire({ icon: 'warning', title: 'Formato incorrecto', text: 'Solo se permiten archivos Excel (.xlsx, .xls).' });
            }
          }
        };

        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Carga Masiva de Estudiantes</h1>
              <p className="gestion-academica-subtitle">Importa múltiples estudiantes desde un archivo</p>
            </div>

            <div className="carga-masiva-content">
              <div className="upload-section">
                <div 
                  className="upload-area"
                  onDragOver={handleEstudiantesDragOver}
                  onDragEnter={handleEstudiantesDragEnter}
                  onDragLeave={handleEstudiantesDragLeave}
                  onDrop={handleEstudiantesDrop}
                >
                  <div className="upload-icon">📁</div>
                  <h3 className="Botonupload">Selecciona un archivo</h3>
                  <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                  <p className="file-types">Formatos soportados: .xlsx, .csv</p>
                  <input 
                    ref={estudiantesFileInputRef}
                    type="file" 
                    accept=".xlsx,.xls" 
                    style={{ display: 'none' }} 
                    id="file-upload-estudiantes"
                    onChange={handleEstudiantesFileChange}
                    onClick={(e) => console.log('Input clicked', e)} // Debug log
                  />
                  <button 
                    type="button"
                    className="upload-button"
                    onClick={openFileSelector}
                  >
                    Seleccionar Archivo
                  </button>
                </div>
                
                {/* Área separada para el botón de subir archivo */}
                {selectedEstudiantesFile && (
                  <div className="upload-actions" style={{ marginTop: '20px', padding: '15px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                    <div className="selected-file-info">
                      <span style={{ fontWeight: 'bold', color: '#28a745' }}>✅ Archivo seleccionado: {selectedEstudiantesFile.name}</span>
                    </div>
                    <button 
                      className="upload-button" 
                      onClick={() => {
                        alert('¡BOTÓN CLICKEADO! Esto confirma que el evento onClick funciona');
                        console.log('🔥 BOTÓN CLICKEADO - onClick funciona correctamente');
                        console.log('📊 Estado uploadingEstudiantes:', uploadingEstudiantes);
                        console.log('📊 Estado estudiantesValidationErrors:', estudiantesValidationErrors);
                        console.log('📊 Botón disabled?', uploadingEstudiantes || (estudiantesValidationErrors && estudiantesValidationErrors.length > 0));
                        handleEstudiantesUpload();
                      }}
                      disabled={false} // Temporalmente deshabilitamos la validación disabled
                      style={{ 
                        marginTop: '10px', 
                        padding: '12px 24px', 
                        fontSize: '16px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      {uploadingEstudiantes ? 'Subiendo...' : '📤 Subir Archivo a la Base de Datos'}
                    </button>
                  </div>
                )}
                {
                  estudiantesValidationErrors && estudiantesValidationErrors.length > 0 && (
                    <div className="validation-errors" style={{ marginTop: '12px', color: '#c0392b' }}>
                      <h4>Errores detectados</h4>
                      <ul>
                        {estudiantesValidationErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )
                }
                {
                estudiantesPreview && (
                  <div className="preview-controls" style={{ marginTop: '12px' }}>
                    <h4>Previsualización</h4>
                    <p>Filas detectadas: <strong>{estudiantesPreview.rowsCount}</strong></p>
                    {estudiantesValidationErrors && estudiantesValidationErrors.length > 0 ? (
                      <div style={{ marginTop: '8px', color: '#c0392b' }}>
                        <strong>Errores detectados:</strong>
                        <ul>
                          {estudiantesValidationErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )
                }
              </div>

              <div className="template-section">
                <h3>Plantilla de Ejemplo</h3>
                <p>Descarga la plantilla para asegurar el formato correcto de los datos</p>
                <button className="download-template-button" onClick={handleDownloadEstudiantesTemplate}>
                  📥 Descargar Plantilla de Estudiantes
                </button>
              </div>

              {estudiantesUploadResult && (
                <div className="results-section">
                  <h3>Resultado de la carga</h3>
                  <ul>
                    <li>Estudiantes creados: {estudiantesUploadResult.created}</li>
                    <li>Estudiantes actualizados: {estudiantesUploadResult.updated}</li>
                    <li>Errores estudiantes: {estudiantesUploadResult.errors?.length || 0}</li>
                  </ul>
                  {estudiantesUploadResult.acudientes && (
                    <>
                      <h4>Acudientes</h4>
                      <ul>
                        <li>Acudientes creados: {estudiantesUploadResult.acudientes.created}</li>
                        <li>Acudientes actualizados: {estudiantesUploadResult.acudientes.updated}</li>
                        <li>Relaciones creadas: {estudiantesUploadResult.acudientes.relaciones_creadas}</li>
                        <li>Errores acudientes: {estudiantesUploadResult.acudientes.errors?.length || 0}</li>
                      </ul>
                    </>
                  )}

                  {/* Mostrar errores detallados si existen */}
                  {estudiantesUploadResult.errors && estudiantesUploadResult.errors.length > 0 && (
                    <div style={{ marginTop: '12px', background: '#fff6f6', padding: '10px', borderRadius: '6px' }}>
                      <h4 style={{ color: '#c0392b' }}>Errores detallados</h4>
                      <p>Se produjeron errores al procesar algunas filas. Copia los detalles y pégalos aquí para diagnóstico.</p>
                      <pre style={{ maxHeight: '240px', overflow: 'auto', background: '#fff', padding: '8px', borderRadius: '4px' }}>{JSON.stringify(estudiantesUploadResult.errors, null, 2)}</pre>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <button
                          className="copy-errors-button"
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(JSON.stringify(estudiantesUploadResult.errors, null, 2));
                              Swal.fire({ icon: 'success', title: 'Copiado', text: 'Errores copiados al portapapeles.' });
                            } catch (e) {
                              console.error('Error copiando errores:', e);
                              Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo copiar al portapapeles.' });
                            }
                          }}
                        >
                          📋 Copiar errores
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="instructions-section">
                <h3>Instrucciones</h3>
                <ul>
                  <li>Usa la plantilla oficial. Incluye hojas: "Estudiantes" y "Acudientes".</li>
                  <li>Llena IDs de catálogos según valores existentes (tipo documento, ciudad, etc.).</li>
                  <li>La relación se crea con el campo "numero_documento_estudiante" en la hoja Acudientes.</li>
                  <li>Formatos soportados: Excel (.xlsx/.xls). No usar CSV.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'padres':
        // Columnas para padres de familia (usar el componente Table para igualar look & feel)
          const padresColumns = [
            { key: 'nombre', label: 'NOMBRE' },
            { key: 'identificacion', label: 'IDENTIFICACIÓN' },
            { key: 'telefono', label: 'TELÉFONO' },
            { key: 'municipio', label: 'MUNICIPIO' }
          ];

          const padresActions = [
            { label: 'Ver Detalles', onClick: (item) => abrirModal('view', 'acudiente', item.id) },
            { label: 'Editar', onClick: (item) => abrirModal('edit', 'acudiente', item.id) },
            { label: 'Asignar Estudiante', onClick: (item) => { setActivePadreId(item.id); setAssignModalOpen(true); } },
            { label: 'Eliminar', onClick: (item) => eliminarItem('acudiente', item.id) }
          ];

          return (
            <div>
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Padres de familia</h1>
              <p className="gestion-academica-subtitle">Registro manual de padres de familia. Para carga masiva usar la opción de Estudiantes (se crean vía estudiantes).</p>
            </div>
              

              <Table
                title="Lista de Padres"
                columns={padresColumns}
                data={padres}
                searchPlaceholder="Buscar por nombre..."
                addButtonText="Añadir Padre"
                actions={padresActions}
                onAdd={() => abrirModal('create', 'acudiente')}
              />

            {/* Modal para asignar estudiantes (componente dedicado) */}
            <AsignarEstudianteModal
              isOpen={assignModalOpen}
              onClose={() => { setAssignModalOpen(false); setActivePadreId(null); }}
              acudienteId={activePadreId}
              onSaved={async () => { await cargarPadres(); }}
            />
          </div>
        );
      case 'carga-profesores':
        // Función para abrir el selector de archivos de profesores directamente
        const openProfesoresFileSelector = () => {
          console.log('openProfesoresFileSelector called'); // Debug log
          if (profesoresFileInputRef.current) {
            console.log('Clicking profesores file input via ref'); // Debug log
            profesoresFileInputRef.current.click();
          } else {
            console.log('Profesores file input ref not found'); // Debug log
          }
        };

        const handleProfesoresFileChange = async (e) => {
          const file = e.target.files?.[0] || null;
          setSelectedProfesoresFile(file);
          setProfesoresUploadResult(null);
          setProfesoresPreview(null);
          setProfesoresValidationErrors([]);
          if (!file) return;
          if (!/\.(xlsx|xls)$/i.test(file.name)) {
            setProfesoresValidationErrors(['Formato inválido. Solo se admite Excel (.xlsx/.xls).']);
            return;
          }
          try {
            const wb = await readWorkbook(file);
            const catalogs = await loadCatalogsForValidation();
            const catalogsIndex = buildCatalogIndex(catalogs);
            const { errors, preview } = validateProfesoresWorkbook(wb, catalogsIndex);
            setProfesoresPreview(preview);
            setProfesoresValidationErrors(errors);
            if (errors.length === 0) {
              setProfesoresEditableRows(preview.rows);
              setProfesoresHeadersFromFile(preview.headers || null);
            } else {
              setProfesoresEditableRows(null);
              setProfesoresHeadersFromFile(null);
            }
          } catch (err) {
            console.error('Error leyendo Excel profesores:', err);
            setProfesoresValidationErrors([`No se pudo leer el archivo Excel: ${err.message || err}`]);
          }
        };

        const handleProfesoresUpload = async () => {
          if (!selectedProfesoresFile) {
            Swal.fire({ icon: 'warning', title: 'Sin archivo', text: 'Selecciona un archivo Excel (.xlsx).' });
            return;
          }
          if (profesoresValidationErrors && profesoresValidationErrors.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Errores de validación', text: 'Corrige los errores antes de subir el archivo.' });
            return;
          }

          try {
            let catalogos = catalogosCache;
            if (!catalogos) {
              try {
                const [tiposDocResp, generosResp, estadosResp, tiposSangreResp, sisbenResp, departamentosResp, ciudadesResp, tiposAcudienteResp] = await Promise.all([
                  catalogoAPI.getTiposDocumento(),
                  catalogoAPI.getGeneros(),
                  catalogoAPI.getEstados(),
                  catalogoAPI.getTiposSangre(),
                  catalogoAPI.getSisben(),
                  catalogoAPI.getDepartamentos(),
                  catalogoAPI.getCiudades(),
                  catalogoAPI.getTipoAcudiente()
                ]);
                catalogos = {
                  tiposDocumento: tiposDocResp.data,
                  generos: generosResp.data,
                  estados: estadosResp.data,
                  tiposSangre: tiposSangreResp.data,
                  sisben: sisbenResp.data,
                  departamentos: departamentosResp.data,
                  ciudades: ciudadesResp.data,
                  tiposAcudiente: tiposAcudienteResp.data
                };
                setCatalogosCache(catalogos);
              } catch (err) {
                console.warn('No se pudo obtener catálogos para validación previa (profesores):', err);
                catalogos = null;
              }
            }

            // Si hay catálogos disponibles, hacemos una validación previa ligera
            if (catalogos) {
              // No bloqueamos fuertemente; asumimos que el backend hará validación final
            }

            setUploadingProfesores(true);
            const resp = await profesoresAPI.bulkUpload(selectedProfesoresFile);
            setProfesoresUploadResult(resp.data);
            Swal.fire({ icon: 'success', title: 'Carga completada', text: 'Se procesó el archivo correctamente.' });
            try {
              await cargarProfesores();
            } catch (e) {
              console.warn('No se pudo refrescar la lista de profesores automáticamente:', e);
            }
          } catch (err) {
            console.error('Error en carga masiva profesores:', err);
            console.error('Detalles:', err.response?.data || err.message || err);
            if (err.response && err.response.status === 403) {
              Swal.fire({ icon: 'error', title: 'Permisos insuficientes', text: 'No tiene permiso para realizar esta acción.' });
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || err.message || 'No se pudo procesar el archivo.' });
            }
          } finally {
            setUploadingProfesores(false);
          }
        };

        const handleDownloadProfesoresTemplate = async () => {
          try {
            // Descargar la plantilla desde el backend (blob)
            const response = await profesoresAPI.downloadTemplate();
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'plantilla_profesores.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error('❌ Error al descargar plantilla profesores:', err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al descargar la plantilla. Por favor, intenta nuevamente.' });
          }
        };

        // Eventos de drag and drop para profesores
        const handleProfesoresDragOver = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleProfesoresDragEnter = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleProfesoresDragLeave = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        const handleProfesoresDrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.xlsx') || 
                file.name.endsWith('.xls')) {
              setSelectedProfesoresFile(file);
              handleProfesoresFileChange({ target: { files: [file] } });
            } else {
              Swal.fire({ icon: 'warning', title: 'Formato incorrecto', text: 'Solo se permiten archivos Excel (.xlsx, .xls).' });
            }
          }
        };

        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Carga Masiva de Profesores</h1>
              <p className="gestion-academica-subtitle">Importa múltiples profesores desde un archivo</p>
            </div>

            <div className="carga-masiva-content">
              <div className="upload-section">
                <div 
                  className="upload-area"
                  onDragOver={handleProfesoresDragOver}
                  onDragEnter={handleProfesoresDragEnter}
                  onDragLeave={handleProfesoresDragLeave}
                  onDrop={handleProfesoresDrop}
                >
                  <div className="upload-icon">📁</div>
                  <h3>Selecciona un archivo</h3>
                  <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                  <p className="file-types">Formatos soportados: .xlsx, .csv</p>
                  <input 
                    ref={profesoresFileInputRef}
                    type="file" 
                    accept=".xlsx,.xls" 
                    style={{ display: 'none' }} 
                    id="file-upload-profesores"
                    onChange={handleProfesoresFileChange}
                  />
                  <button 
                    type="button"
                    className="upload-button"
                    onClick={openProfesoresFileSelector}
                  >
                    Seleccionar Archivo
                  </button>
                  {selectedProfesoresFile && (
                    <div className="selected-file">
                      <span>Archivo: {selectedProfesoresFile.name}</span>
                      <button className="upload-button" onClick={handleProfesoresUpload} disabled={uploadingProfesores || (profesoresValidationErrors && profesoresValidationErrors.length > 0)}>
                        {uploadingProfesores ? 'Subiendo...' : 'Subir Archivo'}
                      </button>
                    </div>
                  )}
                  {
                    profesoresValidationErrors && profesoresValidationErrors.length > 0 && (
                      <div className="validation-errors" style={{ marginTop: '12px', color: '#c0392b' }}>
                        <h4>Errores detectados</h4>
                        <ul>
                          {profesoresValidationErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    )
                  }
                  {
                    profesoresPreview && (
                      <div className="preview-section" style={{ marginTop: '12px' }}>
                        <h4>Previsualización</h4>
                        <p>Filas detectadas: {profesoresPreview.rowsCount}</p>
                        {profesoresPreview.sample && profesoresPreview.sample.length > 0 && (
                          <div className="preview-table-wrapper" style={{ marginTop: '8px' }}>
                            <table className="preview-table">
                              <thead>
                                <tr>
                                  {(profesoresPreview.headers || Object.keys(profesoresPreview.sample[0] || {})).slice(0, 10).map((h) => (
                                    <th key={h}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {profesoresPreview.sample.map((row, ridx) => (
                                  <tr key={ridx}>
                                    {(profesoresPreview.headers || Object.keys(row)).slice(0, 10).map((col) => (
                                      <td key={col}>{String(row[col] ?? '')}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>Mostrando hasta 5 filas y primeras 10 columnas.</p>
                          </div>
                        )}
                        {profesoresEditableRows && profesoresEditableRows.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <h5>Editar filas antes de subir</h5>
                            <div className="edit-table-wrapper">
                              <table className="edit-table">
                                <thead>
                                  <tr>
                                    {(profesoresHeadersFromFile || Object.keys(profesoresEditableRows[0] || {})).map((h) => (
                                      <th key={h}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {profesoresEditableRows.map((row, ridx) => (
                                    <tr key={ridx}>
                                      {(profesoresHeadersFromFile || Object.keys(row)).map((col) => (
                                        <td key={col}>
                                          <input
                                            value={row[col] ?? ''}
                                            onChange={(e) => {
                                              const updated = [...profesoresEditableRows];
                                              updated[ridx] = { ...updated[ridx], [col]: e.target.value };
                                              setProfesoresEditableRows(updated);
                                            }}
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="table-actions" style={{ marginTop: '8px' }}>
                              <button className="upload-button" onClick={() => downloadWorkbookFromRows('profesores')}>
                                📥 Descargar corregido
                              </button>
                              <button className="upload-button" onClick={() => uploadEditedWorkbook('profesores')}>
                                📤 Subir versión corregida
                              </button>
                            </div>
                             {profesoresValidationErrors && profesoresValidationErrors.length > 0 && (
                                <div className="validation-errors" style={{ marginTop: '12px' }}>
                                  <h4 style={{ color: '#c0392b' }}>Errores detectados</h4>
                                  <div style={{ overflowX: 'auto', background: '#fff6f6', padding: '8px', borderRadius: '6px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr>
                                          <th style={{ border: '1px solid #ddd', padding: '6px', background: '#fee' }}>Fila</th>
                                          <th style={{ border: '1px solid #ddd', padding: '6px', background: '#fee' }}>Mensaje</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {profesoresValidationErrors.map((err, i) => {
                                          const m = String(err).match(/Fila\s*(\d+):\s*(.*)/i);
                                          const fila = m ? m[1] : '-';
                                          const msg = m ? m[2] : String(err);
                                          return (
                                            <tr key={i}>
                                              <td style={{ border: '1px solid #ddd', padding: '6px', width: '80px' }}>{fila}</td>
                                              <td style={{ border: '1px solid #ddd', padding: '6px' }}>{msg}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                             )}
                          </div>
                        )}
                      </div>
                    )
                  }
                </div>
              </div>

              <div className="template-section">
                <h3>Plantilla de Ejemplo</h3>
                <p>Descarga la plantilla para asegurar el formato correcto de los datos</p>
                <button className="download-template-button" onClick={handleDownloadProfesoresTemplate}>
                  📥 Descargar Plantilla de Profesores
                </button>
              </div>

              {profesoresUploadResult && (
                <div className="results-section">
                  <h3>Resultado de la carga</h3>
                  <ul>
                    <li>Profesores creados: {profesoresUploadResult.created}</li>
                    <li>Profesores actualizados: {profesoresUploadResult.updated}</li>
                    <li>Errores: {profesoresUploadResult.errors?.length || 0}</li>
                  </ul>
                </div>
              )}

              <div className="instructions-section">
                <h3>Instrucciones</h3>
                <ul>
                  <li>Usa la plantilla oficial para profesores.</li>
                  <li>Llena IDs de catálogos según valores existentes (tipo documento, ciudad, estado, etc.).</li>
                  <li>Formatos soportados: Excel (.xlsx/.xls). No usar CSV.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      
      <div className="gestion-academica-content">
        {currentSubSection ? (
          renderSubSection()
        ) : (
          <>
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Gestión de Usuarios</h1>
              <p className="gestion-academica-subtitle">Administra profesores y estudiantes del sistema académico</p>
            </div>

            <div className="gestion-academica-grid">
              {userSections.map((section) => (
                <div
                  key={section.id}
                  className="gestion-academica-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="gestion-academica-card-header">
                    <span className="gestion-academica-icon">{section.icon}</span>
                    <h3 className="gestion-academica-card-title">{section.title}</h3>
                  </div>
                  
                  <p className="gestion-academica-description">{section.description}</p>
                  
                  <button className="gestion-academica-button">
                    {section.buttonText}
                  </button>
                </div>
              ))}
            </div>
            {/* Modal de previsualización completo: componente separado para mayor fiabilidad */}
          </>
        )}
      </div>
    </div>
    <UsuarioModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      mode={modalMode}
      tipo={modalTipo}
      initialData={modalData}
      onSaved={() => {
        // Si guardamos un acudiente, recargar la lista
  if (modalTipo === 'acudiente') cargarPadres();
        if (onSaved) onSaved();
      }}
    />
    </>
  );
};

export default GestionUsuarios;