import React, { useState } from 'react';
import '../styles/Coordinacion.css';
import '../styles/Sidebar.css';

const Sidebar = ({ currentView, onNavigate }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard (Inicio)',
      icon: '🏠'
    },
    {
      id: 'gestion-academica',
      label: 'Gestión Académica',
      icon: '📚'
    },
    {
      id: 'gestion-usuarios',
      label: 'Gestión de Usuarios',
      icon: '👥'
    },
    {
      id: 'calificaciones',
      label: 'Calificaciones',
      icon: '📊'
    },
    {
      id: 'reportes',
      label: 'Reportes y Estadísticas',
      icon: '📈'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-subtitle">Panel de Coordinación Administrativa</p>
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;