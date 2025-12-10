import React, { useState } from "react";
import "../styles/Coordinacion.css";
import "../styles/Dashboard.css";
import Breadcrumbs from "./Breadcrumbs";

const DashboardDocentes = ({ onNavigate }) => {
  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Pagina Docentes", path: "/docentes" },
  ];

  const dashboardSections = [
    {
      id: "materias-asignadas",
      title: "Materias Asignadas",
      description:
        "En este apartado se mostrarán las materias que se le han asignado como docente.",
      icon: "📓",
      buttonText: "Ingresar",
    },
    {
      id: "gestion-actividades",
      title: "Gestión de Actividades",
      description:
        "Crea, edita y administra las actividades que se han puesto en los diferentes cursos.",
      icon: "✍️",
      buttonText: "Gestionar",
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
          <h1 className="dashboard-title">Docentes</h1>
          <p className="dashboard-subtitle">Panel de control</p>
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

export default DashboardDocentes;
