import { useState } from "react";
import "../styles/Actividades.css";
import Breadcrumbs from "./Breadcrumbs"; // Aseguramos la importación del componente
import CrudActividades from "./CrudsActividades";

function Actividades({ onBack }) {
  const [id, setid] = useState(0); // 0: Menú de tarjetas, 1: Submódulo (CRUD)
  const [crudid, setCrudid] = useState(0);
  const [currentSubSection, setcurrentSubSection] = useState(null);

  const submodulos = [
    {
      id: 2,
      titulo: "Crear Actividad",
      des: "En este apartado el docente podrá crear una actividad para un grupo en concreto.",
    },
    {
      id: 3,
      titulo: "Calificar",
      des: "En este apartado el docente podrá calificar las actividades impuestas por el mismo.",
    },
    {
      id: 1,
      titulo: "Modificar Nota",
      des: "En este apartado se podrán modificar la nota de un estudiante.",
    },
    {
      id: 4,
      titulo: "Resultados de aprendizaje",
      des: "En este apartado se podrán modificar o crear R.As.",
    },
    {
      id: 5,
      titulo: "Definitivas",
      des: "En este apartado se podrán sacar las definitivas de los estudiantes y también consultarlas.",
    },
  ];

  // 1. Construcción dinámica del arreglo de Breadcrumbs
  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Página Docentes", path: "/docentes" },
    { label: "Actividades", path: "/docentes/actividades" },
    ...(id === 1 && currentSubSection
      ? [
          {
            label: currentSubSection,
            path: `/docentes/actividades/${crudid}`,
          },
        ]
      : []),
  ];

  // 2. Manejador de clics en los enlaces del Breadcrumb
  const handleNavigate = (path) => {
    if (path === "/docentes/actividades") {
      // Si el usuario está dentro de un CRUD y presiona "Actividades", lo regresa al menú principal
      setid(0);
      setcurrentSubSection(null);
    } else {
      // Si presiona "Inicio" o "Página Docentes", se sale al menú raíz heredado
      onBack();
    }
  };

  // 3. Activa el CRUD guardando tanto el ID como el título para el Breadcrumb
  const AbrirCruds = (moduloId, moduloTitulo) => {
    setCrudid(moduloId);
    setcurrentSubSection(moduloTitulo);
    setid(1);
  };

  switch (id) {
    case 0:
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Renderizamos el Breadcrumb en la raíz del módulo */}
          <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />

          <div
            className="definitivas-titulo"
            style={{ borderRadius: "10px 10px 0 0" }}
          >
            <h1>Panel de Actividades y Calificaciones</h1>
            <p>
              Selecciona una herramienta pedagógica para gestionar tus grupos
              escolares.
            </p>
          </div>

          <div className="actividades-container1">
            {submodulos.map((item, index) => (
              <div
                key={index}
                className="actividades-tarjetas-modulos"
                onClick={() => AbrirCruds(item.id, item.titulo)}
                style={{ cursor: "pointer" }}
              >
                <span>{item.titulo}</span>
                <p>{item.des}</p>
                <button
                  className="definitivas-btn definitivas-btn-primario"
                  style={{ width: "100%", marginTop: "auto", padding: "8px" }}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic se dispare dos veces por la tarjeta
                    AbrirCruds(item.id, item.titulo);
                  }}
                >
                  Ingresar
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    case 1:
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Renderizamos el mismo Breadcrumb dentro de la vista del CRUD */}
          <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />

          {/* Inyectamos el CRUD pasándole adicionalmente la capacidad de resetear el estado si es necesario */}
          <CrudActividades
            id={crudid}
            setid={(nuevoId) => {
              setid(nuevoId);
              if (nuevoId === 0) setcurrentSubSection(null);
            }}
          />
        </div>
      );

    default:
      return null;
  }
}

export default Actividades;
