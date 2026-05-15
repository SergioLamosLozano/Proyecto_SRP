import { HotTable } from "@handsontable/react";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

import "../styles/Definitivas.css";

export default function DefinitivasModal() {
  const datosEjemplo = [
    ["Juan Quintero", "Biología", 4.5],
    ["Ana Gómez", "Matemáticas", 3.8],
    ["Carlos Ruiz", "Lengua", 4.2],
    ["María López", "Historia", 2.9],
  ];

  return (
    <div className="contenedor-definitivas">
      <div className="header-definitivas">
        <p className="titulo-definitivas">Definitivas</p>

        <p className="descripcion-definitivas">
          Aquí se podrán ver las definitivas de los estudiantes.
        </p>
      </div>

      <div className="tabla-definitivas">
        <HotTable
          data={datosEjemplo}
          colHeaders={["Estudiante", "Materia", "Definitiva"]}
          rowHeaders={true}
          width="100%"
          height="450"
          stretchH="all"
          autoWrapRow={true}
          autoWrapCol={true}
          licenseKey="non-commercial-and-evaluation"
          className="custom-handsontable"
        />
      </div>
    </div>
  );
}
