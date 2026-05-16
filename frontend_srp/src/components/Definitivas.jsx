import { useState } from "react";
import "../styles/Definitivas.css";

export default function DefinitivasModal() {
  const [tabId, setTabId] = useState(1);
  const [idEstudiante, setIdEstudiante] = useState("");

  const datosEjemplo = [
    { documento: "10001", nombre: "Juan Quintero", materia: "Biología", definitiva: 4.5, promedio: 4.5 },
    { documento: "10002", nombre: "Ana Gómez", materia: "Matemáticas", definitiva: 3.8, promedio: 3.8 },
    { documento: "10003", nombre: "Carlos Ruiz", materia: "Lenguaje", definitiva: 4.2, promedio: 4.2 },
    { documento: "10004", nombre: "María López", materia: "Historia", definitiva: 2.9, promedio: 2.9 },
  ];

  return (
    <div className="definitivas-contenedor-padre">
      <div className="definitivas-tabs-contenedor">
        <span
          className={`definitivas-tab ${tabId === 1 ? "active" : ""}`}
          onClick={() => setTabId(1)}
        >
          Crear
        </span>
        <span
          className={`definitivas-tab ${tabId === 2 ? "active" : ""}`}
          onClick={() => setTabId(2)}
        >
          Consultar
        </span>
      </div>

      <div className="definitivas-contenedor">
        {tabId === 1 ? (
          <>
            <div className="definitivas-titulo">
              <h1>Definitivas</h1>
              <p>¡En este apartado se podran ver las definitivas!</p>
            </div>

            <div className="definitivas-explicacion-contenedor">
              <p className="definitivas-explicacion">
                En toda esta parte va una pequeña explicacion de para que es esta pagina y como funciona
              </p>
              <div className="definitivas-boton-contenedor">
                <button className="definitivas-boton-seleccionar">Seleccionar materia</button>
              </div>
            </div>

            <div className="tabla-definitivas">
              <table className="definitivas-html-table">
                <thead>
                  <tr>
                    <th>Documento estudiante</th>
                    <th>Nombre Completo</th>
                    <th>Materia</th>
                    <th>Definitiva</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {datosEjemplo.map((item, index) => (
                    <tr key={index}>
                      <td>{item.documento}</td>
                      <td>{item.nombre}</td>
                      <td>{item.materia}</td>
                      <td>{item.definitiva}</td>
                      <td>{item.promedio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="definitivas-titulo">
              <h1>Consultar Definitivas</h1>
              <p>¡Busca la definitiva de un estudiante específico!</p>
            </div>

            <div className="definitivas-explicacion-contenedor">
              <p className="definitivas-explicacion">
                Ingrese el ID del estudiante para buscar su nota definitiva, y luego seleccione la materia.
              </p>
              
              <div className="definitivas-consultar-acciones">
                <div className="definitivas-busqueda-contenedor">
                  <input 
                    type="text" 
                    placeholder="ID del estudiante..." 
                    value={idEstudiante}
                    onChange={(e) => setIdEstudiante(e.target.value)}
                    className="definitivas-input-buscar"
                  />
                  <div className="definitivas-lupa-buscar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 485.213 485.213"
                    >
                      <path d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324 c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z" />
                      <path d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951 C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46 c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465 C318.424,257.208,257.206,318.416,181.956,318.416z" />
                      <path d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" />
                    </svg>
                  </div>
                </div>
                
                <button className="definitivas-boton-seleccionar">Seleccionar materia</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
