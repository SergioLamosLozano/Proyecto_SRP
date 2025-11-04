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
              <h1>Secretaría Académica</h1>
              <p>Panel de control - Gestión de usuarios y procesos</p>
            </div>

            <div className="dashboard-cards">
              <div className="card">
                <h3>👥 Gestión de usuario</h3>
                <p>Crear, editar y administrar cuentas de usuarios.</p>
                <button className="btn-primary">Abrir módulo</button>
              </div>

              <div className="card">
                <h3>📤 Carga masiva de estudiantes</h3>
                <p>Sube plantillas para registrar estudiantes en bloque.</p>
                <button className="btn-primary">Abrir módulo</button>
              </div>

              <div className="card">
                <h3>📝 Calificaciones</h3>
                <p>Consulta y gestión de calificaciones institucionales.</p>
                <button className="btn-primary">Abrir módulo</button>
              </div>

              <div className="card">
                <h3>📊 Reporte</h3>
                <p>Genera reportes y visualiza estadísticas.</p>
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
