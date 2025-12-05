import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardDocentes from "../components/DashboardDocente";
import Footer from "../components/Footer";
import Logout from "../components/Logout";
import "../styles/Dashboard.css";
import "../styles/CoordinacionPage.css";
import DocentesMaterias from "../components/DocenteMaterias";
import Actividades from "../components/Actividades";

function DocentesPage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Navegación entre vistas
  const handleNavigation = (view) => {
    setCurrentView(view);
    if (isMobile) setSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    if (isMobile) setSidebarOpen(false);
  };

  // Detección de móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Control del menú hamburguesa
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Contenido dinámico
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardDocentes onNavigate={handleNavigation} />;

      case "materias-asignadas":
        return <DocentesMaterias onBack={handleBackToDashboard} />;
      case "gestion-actividades":
        return <Actividades onBack={handleBackToDashboard} />;

      default:
        return <DashboardDocentes onNavigate={handleNavigation} />;
    }
  };

  return (
    <div
      className="page-wrapper"
      style={{ "--sidebar-width": sidebarCollapsed ? "72px" : "250px" }}
    >
      <Logout />

      {/* Botón hamburguesa en móvil */}
      {isMobile && (
        <button className="hamburger-button" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* Overlay móvil */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar} />
      )}

      <div className="coordinacion-container">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigation}
          isMobile={isMobile}
          menu="Docente"
          isOpen={sidebarOpen}
          collapsed={sidebarCollapsed}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
        />

        <div
          className={`coordinacion-content ${
            sidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <div className="coordinacion-main-content">{renderContent()}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DocentesPage;
