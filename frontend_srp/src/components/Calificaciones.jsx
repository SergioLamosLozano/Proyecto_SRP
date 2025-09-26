import React, { useState } from 'react';
import '../styles/Coordinacion.css';
import Breadcrumbs from './Breadcrumbs';

const Calificaciones = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Calificaciones', path: '/coordinacion/calificaciones' }
  ];

  const calificationSections = [
    {
      id: 'cno',
      title: 'CNO',
      description: 'Accede al sistema CNO para la gestión de calificaciones y certificaciones.',
      icon: '🎓',
      buttonText: 'Acceder a CNO'
    },
    {
      id: 'carga-masiva',
      title: 'Carga Masiva',
      description: 'Realiza carga masiva de calificaciones mediante archivos Excel o CSV.',
      icon: '📊',
      buttonText: 'Cargar Calificaciones'
    }
  ];

  const cursos = ['Sexto A', 'Sexto B', 'Séptimo A', 'Séptimo B', 'Octavo A', 'Noveno B'];
  const materias = ['Matemáticas', 'Español', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'];
  const periodos = ['Primer Período', 'Segundo Período', 'Tercer Período', 'Cuarto Período'];

  const calificaciones = [
    {
      id: 1,
      estudiante: 'Ana María Rojas',
      identificacion: '1002938475',
      nota1: 4.2,
      nota2: 3.8,
      nota3: 4.5,
      promedio: 4.17
    },
    {
      id: 2,
      estudiante: 'Carlos Andrés Pérez',
      identificacion: '1003485769',
      nota1: 3.5,
      nota2: 4.0,
      nota3: 3.8,
      promedio: 3.77
    }
  ];

  const containerStyle = {
    padding: '20px',
    backgroundColor: 'var(--gris-claro-fondo)',
    minHeight: '100vh'
  };

  const headerStyle = {
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--gris-principal)',
    margin: 0
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: 'var(--gris-secundario)',
    margin: '8px 0 0 0'
  };

  const contentStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const cardStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: 'fit-content'
  };

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  };

  const iconStyle = {
    fontSize: '24px',
    marginRight: '12px'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--gris-principal)',
    margin: 0
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: 'var(--gris-secundario)',
    lineHeight: '1.5',
    marginBottom: '20px'
  };

  const buttonStyle = {
    backgroundColor: 'var(--rojo-institucional)',
    color: 'var(--blanco)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease'
  };

  const backButtonStyle = {
    backgroundColor: 'var(--gris-secundario)',
    color: 'var(--blanco)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease'
  };

  const handleSectionClick = (sectionId) => {
    setCurrentSubSection(sectionId);
  };

  const handleBackToSections = () => {
    setCurrentSubSection(null);
  };

  const renderSubSection = () => {
    switch (currentSubSection) {
      case 'cno':
        return (
          <div>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Sistema CNO</h2>
              <p style={subtitleStyle}>Accede al sistema CNO para gestión de calificaciones</p>
            </div>
            <div style={contentStyle}>
              <p>Funcionalidad de acceso al sistema CNO en desarrollo...</p>
            </div>
          </div>
        );
      case 'carga-masiva':
        return (
          <div>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Carga Masiva de Calificaciones</h2>
              <p style={subtitleStyle}>Carga masiva mediante archivos Excel o CSV</p>
            </div>
            <div style={contentStyle}>
              <p>Funcionalidad de carga masiva en desarrollo...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const filtersContainerStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--gris-principal)'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid var(--borde-color)',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'var(--blanco)',
    color: 'var(--gris-principal)'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  };

  const tableContainerStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  };

  const thStyle = {
    backgroundColor: 'var(--gris-claro-fondo)',
    color: 'var(--gris-principal)',
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '1px solid var(--borde-color)'
  };

  const tdStyle = {
    padding: '12px 8px',
    borderBottom: '1px solid var(--borde-color)',
    verticalAlign: 'middle',
    color: 'var(--gris-principal)'
  };

  const getNotaColor = (nota) => {
    if (nota >= 4.0) return 'var(--success-color, #28a745)';
    if (nota >= 3.0) return 'var(--warning-color, #ffc107)';
    return 'var(--error-color, #dc3545)';
  };

  const getPromedioColor = (promedio) => {
    if (promedio >= 4.0) return 'var(--success-color, #28a745)';
    if (promedio >= 3.0) return 'var(--warning-color, #ffc107)';
    return 'var(--error-color, #dc3545)';
  };

  const inputStyle = {
    padding: '4px 8px',
    border: '1px solid var(--borde-color)',
    borderRadius: '4px',
    fontSize: '12px',
    width: '60px',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <Breadcrumbs items={breadcrumbItems} onNavigate={onBack} />
      
      {currentSubSection ? (
        renderSubSection()
      ) : (
        <>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Calificaciones</h2>
            <p style={subtitleStyle}>Gestión de calificaciones y certificaciones académicas</p>
          </div>

          <div style={gridStyle}>
            {calificationSections.map((section) => (
              <div
                key={section.id}
                style={cardStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, cardHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, cardStyle);
                }}
                onClick={() => handleSectionClick(section.id)}
              >
                <div style={cardHeaderStyle}>
                  <span style={iconStyle}>{section.icon}</span>
                  <h3 style={cardTitleStyle}>{section.title}</h3>
                </div>
                <p style={descriptionStyle}>{section.description}</p>
                <button
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--rojo-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--rojo-institucional)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectionClick(section.id);
                  }}
                >
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

export default Calificaciones;