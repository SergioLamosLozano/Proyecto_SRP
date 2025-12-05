import React, { useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({
  currentView,
  onNavigate,
  isMobile,
  isOpen,
  menu = "coordinacion",
  collapsed,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [hover, sethover] = useState(true);
  const menuItems = [
    { id: "dashboard", label: "Inicio", icon: "📊" },
    { id: "gestion-academica", label: "Gestión Académica", icon: "📚" },
    { id: "gestion-usuarios", label: "Gestión de Usuarios", icon: "👥" },
    { id: "calificaciones", label: "Calificaciones", icon: "📝" },
    { id: "reportes", label: "Reportes y Estadísticas", icon: "📈" },
  ];

  const menuItemsDocentes = [
    { id: "dashboard", label: "Inicio", icon: "📊" },
    { id: "materias-asignadas", label: "Gestión Académica", icon: "📓" },
    { id: "gestion-actividades", label: "Gestión de Usuarios", icon: "✍️" },
  ];

  const menuNuevo = menu == "coordinacion" ? menuItems : menuItemsDocentes;

  const sidebarClasses = `sidebar ${isMobile ? "mobile" : ""} ${
    isOpen ? "open" : ""
  } ${collapsed && !isMobile && !isOpen ? "collapsed" : ""}`;

  return (
    <div
      className={sidebarClasses}
      onMouseEnter={() => {
        sethover(false);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        sethover(true);
        if (onMouseLeave) onMouseLeave();
      }}
    >
      <div className="sidebar-header">
        {hover ? (
          <p className="sidebar-subtitle">SGA</p>
        ) : (
          <p className="sidebar-subtitle">Sistema de Gestión Académica</p>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuNuevo.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            aria-label={item.label}
          >
            <span className="menu-icon" aria-hidden>
              {item.icon}
            </span>
            <span className="menu-text">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
