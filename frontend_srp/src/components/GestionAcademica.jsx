import React, { useState } from 'react';
import '../styles/Coordinacion.css';
import '../styles/GestionAcademica.css';
import Breadcrumbs from './Breadcrumbs';

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

  // Datos de ejemplo basados en la imagen
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
      // Handle subsection navigation if needed
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
          <div>
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Materias</h2>
              <p className="gestion-academica-subtitle">Administra las materias del programa académico</p>
            </div>
            <div className="gestion-academica-content">
              <p>Funcionalidad de gestión de materias en desarrollo...</p>
            </div>
          </div>
        );
      case 'profesores':
        return (
          <div>
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Profesores</h2>
              <p className="gestion-academica-subtitle">Administra la información de los profesores</p>
            </div>
            <div className="gestion-academica-content">
              <p>Funcionalidad de gestión de profesores en desarrollo...</p>
            </div>
          </div>
        );
      case 'estudiantes':
        return (
          <div>
            <div className="gestion-academica-header">
              <h2 className="gestion-academica-title">Gestión de Estudiantes</h2>
              <p className="gestion-academica-subtitle">Administra los registros de estudiantes</p>
            </div>
            <div className="gestion-academica-content">
              <p>Funcionalidad de gestión de estudiantes en desarrollo...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="gestion-academica-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      
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
  );
};

export default GestionAcademica;