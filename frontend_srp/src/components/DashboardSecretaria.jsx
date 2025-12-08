import React, { useState } from "react";
import "../styles/Coordinacion.css";
import "../styles/Dashboard.css";
import Breadcrumbs from "./Breadcrumbs";

const DashboardS = ({ onNavigate }) => {
  const breadcrumbItems = [
    { label: "Inicio", path: "/secretaria" },
    { label: "Secretaria academica", path: "/secretaria" },
  ];

  const dashboardSections = [
    {
      id: "gestion-academica",
      title: "Gestión Académica",
      description:
        "Administra cursos, materias, asignaciones de profesores y la estructura académica general.",
      icon: "📚",
      buttonText: "Gestionar",
    },
    {
      id: "gestion-usuarios",
      title: "Gestión de Usuarios",
      description:
        "Crea, edita y administra los perfiles de los estudiantes y profesores. Incluye la carga masiva de usuarios.",
      icon: "👥",
      buttonText: "Gestionar",
    },
    {
      id: "calificaciones",
      title: "Calificaciones",
      description:
        "Consulta, introduce y modifica las calificaciones de los estudiantes por curso, materia o período académico.",
      icon: "📊",
      buttonText: "Ver Calificaciones",
    },
    {
      id: "reportes",
      title: "Reportes y Estadísticas",
      description:
        "Genera informes personalizables y visualiza gráficos de rendimiento para la toma de decisiones.",
      icon: "📈",
      buttonText: "Ver Reportes",
    },
  ];

  const handleCardClick = (sectionId) => {
    onNavigate(sectionId);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Secretaria academica</h1>
          <p className="dashboard-subtitle">
            Panel de control - Gestión administrativa y recursos
          </p>
        </div>

        <div className="dashboard-grid">
          {dashboardSections.map((section) => (
            <div
              key={section.id}
              className="dashboard-card"
              onClick={() => handleCardClick(section.id)}
            >
              <div className="card-header">
                <span className="card-icon">{section.icon}</span>
                <h3 className="card-title">{section.title}</h3>
              </div>

              <p className="card-description">{section.description}</p>

              <button className="card-button">{section.buttonText}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardS;
