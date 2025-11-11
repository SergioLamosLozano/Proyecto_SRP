import "../styles/Dashboard.css";
import Logout from "../components/Logout";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { useState } from "react";
import Estadisticas from "../components/Estadisticas";

function SecretariaPage() {
  const [ESTADISTICAS, setESTADISTICAS] = useState(false);

  return (
    <div className="dashboard">
      <Logout />
      <Breadcrumbs />

      {!ESTADISTICAS && (
        <div className="dashboard-content-1">
          <main className="content">
            <div className="dashboard-header">
              <h1>Coordinación Administrativa</h1>
              <p>Panel de control - Gestión administrativa y recursos</p>
            </div>

            <div className="dashboard-cards">
              <div className="card">
                <h3>⚙️ Gestión de Estudiantes</h3>
                <p>Crear Estudiantes</p>
                <button className="btn-primary">Ver Tabla</button>
              </div>

              <div className="card">
                <h3>⚙️ Gestión de Docentes</h3>
                <p>Crear Docentes</p>
                <button className="btn-primary">Ver Tabla</button>
              </div>

              <div className="card">
                <h3>📊 Dashboards</h3>
                <p>Visualiza algunos diagramas de porcentajes</p>
                <button
                  onClick={() => setESTADISTICAS(true)}
                  className="btn-primary"
                >
                  Ver Estadísticas
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {ESTADISTICAS && <Estadisticas />}

      <Footer />
    </div>
  );
}

export default SecretariaPage;
