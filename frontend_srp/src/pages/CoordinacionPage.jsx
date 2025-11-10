import React from "react";
import Logout from "../components/Logout";
import Breadcrumbs from "../components/Breadcrumbs";
//import Footer from '../components/Footer';
import "../styles/Dashboard.css";
import Footer from "../components/Footer";

const Coordinacion = () => {
  return (
    <div className="dashboard">
      <Logout />
      <Breadcrumbs />
      <div className="dashboard-content-1">
        <main className="content">
          <div className="dashboard-header">
            <h1>Coordinación Administrativa</h1>
            <p>Panel de control - Gestión administrativa y recursos</p>
          </div>

          <div className="dashboard-cards">
            <div className="card">
              <h3>⚙️ Gestion De Estudiantes</h3>
              <p>Crear Estudiantes</p>
              <button className="btn-primary">Ver Tabla</button>
            </div>

            <div className="card">
              <h3>⚙️ Gestion De Docentes</h3>
              <p>Crear Docentes</p>
              <button className="btn-primary">Ver Tabla</button>
            </div>

            <div className="card">
              <h3>⚙️ Gestion De Padres</h3>
              <p>Crear padres de familia</p>
              <button className="btn-primary">Ver Tabla</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      {/* <Footer /> */}
    </div>
  );
};

export default Coordinacion;
