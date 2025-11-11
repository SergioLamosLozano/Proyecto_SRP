import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/PadresPage.css";
import "../styles/Table.css";
import Logout from "../components/Logout";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Table from "../components/Table";
import { padresAPI } from "../api/usuarios";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function PadresPage() {
  const [vista, setVista] = useState("inicio");
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    const cargarEstudiantesVinculados = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No se encontró token de sesión.");
          return;
        }

        // Decodificar el token → obtener username (número de documento del acudiente)
        const decoded = jwtDecode(token);
        const acudienteId = decoded?.username;

        if (!acudienteId) {
          setError("No se encontró identificador de acudiente en el token.");
          return;
        }

        // Llamar a la API: busca coincidencia entre user_name y número_documento_acudiente
        const response = await padresAPI(acudienteId);

        console.log("Respuesta del backend:", response.data);

        // Guardar los estudiantes vinculados
        const lista = response.data.estudiantes_relacionados || [];
        setEstudiantes(lista);
        setFiltrados(lista); // importante: inicializa los filtrados también
      } catch (e) {
        console.error("Error al cargar estudiantes:", e);
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
                  <p style={{ color: "#b02a37" }}>{error}</p>
                ) : estudiantes.length === 0 ? (
                  <p>No hay estudiantes vinculados a su cuenta.</p>
                ) : (
                  <Table
                    title=""
                    columns={[
                      {
                        key: "numero_documento_estudiante",
                        label: "Documento",
                      },
                      { key: "nombre_completo", label: "Nombre" },
                      { key: "correo", label: "Correo" },
                      { key: "ciudad_nombre", label: "Municipio" },
                    ]}
                    data={filtrados}
                    searchPlaceholder="Buscar por nombre o documento..."
                    onSearch={(term) => {
                      const lower = term.toLowerCase();
                      setFiltrados(
                        estudiantes.filter(
                          (e) =>
                            (e.nombre_completo || "")
                              .toLowerCase()
                              .includes(lower) ||
                            String(
                              e.numero_documento_estudiante || ""
                            ).includes(lower)
                        )
                      );
                    }}
                    actions={[
                      {
                        label: "Ver Calificaciones",
                        className: "table-action-btn btn-primary",
                        title: "Ver calificaciones del estudiante",
                        onClick: (est) => {
                          setEstudianteSeleccionado(est);
                          setVista("calificaciones");
                        },
                      },
                      {
                        label: "Ver Notas",
                        className: "table-action-btn btn-secondary",
                        title: "Ver notas del estudiante",
                        onClick: (est) => {
                          setEstudianteSeleccionado(est);
                          setVista("notas");
                        },
                      },
                    ]}
                  />
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
                <p>
                  Este módulo mostrará gráficos y tablas con las calificaciones
                  del estudiante. (Placeholder)
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => setVista("inicio")}
                >
                  Volver
                </button>
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
                <p>
                  Este módulo permitirá filtrar y ver notas por curso y materia.
                  (Placeholder)
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => setVista("inicio")}
                >
                  Volver
                </button>
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
