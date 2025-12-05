import { useEffect, useState } from "react";
import "../styles/Actividades.css";
import Breadcrumbs from "./Breadcrumbs";
import { actividadesAnteriores } from "../api/usuarios";
import { jwtDecode } from "jwt-decode";
import { BuscarMateriaAsignada, BuscarMateriasAsignadas } from "../api/cursos";

function Actividades({ onBack }) {
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [ActividadesA, setActividadesA] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");
  const [tipoA, setTipoA] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [materiaP, setMateriaP] = useState("");
  const [MaterProfesor, setMateriaProfesor] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("error al obtener el token");
    }

    const decoded = jwtDecode(token);
    CargarActividades(decoded.username);
  }, []);

  const CargarActividades = async (id) => {
    try {
      const response = await actividadesAnteriores(id);
      const response2 = await BuscarMateriasAsignadas(id);
      setActividadesA(response.data);
      setMateriaProfesor(response2.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const Sections = [
    {
      nombre: "actividades anteriores 🗒️",
      descripcion:
        "En este apartado se podran ver las actividades anteriormente asignadas",
    },
    {
      nombre: "Crear actividades 📒",
      descripcion:
        "En este apartado se podra crear nuevas actividades para los distintas materias ",
    },
    {
      nombre: "Calificar ✏️",
      descripcion:
        "En este apartado se podra calificar las actividades que se an asignado a los distintos cursos",
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

  const handleNavigate = (path) => {
    if (path === "/docentes") {
      onBack();
    } else if (path === "/docentes/actividades") {
      setCurrentSubSection(null);
    }
  };
  const render = () => {
    switch (currentSubSection) {
      case "actividades anteriores 🗒️":
        return (
          <div className="ActividadesContenedor2">
            <h1 className="TituloActividades">Actividades anteriores</h1>
            <div className="ActividadesContenedor3">
              {ActividadesA.map((item, index) => (
                <div className="actividadCard" key={index}>
                  <h3 className="actividadTitulo">{item.nombre}</h3>

                  <p>
                    <strong>Tipo:</strong> {item.Tipo_Actividad}
                  </p>
                  <p>
                    <strong>Porcentaje:</strong> {item.porcentaje}%
                  </p>

                  <p>
                    <strong>Fecha Inicio/Fin:</strong> {item.fecha_inicio} →{" "}
                    {item.fecha_fin}
                  </p>

                  <p>
                    <strong>Materia:</strong>{" "}
                    {item.MateriaProfesores.materia_nombre}
                  </p>
                  <p>
                    <strong>Curso:</strong>{" "}
                    {item.MateriaProfesores.curso_nombre}
                  </p>

                  <p>
                    <strong>Profesor:</strong>{" "}
                    {item.MateriaProfesores.profesor_nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Crear actividades 📒":
        return (
          <div className="crearActividadContenedorFull">
            <h1 className="TituloCrearActividad">Crear nueva actividad</h1>

            <div className="formCrearActividad">
              <div className="campoActividad">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre de la actividad" />
              </div>

              <div className="campoActividad">
                <label>Descripción</label>
                <textarea placeholder="Descripción..." />
              </div>

              <div className="campoActividad">
                <label>Porcentaje</label>
                <input type="number" step="0.01" placeholder="Ej: 4.5" />
              </div>

              <div className="filaActividad">
                <div className="campoActividad">
                  <label>Fecha inicio</label>
                  <input type="date" />
                </div>

                <div className="campoActividad">
                  <label>Fecha fin</label>
                  <input type="date" />
                </div>
              </div>

              <div className="campoActividad">
                <label>Tipo actividad</label>
                <select>
                  <option>Seleccione...</option>
                </select>
              </div>

              <div className="campoActividad">
                <label>Periodo académico</label>
                <select>
                  <option>Seleccione...</option>
                </select>
              </div>

              <div className="campoActividad">
                <label>Materia / Profesor</label>
                <select
                  value={materiaP}
                  onChange={(e) => setMateriaP(e.target.value)}
                >
                  <option hidden>Seleccione...</option>
                  {MaterProfesor.map((item, index) => (
                    <option key={index} value={item.id_materia_profesores}>
                      {item.materia_nombre} / {item.curso_nombre}
                    </option>
                  ))}
                  <option>Seleccione...</option>
                </select>
              </div>

              <button className="btnCrearActividad">Guardar actividad</button>
            </div>
          </div>
        );

      case "Calificar ✏️":
        return (
          <div className="calificarContenedorFull">
            <h1 className="TituloCalificar">Calificar actividad</h1>

            <div className="formCalificar">
              <div className="campoCalificar">
                <label>Documento del estudiante</label>
                <input
                  type="text"
                  placeholder="Ingrese documento del estudiante"
                />
              </div>

              <div className="campoCalificar">
                <label>Documento del profesor</label>
                <input
                  type="text"
                  placeholder="Ingrese documento del profesor"
                />
              </div>

              <div className="campoCalificar">
                <label>Seleccione actividad</label>
                <select>
                  <option>Seleccione...</option>
                </select>
              </div>

              <div className="campoCalificar">
                <label>Calificación</label>
                <input type="number" step="0.01" placeholder="Ej: 4.5" />
              </div>

              <button className="btnCalificar">Guardar calificación</button>
            </div>
          </div>
        );
    }
  };
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
      <div className="ActividadesContainer">
        {currentSubSection ? (
          render()
        ) : (
          <>
            <h1 className="TituloActividades">Actividades</h1>
            <div className="ActividadesContenedor2">
              {Sections.map((item, index) => (
                <div
                  className="TargetaActividades"
                  key={index}
                  onClick={() => setCurrentSubSection(item.nombre)}
                >
                  <h2>{item.nombre}</h2>
                  <p>{item.descripcion}</p>
                  <button onClick={() => setCurrentSubSection(item.nombre)}>
                    Ingresar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Actividades;
