import { useState } from "react";
import "../styles/Actividades.css";
import CrudActividades from "./CrudsActividades";

function Actividades({ onBack }) {
  const [id, setid] = useState(0);
  const [crudid, setCrudid] = useState(0);
  const [currentSubSection, setcurrentSubSection] = useState(null);

  const submodulos = [
    {
      id: 1,
      titulo: "Actividades Anteriores",
      des: "En este apartado se podran visualizar las actividades anteriores creadas por el docente",
    },
    {
      id: 2,
      titulo: "Crear Actividad",
      des: "En este apartado el docente podra crear una actividad para un grupo en concreto",
    },
    {
      id: 3,
      titulo: "Calificar",
      des: "En este apartado el docente podra calificar las actividades impuestas por el mismo",
    },
  ];

  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Pagina Docentes", path: "/docentes" },
    { label: "Actividades", path: "/docentes/actividades" },
    ...(currentSubSection
      ? [
          {
            label: currentSubSection,
            path: `/docentes/actividades/${currentSubSection}`,
          },
        ]
      : []),
  ];

  const AbrirCruds = (id) => {
    setCrudid(id);
    setid(1);
  };

  switch (id) {
    case 0:
      return (
        <div className="actividades-container1">
          {submodulos.map((item, index) => (
            <div
              key={index}
              className="actividades-tarjetas-modulos"
              onClick={() => AbrirCruds(item.id)}
            >
              <span>{item.titulo}</span>
              <p>{item.des}</p>
              <button onClick={() => AbrirCruds(item.id)}>Ingresar</button>
            </div>
          ))}
        </div>
      );
    case 1:
      return <CrudActividades id={crudid} />;
  }
}

export default Actividades;
