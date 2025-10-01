import React, { useState } from 'react';
import '../styles/GestionAcademica.css';
import Breadcrumbs from './Breadcrumbs';
import Table from './Table';

const GestionUsuarios = ({ onBack }) => {
  const [currentSubSection, setCurrentSubSection] = useState(null);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/coordinacion' },
    { label: 'Coordinación Administrativa', path: '/coordinacion' },
    { label: 'Gestión de Usuarios', path: '/coordinacion/gestion-usuarios' },
    ...(currentSubSection
      ? currentSubSection === 'carga-estudiantes' || currentSubSection === 'carga-profesores'
        ? [
            { label: 'Carga Masiva', path: '/coordinacion/gestion-usuarios/carga-masiva' },
            {
              label: currentSubSection === 'carga-estudiantes' ? 'Estudiantes' : 'Profesores',
              path: `/coordinacion/gestion-usuarios/${currentSubSection}`
            }
          ]
        : [
            {
              label:
                currentSubSection === 'profesores'
                  ? 'Gestión de Profesores'
                  : currentSubSection === 'estudiantes'
                  ? 'Gestión de Estudiantes'
                  : currentSubSection === 'carga-masiva'
                  ? 'Carga Masiva'
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
      id: 'carga-masiva',
      title: 'Carga Masiva',
      description: 'Realiza carga masiva de datos para estudiantes y profesores mediante archivos.',
      icon: '📤',
      buttonText: 'Carga Masiva'
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

  const profesores = [
    {
      id: 1,
      nombre: 'Dr. María Elena González',
      identificacion: '52847392',
      materia: 'Matemáticas',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Lic. Roberto Martínez',
      identificacion: '41739582',
      materia: 'Ciencias Naturales',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Mg. Carmen Lucía Herrera',
      identificacion: '38294756',
      materia: 'Español y Literatura',
      estado: 'Activo'
    },
    {
      id: 4,
      nombre: 'Ing. José Luis Ramírez',
      identificacion: '29384756',
      materia: 'Tecnología e Informática',
      estado: 'Inactivo'
    }
  ];

  const cursos = ['Todos', 'Sexto A', 'Séptimo B', 'Octavo A', 'Noveno B'];
  const materias = ['Todas', 'Matemáticas', 'Ciencias Naturales', 'Español y Literatura', 'Tecnología e Informática', 'Educación Física', 'Ciencias Sociales'];

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
      if (['profesores', 'estudiantes', 'carga-masiva', 'carga-estudiantes', 'carga-profesores'].includes(subsection)) {
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
          { key: 'view', label: 'Ver Detalles', type: 'view' },
          { key: 'edit', label: 'Editar', type: 'edit' },
          { key: 'delete', label: 'Eliminar', type: 'delete' }
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
            onAdd={() => console.log('Añadir profesor')}
            onAction={(action, item) => console.log(action, item)}
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
      case 'carga-masiva':
        const cargaMasivaSections = [
          {
            id: 'carga-estudiantes',
            title: 'Carga Masiva de Estudiantes',
            description: 'Importa múltiples estudiantes desde un archivo Excel o CSV.',
            icon: '👨‍🎓',
            buttonText: 'Cargar Estudiantes'
          },
          {
            id: 'carga-profesores',
            title: 'Carga Masiva de Profesores',
            description: 'Importa múltiples profesores desde un archivo Excel o CSV.',
            icon: '👨‍🏫',
            buttonText: 'Cargar Profesores'
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
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Carga Masiva de Estudiantes</h1>
              <p className="gestion-academica-subtitle">Importa múltiples estudiantes desde un archivo</p>
            </div>

            <div className="carga-masiva-content">
              <div className="upload-section">
                <div className="upload-area">
                  <div className="upload-icon">📁</div>
                  <h3>Selecciona un archivo</h3>
                  <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                  <p className="file-types">Formatos soportados: .xlsx, .csv</p>
                  <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    style={{ display: 'none' }} 
                    id="file-upload-estudiantes"
                  />
                  <label htmlFor="file-upload-estudiantes" className="upload-button">
                    Seleccionar Archivo
                  </label>
                </div>
              </div>

              <div className="template-section">
                <h3>Plantilla de Ejemplo</h3>
                <p>Descarga la plantilla para asegurar el formato correcto de los datos</p>
                <button className="download-template-button">
                  📥 Descargar Plantilla de Estudiantes
                </button>
              </div>

              <div className="instructions-section">
                <h3>Instrucciones</h3>
                <ul>
                  <li>El archivo debe contener las columnas: Nombre, Identificación, Curso, Estado</li>
                  <li>Los datos deben estar en formato de texto</li>
                  <li>El estado debe ser "Activo" o "Inactivo"</li>
                  <li>No incluir filas vacías</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'carga-profesores':
        return (
          <div className="dashboard-section">
            <div className="gestion-academica-header">
              <h1 className="gestion-academica-title">Carga Masiva de Profesores</h1>
              <p className="gestion-academica-subtitle">Importa múltiples profesores desde un archivo</p>
            </div>

            <div className="carga-masiva-content">
              <div className="upload-section">
                <div className="upload-area">
                  <div className="upload-icon">📁</div>
                  <h3>Selecciona un archivo</h3>
                  <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                  <p className="file-types">Formatos soportados: .xlsx, .csv</p>
                  <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    style={{ display: 'none' }} 
                    id="file-upload-profesores"
                  />
                  <label htmlFor="file-upload-profesores" className="upload-button">
                    Seleccionar Archivo
                  </label>
                </div>
              </div>

              <div className="template-section">
                <h3>Plantilla de Ejemplo</h3>
                <p>Descarga la plantilla para asegurar el formato correcto de los datos</p>
                <button className="download-template-button">
                  📥 Descargar Plantilla de Profesores
                </button>
              </div>

              <div className="instructions-section">
                <h3>Instrucciones</h3>
                <ul>
                  <li>El archivo debe contener las columnas: Nombre, Identificación, Materia, Estado</li>
                  <li>Los datos deben estar en formato de texto</li>
                  <li>El estado debe ser "Activo" o "Inactivo"</li>
                  <li>No incluir filas vacías</li>
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
          </>
        )}
      </div>
    </div>
  );
};

export default GestionUsuarios;