import "../styles/Modal.css";

function Modal({ titulo, inputs = [], acciones = [] }) {
  return (
    <div className="fondo_modal">
      <div className="modal-content">
        <div className="contenedor_del_modal_p">
          <h2>{titulo}</h2>
          <div className="Organzador-modal">
            {inputs.map((item, index) => (
              <div key={index} className="modal_input_group">
                <label>{item.nombre}</label>
                <input
                  type={item.type || "text"}
                  placeholder={item.placeholder || item.nombre}
                  value={item.value}
                  onChange={item.onChange}
                />
              </div>
            ))}
            <div className="acciones_modal">
              {acciones.map((item, index) => (
                <button
                  className="btn-primary"
                  key={index}
                  onClick={item.click}
                >
                  {item.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
