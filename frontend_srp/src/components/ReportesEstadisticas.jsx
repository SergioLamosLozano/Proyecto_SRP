import React, { useState } from 'react';
import '../styles/Coordinacion.css';
import Breadcrumbs from './Breadcrumbs';
import EstadisticasCompletas from './EstadisticasCompletas';

const ReportesEstadisticas = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Reportes y Estadísticas', path: '/coordinacion/reportes' },
    ...(currentSubSection ? [{ 
      label: currentSubSection === 'reportes' ? 'Reportes Académicos' :
             currentSubSection === 'estadistica' ? 'Estadísticas Académicas' : 'Estadísticas Académicas',
      path: `/coordinacion/reportes/${currentSubSection}` 
    }] : [])
  ];
  
  const handleNavigate = (path) => {
    if (path === '/coordinacion') {
      onBack();
    } else if (path === '/coordinacion/reportes') {
      setCurrentSubSection(null);
    } else {
      const subsection = path.split('/').pop();
      if (['reportes', 'estadistica'].includes(subsection)) {
        setCurrentSubSection(subsection);
      }
    }
  };

  const reportSections = [
    {
      id: 'reportes',
      title: 'Reportes',
      description: 'Genera reportes académicos detallados de rendimiento, asistencia y calificaciones.',
      icon: '📊',
      buttonText: 'Ver Reportes'
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas',
      description: 'Consulta estadísticas generales y análisis comparativos del rendimiento académico.',
      icon: '📈',
      buttonText: 'Ver Estadísticas'
    }
  ];

  const containerStyle = {
    padding: '20px',
    paddingTop: '160px', /* Espacio para navbar + breadcrumb */
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
      case 'reportes':
        return (
          <div>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Reportes Académicos</h2>
              <p style={subtitleStyle}>Genera reportes detallados de rendimiento académico</p>
            </div>
            <div style={contentStyle}>
              <p>Funcionalidad de generación de reportes en desarrollo...</p>
            </div>
          </div>
        );
      case 'estadisticas':
        return <EstadisticasCompletas onBack={handleBackToSections} />;
      default:
        return null;
    }
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--rojo-institucional)',
    margin: '0 0 5px 0'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: 'var(--gris-secundario)',
    margin: 0
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

  const reportPreviewStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '20px'
  };

  const chartPlaceholderStyle = {
    width: '100%',
    height: '200px',
    backgroundColor: 'var(--gris-claro-fondo)',
    border: '2px dashed var(--borde-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: 'var(--gris-secundario)',
    fontSize: '16px'
  };

  const quickActionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  };

  const quickActionCardStyle = {
    backgroundColor: 'var(--blanco)',
    border: '1px solid var(--borde-color)',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center'
  };

  const quickActionIconStyle = {
    fontSize: '24px',
    marginBottom: '10px'
  };

  const quickActionTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--gris-principal)',
    margin: 0
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      
      <div className="dashboard-content">
        {currentSubSection ? (
          renderSubSection()
        ) : (
          <>
            <div className="dashboard-header">
              <h1 className="dashboard-title">Reportes y Estadísticas</h1>
              <p className="dashboard-subtitle">Genera reportes y consulta estadísticas académicas</p>
            </div>

            <div className="dashboard-grid">
              {reportSections.map((section) => (
                <div
                  key={section.id}
                  className="dashboard-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="card-header">
                    <span className="card-icon">{section.icon}</span>
                    <h3 className="card-title">{section.title}</h3>
                  </div>
                  <p className="card-description">{section.description}</p>
                  <button className="card-button">
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

export default ReportesEstadisticas;