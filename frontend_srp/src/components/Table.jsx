import React, { useState, useEffect, useMemo } from "react";
import "../styles/Table.css";
import {
  BusquedaPorNombre,
  BusquedaPorNombreP,
  BusquedaPorNombreA,
} from "../api/usuarios";
import {
  BuscarCurso,
  BuscarEstudiantes_cursos,
  BuscarMateriaAsignada,
  BuscarMaterias,
} from "../api/cursos";

const Table = ({
  id,
  title,
  description,
  columns,
  data,
  searchPlaceholder = "Buscar...",
  type_search = "text",
  salir,
  onClickParaSalir,
  filterOptions = [],
  parametrobuscar = "",
  onSearch,
  onFilter,
  onAdd,
  addButtonText = "Añadir",
  actions = [], // Array de objetos con estructura: { key: 'accion', label: 'Texto del Botón', onClick: function }
  users = [],
  busqueda = [],
  check = [],
  pageSize = 20, // Paginación: registros por página (configurable)
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");

  // === PAGINACIÓN (client-side) ===
  const [currentPage, setCurrentPage] = useState(1);
  const safeData = Array.isArray(data) ? data : [];

  // === BÚSQUEDA EN LA TABLA PRINCIPAL ===
  // Filtra `data` por el `searchTerm` contra los campos indicados en
  // `busqueda` o, si no se pasaron, contra todas las columnas con `key`.
  // Soporta llaves anidadas tipo "estudiante.nombre" y arrays (ej. cursos).
  const obtenerValor = (obj, ruta) => {
    if (!obj || !ruta) return "";
    const partes = String(ruta).split(".");
    let val = obj;
    for (const p of partes) {
      if (val == null) return "";
      val = val[p];
    }
    if (Array.isArray(val)) {
      // Concatenar el contenido del array para que sea buscable como texto
      return val.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(" ");
    }
    return val == null ? "" : String(val);
  };

  const camposBusqueda = useMemo(() => {
    if (Array.isArray(busqueda) && busqueda.length > 0) return busqueda;
    return (columns || []).map((c) => c.key).filter(Boolean);
  }, [busqueda, columns]);

  const dataFiltrada = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return safeData;
    return safeData.filter((row) =>
      camposBusqueda.some((campo) =>
        obtenerValor(row, campo).toLowerCase().includes(q)
      )
    );
  }, [safeData, searchTerm, camposBusqueda]);

  const totalRegistros = dataFiltrada.length;
  const totalPages = Math.max(1, Math.ceil(totalRegistros / pageSize));

  // Reiniciar a página 1 cuando cambian los datos, el filtro o el tamaño
  useEffect(() => {
    setCurrentPage(1);
  }, [totalRegistros, pageSize, searchTerm]);

  // Asegurar que la página actual sea válida si los datos se reducen
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const dataPaginada = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return dataFiltrada.slice(start, start + pageSize);
  }, [dataFiltrada, currentPage, pageSize]);

  const desde = totalRegistros === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const hasta = Math.min(currentPage * pageSize, totalRegistros);

  const irAPagina = (n) => {
    if (n < 1 || n > totalPages) return;
    setCurrentPage(n);
  };

  // Construir un set compacto de números de página a mostrar
  const numerosVisibles = useMemo(() => {
    const set = new Set([1, totalPages, currentPage,
                          currentPage - 1, currentPage + 1]);
    return [...set]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    if (onFilter) onFilter(value);
  };

  const handleAdd = () => {
    if (onAdd) onAdd();
  };

  const renderActionButtons = (item, index) => {
    return actions.map((action, actionIndex) => (
      <button
        key={actionIndex}
        className={`table-action-btn ${action.className || ""}`}
        onClick={() => action.onClick(item, index)}
        title={action.title}
      >
        {action.label}
      </button>
    ));
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    const value = item[column.key];

    if (column.type === "status") {
      return (
        <span className={`table-status ${value?.toLowerCase() || "inactive"}`}>
          {value}
        </span>
      );
    }

    return value;
  };

  return (
    <div className="table-container">
      {title && (
        <div className="gestion_usuarios_titulo">
          <label>{title}</label>
          <h3>{description}</h3>
          {salir && (
            <span className="span-salir-tabla" onClick={onClickParaSalir}>
              x
            </span>
          )}
        </div>
      )}

      {title && <h2 className="table-title">{title}</h2>}
      <div className="table-controls">
        <div className="contenedor_busqueda">
          <div className="table-search-filter">
            <input
              type={type_search}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="table-search-input"
            />

            {filterOptions.length > 0 && title == "Gestion de Estudiantes" && (
              <select
                value={filterValue}
                onChange={handleFilter}
                className="table-filter-select"
              >
                <option value="" hidden>
                  Todos
                </option>
                {filterOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        {check.map((item, index) => (
          <label key={index} className="switch-container">
            <span className="switch-title">{item.title}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={item.check}
                onChange={item.onChange}
              />
              <span className="slider"></span>
            </label>
          </label>
        ))}
        {onAdd && (
          <button className="table-add-btn" onClick={handleAdd}>
            + {addButtonText}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className || ""}>
                  {column.label}
                </th>
              ))}
              {/* Título de la columna de acciones - Puedes cambiar "ACCIONES" por el texto que prefieras */}
              {actions.length > 0 && (
                <th className="actions-header">ACCIONES</th>
              )}
            </tr>
          </thead>
          <tbody>
            {dataPaginada.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                    color: "#888",
                  }}
                >
                  No hay registros para mostrar.
                </td>
              </tr>
            ) : (
              dataPaginada.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={column.className || ""}>
                      {column.key == "estado" ? (
                        <span>{item.estado}</span>
                      ) : (
                        renderCellContent(item, column)
                      )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="table-actions">
                      {renderActionButtons(item, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalRegistros > 0 && (
        <div className="table-pagination">
          <span className="table-pagination-info">
            Mostrando <strong>{desde}</strong>–<strong>{hasta}</strong> de{" "}
            <strong>{totalRegistros}</strong>
          </span>
          <div className="table-pagination-controls">
            <button
              type="button"
              className="table-page-btn"
              onClick={() => irAPagina(1)}
              disabled={currentPage === 1}
              title="Primera página"
            >
              «
            </button>
            <button
              type="button"
              className="table-page-btn"
              onClick={() => irAPagina(currentPage - 1)}
              disabled={currentPage === 1}
              title="Anterior"
            >
              ‹
            </button>

            {numerosVisibles.map((n, i) => {
              const prev = numerosVisibles[i - 1];
              const conGap = prev !== undefined && n - prev > 1;
              return (
                <React.Fragment key={n}>
                  {conGap && <span className="table-page-gap">…</span>}
                  <button
                    type="button"
                    className={`table-page-btn ${
                      n === currentPage ? "active" : ""
                    }`}
                    onClick={() => irAPagina(n)}
                  >
                    {n}
                  </button>
                </React.Fragment>
              );
            })}

            <button
              type="button"
              className="table-page-btn"
              onClick={() => irAPagina(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Siguiente"
            >
              ›
            </button>
            <button
              type="button"
              className="table-page-btn"
              onClick={() => irAPagina(totalPages)}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
