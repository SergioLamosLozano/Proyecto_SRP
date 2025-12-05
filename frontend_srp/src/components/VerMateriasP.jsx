import { Materias } from "../api/cursos";
import "../styles/vermaterias.css";

function VerMaterias({ ProfesorSeleccionado = [], titulo, salir }) {
  const listaDeFondos = [
    "./fondo1.png",
    "./fondo2.png",
    "./fondo3.png",
    "./fondo4.png",
    "./fondo5.png",
  ];
  return (
    <div className="fondo_negroV">
      <div className="ModalV">
        <div className="EncabezadoV">
          <h1>
            {titulo} {ProfesorSeleccionado.nombre1 || ""}
          </h1>
          <span onClick={salir}>x</span>
        </div>
        <div className="Targetas_ContainerV">
          {ProfesorSeleccionado?.materias?.length === 0 ? (
            <p className="inf">No hay materias asignadas</p>
          ) : (
            ProfesorSeleccionado.materias.map((item, index) => {
              const fondoRandom =
                listaDeFondos[Math.floor(Math.random() * listaDeFondos.length)];

              return (
                <div
                  key={index}
                  className="targetaV"
                  style={{ backgroundImage: `url(${fondoRandom})` }}
                >
                  <div className="targetaV2">
                    <h2>{item.materia_nombre}</h2>
                    <div>
                      <div className="div1">
                        <h3>Curso asignado: </h3>
                        <label>{item.curso_nombre}</label>
                      </div>
                      <label>Id materia: {item.id_materia_profesores}</label>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default VerMaterias;
