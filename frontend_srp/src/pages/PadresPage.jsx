import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/PadresPage.css";
import Logout from "../components/Logout";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { padresAPI } from "../api/padres";
import { jwtDecode } from "jwt-decode";

function PadresPage() {
  const [vista, setVista] = useState("inicio");
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    const cargarEstudiantesVinculados = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("token");
        let acudienteId = null;
        if (token) {
          const decoded = jwtDecode(token);
          acudienteId = decoded?.username || null; // documento del acudiente en JWT
        }
        if (!acudienteId) {
          setError("No se encontró identificador de acudiente en el token.");
          setLoading(false);
          return;
        }
        const relacionesResp = await padresAPI.getRelacionesPorAcudiente(acudienteId);
        const relaciones = relacionesResp.data || [];
        const detallesPromises = relaciones.map((rel) =>
          padresAPI.getEstudianteDetalle(rel.fk_numero_documento_estudiante)
            .then(r => r.data)
            .catch(() => null)
        );
        const detalles = await Promise.all(detallesPromises);
        // Ajustar campos consumidos por la tabla
        const formateados = (detalles.filter(Boolean) || []).map(e => ({
          numero_documento_estudiante: e.numero_documento_estudiante,
          nombre_completo: e.nombre_completo || `${e.nombre1 || ''} ${e.nombre2 || ''} ${e.apellido1 || ''} ${e.apellido2 || ''}`.trim(),
          correo: e.correo || '-',
          ciudad_nombre: e.ciudad_nombre || '-',
        }));
        setEstudiantes(formateados);
      } catch (e) {
        setError("Error cargando estudiantes vinculados.");
      } finally {
        setLoading(false);
      }
    };

    cargarEstudiantesVinculados();
  }, []);

  return (
    <div className="dashboard padres-page">
      <Logout />
      <Breadcrumbs />

      <div className="dashboard-content-1 padres-content">
        <main className="content padres-scroll">
          {vista === "inicio" && (
            <div className="padres-container">
              <div className="padres-hero">
                <h1>Padres de Familia</h1>
                <p>Consulta de calificaciones y notas del estudiante</p>
              </div>

              {/* Solo dejamos la lista de estudiantes vinculados */}

              <div className="card wide" style={{ marginTop: 20 }}>
                <h3>Estudiantes vinculados</h3>
                {loading ? (
                  <p>Cargando...</p>
                ) : error ? (
                  <p style={{ color: '#b02a37' }}>{error}</p>
                ) : estudiantes.length === 0 ? (
                  <p>No hay estudiantes vinculados a su cuenta.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Documento</th>
                          <th>Nombre</th>
                          <th>Correo</th>
                          <th>Municipio</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((est) => (
                          <tr key={est.numero_documento_estudiante}>
                            <td>{est.numero_documento_estudiante}</td>
                            <td>{est.nombre_completo}</td>
                            <td>{est.correo}</td>
                            <td>{est.ciudad_nombre}</td>
                            <td>
                              <button
                                className="btn-primary"
                                onClick={() => { setEstudianteSeleccionado(est); setVista('calificaciones'); }}
                              >Ver Calificaciones</button>
                              <button
                                className="btn-secondary"
                                style={{ marginLeft: 8 }}
                                onClick={() => { setEstudianteSeleccionado(est); setVista('notas'); }}
                              >Ver Notas</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {vista === "calificaciones" && (
            <div className="padres-container">
              <div className="card wide">
                <h3>Calificaciones</h3>
                <p>
                  Estudiante: {estudianteSeleccionado?.nombre_completo} (
                  {estudianteSeleccionado?.numero_documento_estudiante})
                </p>
                <p>Este módulo mostrará gráficos y tablas con las calificaciones del estudiante. (Placeholder)</p>
                <button className="btn-secondary" onClick={() => setVista("inicio")}>Volver</button>
              </div>
            </div>
          )}

          {vista === "notas" && (
            <div className="padres-container">
              <div className="card wide">
                <h3>Consulta de notas</h3>
                <p>
                  Estudiante: {estudianteSeleccionado?.nombre_completo} (
                  {estudianteSeleccionado?.numero_documento_estudiante})
                </p>
                <p>Este módulo permitirá filtrar y ver notas por curso y materia. (Placeholder)</p>
                <button className="btn-secondary" onClick={() => setVista("inicio")}>Volver</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default PadresPage;