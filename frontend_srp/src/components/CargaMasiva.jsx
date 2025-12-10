import React, { useState } from "react";
import Swal from "sweetalert2";
import { estudiantesAPI, profesoresAPI } from "../api/usuarios";
import * as XLSX from "xlsx";
import "../styles/CargaMasiva.css";

const CargaMasiva = ({ CargarEstudiante }) => {
  const [tipo, setTipo] = useState("estudiantes");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState({
    estudiantes: [],
    acudientes: [],
    profesores: [],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
    setPreview({ estudiantes: [], acudientes: [], profesores: [] });
    setResult(null);
    setFile(null);
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setPreview({ estudiantes: [], acudientes: [], profesores: [] });
    if (!f) return;

    try {
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      if (tipo === "estudiantes") {
        const wsEst =
          wb.Sheets[
            wb.SheetNames.find((n) => n.toLowerCase().includes("estudiante")) ||
              wb.SheetNames[0]
          ];
        const rowsEst = XLSX.utils.sheet_to_json(wsEst, { defval: "" });
        const wsAcu =
          wb.Sheets[
            wb.SheetNames.find((n) => n.toLowerCase().includes("acudiente")) ||
              ""
          ];
        const rowsAcu = wsAcu
          ? XLSX.utils.sheet_to_json(wsAcu, { defval: "" })
          : [];
        setPreview({
          estudiantes: rowsEst.slice(0, 25),
          acudientes: rowsAcu.slice(0, 25),
          profesores: [],
        });
      } else {
        const wsProf = wb.Sheets[wb.SheetNames[0]];
        const rowsProf = XLSX.utils.sheet_to_json(wsProf, { defval: "" });
        setPreview({
          estudiantes: [],
          acudientes: [],
          profesores: rowsProf.slice(0, 25),
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", text: "No se pudo leer el Excel" });
    }
  };

  const downloadTemplate = async () => {
    try {
      const isEst = tipo === "estudiantes";
      const publicUrl = isEst
        ? "/utils/plantilla_estudiantes.xlsx"
        : "/utils/plantilla_profesores.xlsx";

      let blob;
      try {
        const r = await fetch(publicUrl);
        if (!r.ok) throw new Error("public-not-found");
        blob = await r.blob();
      } catch (_) {
        const api = isEst ? estudiantesAPI : profesoresAPI;
        const resp = await api.downloadTemplate();
        blob = new Blob([resp.data], {
          type:
            resp.headers["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isEst
        ? "plantilla_estudiantes.xlsx"
        : "plantilla_profesores.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", text: "Error descargando plantilla" });
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Swal.fire({ icon: "info", text: "Selecciona un archivo Excel" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const api = tipo === "estudiantes" ? estudiantesAPI : profesoresAPI;
      const resp = await api.bulkUpload(file);
      setResult(resp.data);
      Swal.fire({ icon: "success", text: "Archivo procesado" });
      CargarEstudiante();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Error procesando archivo";
      Swal.fire({ icon: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title, rows) => {
    if (!rows?.length) return null;
    const allCols = Object.keys(rows[0] || {});
    const nonEmptyHeaderCols = allCols.filter((c) => !/^__EMPTY/.test(c));
    const cols = nonEmptyHeaderCols.filter((c) =>
      rows.some((r) => String(r[c] ?? "").trim() !== "")
    );
    const tableWidth = Math.max(cols.length * 160, 900);
    return (
      <div className="preview-table-wrapper">
        <h4>{title}</h4>
        <table className="preview-table" style={{ minWidth: tableWidth }}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={c} title={String(r[c] ?? "")}>
                    {String(r[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
          Desplázate horizontalmente para ver todas las columnas.
        </p>
      </div>
    );
  };

  return (
    <div className="cm-container">
      <div className="cm-header">
        <h2 className="cm-title">Carga Masiva</h2>
        <p className="cm-subtitle">
          Sube tu plantilla de {tipo} para registrar datos masivos.
        </p>
      </div>

      <div className="cm-controls">
        <input
          className="cm-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
        <button className="cm-btn" onClick={uploadFile} disabled={loading}>
          {loading ? "Procesando..." : "Subir"}
        </button>

        <button className="cm-btn" onClick={downloadTemplate}>
          Descargar plantilla
        </button>
      </div>

      {tipo === "estudiantes" && (
        <>
          {renderTable(
            "Previsualización Estudiantes (primeros 25)",
            preview.estudiantes
          )}

          {renderTable(
            "Previsualización Acudientes (primeros 25)",
            preview.acudientes
          )}
        </>
      )}

      {tipo === "profesores" &&
        renderTable(
          "Previsualización Profesores (primeros 25)",
          preview.profesores
        )}

      {result && (
        <div className="cm-table-wrapper" style={{ marginTop: 16 }}>
          <h4>Resultado</h4>

          {tipo === "estudiantes" ? (
            <>
              <p className="cm-result-text">
                Estudiantes: creados {result.created} | actualizados{" "}
                {result.updated}
              </p>

              {Array.isArray(result.errors) &&
                result.errors.length > 0 &&
                renderTable("Errores estudiantes", result.errors)}

              {result.acudientes && (
                <>
                  <p className="cm-result-text">
                    Acudientes: creados {result.acudientes.created} |
                    actualizados {result.acudientes.updated} | relaciones{" "}
                    {result.acudientes.relaciones_creadas}
                  </p>

                  {Array.isArray(result.acudientes.errors) &&
                    result.acudientes.errors.length > 0 &&
                    renderTable("Errores acudientes", result.acudientes.errors)}
                </>
              )}
            </>
          ) : (
            <>
              <p className="cm-result-text">
                Profesores: creados {result.created} | actualizados{" "}
                {result.updated}
              </p>

              {Array.isArray(result.errors) &&
                result.errors.length > 0 &&
                renderTable("Errores", result.errors)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CargaMasiva;
