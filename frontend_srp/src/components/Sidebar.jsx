import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ currentView, onNavigate, isMobile, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '📊' },
    { id: 'gestion-academica', label: 'Gestión Académica', icon: '📚' },
    { id: 'gestion-usuarios', label: 'Gestión de Usuarios', icon: '👥' },
    { id: 'calificaciones', label: 'Calificaciones', icon: '📝' },
    { id: 'reportes', label: 'Reportes y Estadísticas', icon: '📈' }
  ];

  const sidebarClasses = `sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`;

  return (
    <div className={sidebarClasses}>
      <div className="sidebar-header">
        <p className="sidebar-subtitle">Sistema de Gestión Académica</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
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