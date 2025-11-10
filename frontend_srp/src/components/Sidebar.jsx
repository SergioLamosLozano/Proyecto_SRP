import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ currentView, onNavigate, isMobile, isOpen, collapsed, onMouseEnter, onMouseLeave }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '📊' },
    { id: 'gestion-academica', label: 'Gestión Académica', icon: '📚' },
    { id: 'gestion-usuarios', label: 'Gestión de Usuarios', icon: '👥' },
    { id: 'calificaciones', label: 'Calificaciones', icon: '📝' },
    { id: 'reportes', label: 'Reportes y Estadísticas', icon: '📈' }
  ];

  const isCollapsed = collapsed && !isMobile && !isOpen;
  const sidebarClasses = `sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`;
  const headerText = isCollapsed || (isMobile && !isOpen) ? 'SRP' : 'Sistema Rafael Pombo';

  return (
    <div className={sidebarClasses} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="sidebar-header">
        <p className="sidebar-subtitle"><strong>{headerText}</strong></p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            aria-label={item.label}
          >
            <span className="menu-icon" aria-hidden>{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;