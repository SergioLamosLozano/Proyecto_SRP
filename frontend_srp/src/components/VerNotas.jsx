import React from "react";
import "../styles/VerNotas.css";

const VerNotas = ({ estudiante, notas = [], onClickSalir }) => {
  // Datos de ejemplo (para ver la tabla)

  return (
    <div className="contenedor1V">
      <div className="contenedor2V">
        <h2 className="H2V">Notas de {estudiante}</h2>
        <span className="SpanV" onClick={onClickSalir}>
          x
        </span>

        <div className="contenedor3V">
          {notas.length > 0 ? (
            <table className="contenedorTable1">
              <thead>
                <tr className="TrV">
                  <th className="ThV">Número Documento</th>
                  <th className="ThV">Nombre Completo</th>
                  <th className="ThV">Actividad</th>
                  <th className="ThV">Porcentaje</th>
                  <th className="ThV">Calificación</th>
                  <th className="ThV">Materia</th>
                  <th className="ThV">Curso</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((item, index) => (
                  <tr key={index}>
                    <td className="TdV">{item.documento}</td>
                    <td className="TdV">{item.nombre}</td>
                    <td className="TdV">{item.actividad}</td>
                    <td className="TdV">{item.porcentaje}</td>
                    <td className="TdV">{item.calificacion}</td>
                    <td className="TdV">{item.materia}</td>
                    <td className="TdV">{item.curso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay Notas Aun</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerNotas;
