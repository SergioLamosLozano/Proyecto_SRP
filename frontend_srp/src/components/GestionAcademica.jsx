import React, { useState } from 'react';
import '../styles/GestionAcademica.css';
import Breadcrumbs from './Breadcrumbs';
import Table from './Table';

const GestionAcademica = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [activeAssignmentTab, setActiveAssignmentTab] = useState('materias-profesores');

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Gestión Académica', path: '/coordinacion/gestion-academica' },
    ...(currentSubSection ? [{ 
      label: currentSubSection === 'cursos' ? 'Gestión de Cursos' :
             currentSubSection === 'materias' ? 'Gestión de Materias' :
             currentSubSection === 'asignaciones' ? 'Gestión de Asignaciones' : currentSubSection,
      path: `/coordinacion/gestion-academica/${currentSubSection}` 
    }] : [])
  ];

  const academicSections = [
    {
      id: 'cursos',
      title: 'Cursos',
      description: 'Administra los cursos del programa académico, incluyendo horarios y asignaciones.',
      icon: '📖',
      buttonText: 'Gestionar Cursos'
    },
    {
      id: 'materias',
      title: 'Materias',
      description: 'Administra las materias del programa académico, incluyendo códigos, créditos y prerrequisitos.',
      icon: '📚',
      buttonText: 'Gestionar Materias'
    },
    {
      id: 'asignaciones',
      title: 'Asignaciones',
      description: 'Asigna materias a profesores y estudiantes a cursos específicos.',
      icon: '👥',
      buttonText: 'Gestionar Asignaciones'
    }
  ];

  // Datos de ejemplo basados en la estructura de la BD
  const [cursos, setCursos] = useState([
    {
      id_curso: 1,
      nombre: 'Sexto A',
      id_año_electivo: 1,
      año_electivo: '2024',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-11-30',
      estado: 'Activo'
    },
    {
      id_curso: 2,
      nombre: 'Séptimo B',
      id_año_electivo: 1,
      año_electivo: '2024',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-11-30',
      estado: 'Activo'
    },
    {
      id_curso: 3,
      nombre: 'Octavo A',
      id_año_electivo: 1,
      año_electivo: '2024',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-11-30',
      estado: 'Activo'
    }
  ]);

  const [materias, setMaterias] = useState([
    {
      id_materia: 1,
      nombre: 'Matemáticas',
      id_area_conocimiento: 1,
      area_conocimiento: 'Ciencias Exactas',
      porcentaje_ponderado: 25.0,
      estado: 'Activa'
    },
    {
      id_materia: 2,
      nombre: 'Ciencias Naturales',
      id_area_conocimiento: 2,
      area_conocimiento: 'Ciencias Naturales',
      porcentaje_ponderado: 20.0,
      estado: 'Activa'
    },
    {
      id_materia: 3,
      nombre: 'Español y Literatura',
      id_area_conocimiento: 3,
      area_conocimiento: 'Humanidades',
      porcentaje_ponderado: 20.0,
      estado: 'Activa'
    },
    {
      id_materia: 4,
      nombre: 'Tecnología e Informática',
      id_area_conocimiento: 4,
      area_conocimiento: 'Tecnología',
      porcentaje_ponderado: 15.0,
      estado: 'Activa'
    }
  ]);

  const [materiaProfesores, setMateriaProfesores] = useState([
    {
      id_materia_profesores: 1,
      id_materia: 1,
      numero_documento_profesor: '52847392',
      nombre_profesor: 'Dr. María Elena González',
      materia: 'Matemáticas',
      id_curso: 1,
      curso: 'Sexto A',
      usuario_creacion: 'admin',
      usuario_asignado: 'admin'
    },
    {
      id_materia_profesores: 2,
      id_materia: 2,
      numero_documento_profesor: '41739582',
      nombre_profesor: 'Lic. Roberto Martínez',
      materia: 'Ciencias Naturales',
      id_curso: 1,
      curso: 'Sexto A',
      usuario_creacion: 'admin',
      usuario_asignado: 'admin'
    }
  ]);

  const [profesores] = useState([
    {
      numero_documento_profesor: '52847392',
      nombre1: 'María',
      nombre2: 'Elena',
      apellido1: 'González',
      apellido2: 'Pérez',
      correo: 'maria.gonzalez@colegio.edu.co',
      direccion: 'Calle 123 #45-67',
      telefono1: '3001234567',
      telefono2: '6012345678'
    },
    {
      numero_documento_profesor: '41739582',
      nombre1: 'Roberto',
      nombre2: 'Carlos',
      apellido1: 'Martínez',
      apellido2: 'López',
      correo: 'roberto.martinez@colegio.edu.co',
      direccion: 'Carrera 89 #12-34',
      telefono1: '3009876543',
      telefono2: '6019876543'
    }
  ]);

  const [areasConocimiento] = useState([
    { id_area_conocimiento: 1, nombre: 'Ciencias Exactas' },
    { id_area_conocimiento: 2, nombre: 'Ciencias Naturales' },
    { id_area_conocimiento: 3, nombre: 'Humanidades' },
    { id_area_conocimiento: 4, nombre: 'Tecnología' },
    { id_area_conocimiento: 5, nombre: 'Educación Física' },
    { id_area_conocimiento: 6, nombre: 'Artes' }
  ]);

  // Datos de estudiantes para asignaciones
  const [estudiantes] = useState([
    {
      numero_documento_estudiante: '1234567890',
      nombre1: 'Juan',
      nombre2: 'Carlos',
      apellido1: 'Pérez',
      apellido2: 'González',
      correo: 'juan.perez@estudiante.edu.co',
      telefono: '3001234567',
      direccion: 'Calle 10 #20-30'
    },
    {
      numero_documento_estudiante: '0987654321',
      nombre1: 'Ana',
      nombre2: 'María',
      apellido1: 'López',
      apellido2: 'Martínez',
      correo: 'ana.lopez@estudiante.edu.co',
      telefono: '3009876543',
      direccion: 'Carrera 15 #25-35'
    },
    {
      numero_documento_estudiante: '1122334455',
      nombre1: 'Carlos',
      nombre2: 'Andrés',
      apellido1: 'Rodríguez',
      apellido2: 'Silva',
      correo: 'carlos.rodriguez@estudiante.edu.co',
      telefono: '3005556677',
      direccion: 'Avenida 30 #40-50'
    }
  ]);

  // Asignaciones de estudiantes a cursos
  const [estudianteCursos, setEstudianteCursos] = useState([
    {
      id_clases_estudiantes: 1,
      numero_documento_estudiante: '1234567890',
      nombre_estudiante: 'Juan Carlos Pérez González',
      id_curso: 1,
      curso: 'Sexto A',
      año_electivo: '2024',
      fecha_asignacion: '2024-02-01',
      estado: 'Activo'
    },
    {
      id_clases_estudiantes: 2,
      numero_documento_estudiante: '0987654321',
      nombre_estudiante: 'Ana María López Martínez',
      id_curso: 1,
      curso: 'Sexto A',
      año_electivo: '2024',
      fecha_asignacion: '2024-02-01',
      estado: 'Activo'
    },
    {
      id_clases_estudiantes: 3,
      numero_documento_estudiante: '1122334455',
      nombre_estudiante: 'Carlos Andrés Rodríguez Silva',
      id_curso: 2,
      curso: 'Séptimo B',
      año_electivo: '2024',
      fecha_asignacion: '2024-02-01',
      estado: 'Activo'
    }
  ]);

  const handleSectionClick = (sectionId) => {
    setCurrentSubSection(sectionId);
  };

  const handleNavigate = (path) => {
    if (path === '/coordinacion') {
      onBack();
    } else if (path === '/coordinacion/gestion-academica') {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split('/').pop();
      if (['cursos', 'materias', 'asignaciones'].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
    }
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 'cursos':
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Cursos</h2>
              <p className="gestion-academica-subtitle">Administra los cursos del programa académico</p>
            </div>
            
            <div className="table-actions">
              <button className="btn-primary">
                <span className="icon">➕</span>
                Agregar Curso
              </button>
            </div>

            <Table
              data={cursos}
              columns={[
                { key: 'id_curso', label: 'ID', sortable: true },
                { key: 'nombre', label: 'Nombre del Curso', sortable: true },
                { key: 'año_electivo', label: 'Año Electivo', sortable: true },
                { key: 'fecha_inicio', label: 'Fecha Inicio', sortable: true },
                { key: 'fecha_fin', label: 'Fecha Fin', sortable: true },
                { key: 'estado', label: 'Estado', sortable: true }
              ]}
              actions={[
                { label: 'Editar', icon: '✏️', variant: 'edit' },
                { label: 'Eliminar', icon: '🗑️', variant: 'delete' }
              ]}
              onAction={(action, item) => {
                console.log(`Acción ${action} en curso:`, item);
              }}
              searchable={true}
              searchPlaceholder="Buscar cursos..."
            />
          </div>
        );
      case 'materias':
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Materias</h2>
              <p className="gestion-academica-subtitle">Administra las materias del programa académico</p>
            </div>
            
            <div className="table-actions">
              <button className="btn-primary">
                <span className="icon">➕</span>
                Agregar Materia
              </button>
            </div>

            <Table
              data={materias}
              columns={[
                { key: 'id_materia', label: 'ID', sortable: true },
                { key: 'nombre', label: 'Nombre de la Materia', sortable: true },
                { key: 'area_conocimiento', label: 'Área de Conocimiento', sortable: true },
                { key: 'porcentaje_ponderado', label: 'Porcentaje (%)', sortable: true },
                { key: 'estado', label: 'Estado', sortable: true }
              ]}
              actions={[
                { label: 'Editar', icon: '✏️', variant: 'edit' },
                { label: 'Eliminar', icon: '🗑️', variant: 'delete' }
              ]}
              onAction={(action, item) => {
                console.log(`Acción ${action} en materia:`, item);
              }}
              searchable={true}
              searchPlaceholder="Buscar materias..."
            />
          </div>
        );
      case 'asignaciones':
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Asignaciones</h2>
              <p className="gestion-academica-subtitle">Asigna materias a profesores y estudiantes a cursos</p>
            </div>
            
            <div className="asignaciones-tabs">
              <button 
                className={`tab-button ${activeAssignmentTab === 'materias-profesores' ? 'active' : ''}`}
                onClick={() => setActiveAssignmentTab('materias-profesores')}
              >
                Materias - Profesores
              </button>
              <button 
                className={`tab-button ${activeAssignmentTab === 'estudiantes-cursos' ? 'active' : ''}`}
                onClick={() => setActiveAssignmentTab('estudiantes-cursos')}
              >
                Estudiantes - Cursos
              </button>
            </div>

            <div className="table-actions">
              <button className="btn-primary">
                <span className="icon">➕</span>
                {activeAssignmentTab === 'materias-profesores' ? 'Nueva Asignación Materia-Profesor' : 'Nueva Asignación Estudiante-Curso'}
              </button>
            </div>

            {activeAssignmentTab === 'materias-profesores' ? (
              <Table
                data={materiaProfesores}
                columns={[
                  { key: 'id_materia_profesores', label: 'ID', sortable: true },
                  { key: 'materia', label: 'Materia', sortable: true },
                  { key: 'nombre_profesor', label: 'Profesor', sortable: true },
                  { key: 'curso', label: 'Curso', sortable: true },
                  { key: 'usuario_creacion', label: 'Creado por', sortable: true },
                  { key: 'usuario_asignado', label: 'Asignado por', sortable: true }
                ]}
                actions={[
                  { label: 'Editar', icon: '✏️', variant: 'edit' },
                  { label: 'Eliminar', icon: '🗑️', variant: 'delete' }
                ]}
                onAction={(action, item) => {
                  console.log(`Acción ${action} en asignación materia-profesor:`, item);
                }}
                searchable={true}
                searchPlaceholder="Buscar asignaciones materia-profesor..."
              />
            ) : (
              <Table
                data={estudianteCursos}
                columns={[
                  { key: 'id_clases_estudiantes', label: 'ID', sortable: true },
                  { key: 'numero_documento_estudiante', label: 'Doc. Estudiante', sortable: true },
                  { key: 'nombre_estudiante', label: 'Estudiante', sortable: true },
                  { key: 'curso', label: 'Curso', sortable: true },
                  { key: 'año_electivo', label: 'Año Electivo', sortable: true },
                  { key: 'fecha_asignacion', label: 'Fecha Asignación', sortable: true },
                  { key: 'estado', label: 'Estado', sortable: true }
                ]}
                actions={[
                  { label: 'Editar', icon: '✏️', variant: 'edit' },
                  { label: 'Eliminar', icon: '🗑️', variant: 'delete' }
                ]}
                onAction={(action, item) => {
                  console.log(`Acción ${action} en asignación estudiante-curso:`, item);
                }}
                searchable={true}
                searchPlaceholder="Buscar asignaciones estudiante-curso..."
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      
      <div className="gestion-academica-content">
        {currentSubSection ? (
          renderSubSection()
        ) : (
          <>
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Gestión Académica</h1>
              <p className="gestion-academica-subtitle">Administra cursos, materias, asignaciones de profesores y la estructura académica general</p>
            </div>

            <div className="gestion-academica-grid">
              {academicSections.map((section) => (
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
        )}
      </div>
    </div>
  );
};

export default GestionAcademica;