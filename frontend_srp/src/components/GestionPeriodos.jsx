import React, { useEffect, useState } from "react";
import "../styles/Coordinacion.css";
import Swal from "sweetalert2";
import {
  Periodos,
  CrearPeriodo,
  EditarPeriodo,
  EliminarPeriodo,
  Año_electivo,
} from "../api/cursos";
import { Alert } from "../utils/alert";
import Table from "./Table";

/**
 * CRUD de periodos académicos.
 * Cada periodo tiene: nombre, fecha inicio, fecha fin y año electivo.
 */
const GestionPeriodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [aniosElectivos, setAniosElectivos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [periodoActual, setPeriodoActual] = useState({
    id_periodo: null,
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    fk_id_año_electivo: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resPer, resAnos] = await Promise.all([
        Periodos(),
        Año_electivo(),
      ]);
      const lista = resPer?.data?.results || resPer?.data || [];
      setPeriodos(Array.isArray(lista) ? lista : []);
      const anos = resAnos?.data?.results || resAnos?.data || [];
      setAniosElectivos(Array.isArray(anos) ? anos : []);
    } catch (e) {
      Alert("error", "No se pudieron cargar los periodos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPeriodoActual({
      id_periodo: null,
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      fk_id_año_electivo: aniosElectivos[0]?.id_año_electivo || "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (p) => {
    setModoEdicion(true);
    setPeriodoActual({
      id_periodo: p.id_periodo,
      nombre: p.nombre || "",
      fecha_inicio: p.fecha_inicio || "",
      fecha_fin: p.fecha_fin || "",
      fk_id_año_electivo: p.fk_id_año_electivo || "",
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const validarFormulario = () => {
    if (!periodoActual.nombre || !periodoActual.nombre.trim()) {
      Alert("warning", "El nombre del periodo es obligatorio");
      return false;
    }
    if (!periodoActual.fecha_inicio || !periodoActual.fecha_fin) {
      Alert("warning", "Las fechas de inicio y fin son obligatorias");
      return false;
    }
    if (new Date(periodoActual.fecha_inicio) >= new Date(periodoActual.fecha_fin)) {
      Alert("warning", "La fecha de inicio debe ser anterior a la fecha de fin");
      return false;
    }
    if (!periodoActual.fk_id_año_electivo) {
      Alert("warning", "Debe seleccionar un año electivo");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;
    const payload = {
      nombre: periodoActual.nombre.trim(),
      fecha_inicio: periodoActual.fecha_inicio,
      fecha_fin: periodoActual.fecha_fin,
      fk_id_año_electivo: periodoActual.fk_id_año_electivo,
    };

    try {
      if (modoEdicion) {
        await EditarPeriodo(periodoActual.id_periodo, payload);
        Alert("success", "Periodo actualizado correctamente");
      } else {
        await CrearPeriodo(payload);
        Alert("success", "Periodo creado correctamente");
      }
      cerrarModal();
      cargarDatos();
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        JSON.stringify(e?.response?.data || {}) ||
        "Error al guardar";
      Alert("error", msg);
    }
  };

  const eliminar = (p) => {
    Swal.fire({
      title: `¿Eliminar "${p.nombre || `Periodo ${p.id_periodo}`}"?`,
      html:
        '<p>Si hay calificaciones, RAs o definitivas asociadas a este periodo, ' +
        'la eliminación puede fallar o generar inconsistencias. Solo elimine ' +
        'periodos sin uso.</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await EliminarPeriodo(p.id_periodo);
        Alert("success", "Periodo eliminado");
        cargarDatos();
      } catch (e) {
        Alert(
          "error",
          "No se pudo eliminar (probablemente tiene datos asociados)"
        );
      }
    });
  };

  const dataTabla = periodos.map((p) => ({
    ...p,
    nombre_display: p.nombre || `Periodo ${p.id_periodo}`,
    año_electivo_display: p.fk_id_año_electivo
      ? `Año ${p.fk_id_año_electivo}`
      : "—",
  }));

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Gestión de Periodos</h1>
        <p className="dashboard-subtitle">
          Crea, edita y elimina periodos académicos. Cada periodo se asocia a
          un año electivo y se usará en RAs, actividades, definitivas y
          boletines.
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className="card-button"
          style={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={abrirModalCrear}
        >
          ➕ Nuevo Periodo
        </button>
      </div>

      {loading ? (
        <p>Cargando periodos...</p>
      ) : (
        <Table
          id="GestionPeriodos"
          title=""
          columns={[
            { key: "id_periodo", label: "ID" },
            { key: "nombre_display", label: "Nombre" },
            { key: "fecha_inicio", label: "Fecha Inicio" },
            { key: "fecha_fin", label: "Fecha Fin" },
            { key: "año_electivo_display", label: "Año Electivo" },
          ]}
          data={dataTabla}
          searchPlaceholder="Buscar periodo..."
          actions={[
            {
              label: "Editar ✏️",
              className: "table-action-btn btn-primary",
              title: "Editar periodo",
              onClick: (p) => abrirModalEditar(p),
            },
            {
              label: "Eliminar 🗑️",
              className: "table-action-btn btn-danger",
              title: "Eliminar periodo",
              onClick: (p) => eliminar(p),
            },
          ]}
        />
      )}

      {modalAbierto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={cerrarModal}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              width: "min(500px, 90vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, color: "#d32f2f" }}>
                {modoEdicion ? "Editar Periodo" : "Nuevo Periodo"}
              </h2>
              <button
                onClick={cerrarModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Nombre del Periodo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Primer Trimestre 2026"
                  value={periodoActual.nombre}
                  onChange={(e) =>
                    setPeriodoActual({ ...periodoActual, nombre: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.4rem",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={periodoActual.fecha_inicio}
                    onChange={(e) =>
                      setPeriodoActual({
                        ...periodoActual,
                        fecha_inicio: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.4rem",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Fecha Fin *
                  </label>
                  <input
                    type="date"
                    value={periodoActual.fecha_fin}
                    onChange={(e) =>
                      setPeriodoActual({
                        ...periodoActual,
                        fecha_fin: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Año Electivo *
                </label>
                <select
                  value={periodoActual.fk_id_año_electivo}
                  onChange={(e) =>
                    setPeriodoActual({
                      ...periodoActual,
                      fk_id_año_electivo: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">-- Seleccione un año electivo --</option>
                  {aniosElectivos.map((a) => (
                    <option key={a.id_año_electivo} value={a.id_año_electivo}>
                      Año {a.id_año_electivo}
                      {a.fecha_inicio
                        ? ` (${a.fecha_inicio} → ${a.fecha_fin})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  onClick={cerrarModal}
                  style={{
                    padding: "0.6rem 1.5rem",
                    background: "#e0e0e0",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={guardar}
                  style={{
                    padding: "0.6rem 1.5rem",
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {modoEdicion ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPeriodos;
