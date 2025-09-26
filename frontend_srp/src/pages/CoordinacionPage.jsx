import React, { useState } from 'react';
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

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
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
      <div className="coordinacion-container">
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigation} 
        />
        <div className="coordinacion-content">
          <div className="coordinacion-main-content">
            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CoordinacionPage;