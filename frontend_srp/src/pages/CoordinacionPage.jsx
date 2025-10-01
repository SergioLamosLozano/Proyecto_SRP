import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import GestionAcademica from '../components/GestionAcademica';
import GestionUsuarios from '../components/GestionUsuarios';
import Calificaciones from '../components/Calificaciones';
import ReportesEstadisticas from '../components/ReportesEstadisticas';
import Logout from '../components/Logout';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';
import '../styles/CoordinacionPage.css';

const CoordinacionPage = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Cerrar sidebar en móvil después de navegar
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    // Cerrar sidebar en móvil después de navegar
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Funciones para controlar el menú hamburguesa
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'gestion-academica':
        return <GestionAcademica onBack={handleBackToDashboard} />;
      case 'gestion-usuarios':
        return <GestionUsuarios onBack={handleBackToDashboard} />;
      case 'calificaciones':
        return <Calificaciones onBack={handleBackToDashboard} />;
      case 'reportes':
        return <ReportesEstadisticas onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <>
      <Logout />
      {/* Botón hamburguesa para móvil */}
      {isMobile && (
        <button 
          className="hamburger-button" 
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      )}
      
      {/* Overlay para cerrar sidebar en móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={closeSidebar}
        />
      )}
      
      <div className="coordinacion-container">
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigation}
          isMobile={isMobile}
          isOpen={sidebarOpen}
        />
        <div className="coordinacion-content">
          <div className="coordinacion-main-content">
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
    
  );
};

export default CoordinacionPage;