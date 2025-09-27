import React from 'react';
import '../styles/Table.css';

const Table = ({ 
  title, 
  columns, // Array de objetos con estructura: { key: 'campo', label: 'TÍTULO DE LA COLUMNA' }
  data, 
  searchPlaceholder = "Buscar...", 
  filterOptions = [], 
  onSearch, 
  onFilter, 
  onAdd, 
  addButtonText = "Añadir",
  actions = [] // Array de objetos con estructura: { key: 'accion', label: 'Texto del Botón', onClick: function }
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');

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
        className={`table-action-btn ${action.className || ''}`}
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
    
    if (column.type === 'status') {
      return (
        <span className={`table-status ${value?.toLowerCase() || 'inactive'}`}>
          {value}
        </span>
      );
    }
    
    return value;
  };

  return (
    <div className="table-container">
      {title && <h2 className="table-title">{title}</h2>}
      
      <div className="table-controls">
        <div className="table-search-filter">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="table-search-input"
          />
          
          {filterOptions.length > 0 && (
            <select
              value={filterValue}
              onChange={handleFilter}
              className="table-filter-select"
            >
              <option value="">Todos</option>
              {filterOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        
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
                <th key={index} className={column.className || ''}>
                  {column.label}
                </th>
              ))}
              {/* Título de la columna de acciones - Puedes cambiar "ACCIONES" por el texto que prefieras */}
              {actions.length > 0 && <th className="actions-header">ACCIONES</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ''}>
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