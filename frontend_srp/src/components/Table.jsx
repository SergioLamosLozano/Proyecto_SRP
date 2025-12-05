import React, { useState } from "react";
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
  onSearch,
  onFilter,
  onAdd,
  addButtonText = "Añadir",
  actions = [], // Array de objetos con estructura: { key: 'accion', label: 'Texto del Botón', onClick: function }
  filtroParaEstudiantePadres = [],
  busqueda = [],
  check = [],
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [usuarios, setUsuarios] = useState([]);

  const buscar = async (letras) => {
    if (id == "Estudiantes") {
      try {
        const response = await BusquedaPorNombre(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al buscar estudiante:", error);
      }
    } else if (id == "Profesores") {
      try {
        const response = await BusquedaPorNombreP(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al buscar Profesores:", error);
      }
    } else if (id == "Padres") {
      try {
        const response = await BusquedaPorNombreA(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al buscar Padres:", error);
      }
    } else if (id === "EstudiantesAcudientes") {
      const resultado = filtroParaEstudiantePadres.filter((item) =>
        item.numero_documento.toString().includes(letras)
      );
      setUsuarios(resultado);
    } else if (id === "Cursos") {
      try {
        const response = await BuscarCurso(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.log(error);
      }
    } else if (id === "Materias") {
      try {
        const response = await BuscarMaterias(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.log(error);
      }
    } else if (id === "MateriaA") {
      try {
        const response = await BuscarMateriaAsignada(letras);
        setUsuarios(response.data);
      } catch (error) {
        console.log(error);
      }
    } else if (id === "EstudianteC") {
      try {
        const term = letras.trim();
        if (term === "") {
          setUsuarios([]);
          return;
        }
        const response = data.filter((est) =>
          est.numero_documento_estudiante.toString().includes(term)
        );
        setUsuarios(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
    buscar(value);
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
          <div className="contenedor_busqueda2">
            {searchTerm.length > 0 && (
              <div className="busqueda_por_nombre">
                {usuarios.length > 0 ? (
                  usuarios.map((item, index) => (
                    <div className="targeta_busqueda" key={index}>
                      {busqueda.map((parametro, index) => (
                        <label key={index}>{`${item[parametro]} - `}</label>
                      ))}
                      {actions.length > 0 && (
                        <div style={{ display: "flex", gap: "10px" }}>
                          {renderActionButtons(item, index)}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <h1 className="Alerta_busqueda">
                    No se encontro ningun usuario por '{searchTerm}'
                  </h1>
                )}
              </div>
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
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ""}>
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="table-actions">
                    {renderActionButtons(item, index)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
