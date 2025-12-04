import "../styles/Modal.css";
import Select from "react-select";

function Modal({
  titulo,
  inputs = [],
  acciones = [],
  select = [],
  selectConBusqueda = [],
  SalirM,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{titulo}</h3>
          <button className="modal-close" onClick={SalirM}>
            ×
          </button>
        </div>
        <form className="modal-form">
          {inputs.map((item, index) => (
            <div key={index} className="form-row">
              <label>{item.nombre}</label>

              <input
                type={item.type || "text"}
                step={item.step}
                disabled={item.disabled}
                placeholder={item.placeholder || item.nombre}
                value={item.value}
                onChange={item.onChange}
              />
            </div>
          ))}
          {select.map((item, index) => (
            <div key={index} className="form-row">
              <label>{item.nombre}</label>
              <select value={item.value} onChange={item.onChange}>
                <option value="" hidden>
                  Seleccione una opción
                </option>
                {item.opciones.map((item2, index2) => (
                  <option key={index2} value={item2.value}>
                    {item2.title || item.value}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {selectConBusqueda.map((item, index) => (
            <div key={index} className="form-row">
              <label>{item.nombre}</label>
              <Select
                value={
                  item.options.find((opt) => opt.value === item.value) || null
                }
                placeholder={item.placeholder}
                options={item.options}
                onChange={item.onChange}
                isClearable
              />
            </div>
          ))}
          <div className="modal-actions">
            {acciones.map((item, index) => (
              <button
                key={index}
                className={item.className || "btn-primary"}
                onClick={item.click}
                type={item.type || "button"}
              >
                {item.nombre}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
