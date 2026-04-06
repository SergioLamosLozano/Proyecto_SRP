import React, { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import "../styles/Materias.css";
import { jwtDecode } from "jwt-decode";
import { BuscarMateriasAsignadas, Estudiante_curso } from "../api/cursos";
import { EstudiantesGET } from "../api/usuarios";
import Table from "./Table";

function DocentesMaterias({ onBack }) {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [currentSubSection2, setCurrentSubSection2] = useState(null);
  const [caso, setcaso] = useState(0);
  const [estudiantes, setEstudiantes] = useState([]);
  const [listaPorCurso, setListaPorCurso] = useState([]);
  const [materias, setMaterias] = useState([]);

  const obtenerm = async (id) => {
    const res = await BuscarMateriasAsignadas(id);
    setMaterias(res.data);
  };

  useEffect(() => {
    {
      const token = sessionStorage.getItem("token");
      const decod = jwtDecode(token);
      obtenerm(decod.username);
    }
  }, []);

  const breadcrumbItems = [
    { label: "Inicio", path: "/docentes" },
    { label: "Pagina Docentes", path: "/docentes" },
    { label: "materias Asignadas", path: "/docentes/materias" },
    ...(currentSubSection
      ? [
          {
            label: currentSubSection,
            path: `/docentes/materias/${currentSubSection}`,
          },
        ]
      : []),
  ];

  const AccederAlGrado = async (gradoe) => {
    const res = await Estudiante_curso(gradoe);
    setCurrentSubSection(gradoe);
    if (!res.data) {
      setEstudiantes(null);
      setcaso(1);
      return;
    }
    const estudiantesformateados = res.data.map((item) => ({
      documento: item.estudiante.numero_documento,
      nombre: item.estudiante.nombre,
      correo: item.estudiante.correo,
      telefono: item.estudiante.telefono,
      estado: item.estudiante.estado,
    }));
    setEstudiantes(estudiantesformateados);
    setcaso(1);
  };

  const EstudiantesMateria = () => {
    return (
      <div>
        <Breadcrumbs
          items={breadcrumbItems}
          onNavigate={(path) => {
            if (path === "/docentes/materias") {
              setcaso(0);
              setCurrentSubSection("");
            } else {
              onBack();
            }
          }}
        />
        <div className="contenedor-materia2">
          {estudiantes != null ? (
            <div>
              <label>{estudiantes.id_estudiantes_cursos}</label>
              <Table
                id="Estudiantes"
                data={estudiantes}
                users={estudiantes}
                parametrobuscar="documento"
                busqueda={["documento", "nombre"]}
                title="Gestión de Estudiantes"
                description="Registro manual de estudiantes."
                columns={[
                  { key: "nombre", label: "NOMBRE" },
                  { key: "documento", label: "IDENTIFICACIÓN" },
                  { key: "correo", label: "CORREO" },
                  { key: "telefono", label: "TELEFONO" },
                  { key: "estado", label: "ESTADO" },
                ]}
                searchPlaceholder="Buscar por Documento..."
                addButtonText="Añadir estudiante"
                actions={[
                  {
                    label: "ver 👀",
                  },
                ]}
              />
            </div>
          ) : (
            <div>No hay estudiantes registrados a este grado</div>
          )}
        </div>
      </div>
    );
  };

  switch (caso) {
    case 0:
      return (
        <div>
          <Breadcrumbs items={breadcrumbItems} onNavigate={onBack} />
          <div className="contenedor-materia">
            {materias.map((item, index) => (
              <div
                key={index}
                className="matematicas-descripcion"
                onClick={() => AccederAlGrado(item.curso)}
              >
                <span>{item.materia}</span>
                <label>{item.curso}</label>
              </div>
            ))}
          </div>
        </div>
      );
    case 1:
      return <EstudiantesMateria />;
  }
}

export default DocentesMaterias;
