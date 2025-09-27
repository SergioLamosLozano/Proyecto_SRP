import React, { useState } from 'react';
import '../styles/GestionAcademica.css';
import Breadcrumbs from './Breadcrumbs';
import Table from './Table';

const GestionAcademica = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Gestión Académica', path: '/coordinacion/gestion-academica' },
    ...(currentSubSection ? [{ 
      label: currentSubSection === 'materias' ? 'Gestión de Materias' :
             currentSubSection === 'profesores' ? 'Gestión de Profesores' :
             currentSubSection === 'estudiantes' ? 'Gestión de Estudiantes' : currentSubSection,
      path: `/coordinacion/gestion-academica/${currentSubSection}` 
    }] : [])
  ];

  const academicSections = [
    {
      id: 'materias',
      title: 'Materias',
      description: 'Administra las materias del programa académico, incluyendo códigos, créditos y prerrequisitos.',
      icon: '📖',
      buttonText: 'Gestionar Materias'
    },
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
    }
  ];

  const estudiantes = [
    {
      id: 1,
      nombre: 'Ana María Rojas',
      identificacion: '1002938475',
      curso: 'Sexto A',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Carlos Andrés Pérez',
      identificacion: '1003485769',
      curso: 'Séptimo B',
      estado: 'Activo'
    }
  ];

  const cursos = ['Todos', 'Sexto A', 'Séptimo B', 'Octavo A', 'Noveno B'];

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
      if (['materias', 'profesores', 'estudiantes'].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
    }
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 'materias':
        return (
          <div className="gestion-academica-subsection">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Materias</h2>
              <p className="gestion-academica-subtitle">Administra las materias del programa académico</p>
            </div>
            {/* Contenido de materias se implementará próximamente */}
          </div>
        );
      case 'profesores':
        return (
          <div className="gestion-academica-subsection">
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Profesores</h2>
              <p className="gestion-academica-subtitle">Administra la información de los profesores</p>
            </div>
            {/* Contenido de profesores se implementará próximamente */}
          </div>
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
          { key: 'view', label: 'Ver Detalles', type: 'view' },
          { key: 'edit', label: 'Editar', type: 'edit' },
          { key: 'delete', label: 'Eliminar', type: 'delete' }
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
              onAdd={() => console.log('Añadir estudiante')}
              onAction={(action, item) => console.log(action, item)}
            />
          
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