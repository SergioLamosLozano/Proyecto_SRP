import { useState } from "react";
import "../styles/Actividades.css";

function CrudActividades({ id }) {
  const [año, setAño] = useState(2026);
  const [mes, setMes] = useState(new Date().getMonth());
  const [dia, setdia] = useState(0);
  const [minimodal, setMinimodal] = useState(false);
  const obtenerDiasMes = () => {
    const dias = new Date(año, mes + 1, 0).getDate();
    return Array.from({ length: dias }, (_, i) => i + 1);
  };

  const meses = [
    { id: 0, mes: "Enero" },
    { id: 1, mes: "Febrero" },
    { id: 2, mes: "Marzo" },
    { id: 3, mes: "Abril" },
    { id: 4, mes: "Mayo" },
    { id: 5, mes: "Junio" },
    { id: 6, mes: "Julio" },
    { id: 7, mes: "Agosto" },
    { id: 8, mes: "Septiembre" },
    { id: 9, mes: "Octubre" },
    { id: 10, mes: "Noviembre" },
    { id: 11, mes: "Diciembre" },
  ];

  const tareas = [
    {
      fecha: "2026/3/7",
      tarea: "Taller 1",
    },
    {
      fecha: "2026/3/7",
      tarea: "Ecuacones",
    },
    {
      fecha: "2026/2/24",
      tarea: "Taller 2",
    },
    {
      fecha: "2026/2/3",
      tarea: "Examen",
    },
  ];

  const filtro = meses.find((m) => m.id == mes);

  const abirim = (dias) => {
    setdia(dias);
    setMinimodal(true);
  };

  const Minim = () => {
    const tareaabuscar = tareas.filter(
      (t) => t.fecha == `${año}/${mes + 1}/${dia}`,
    );
    const flecha = ">";

    return (
      <div className="calendario-container-modal-fondo">
        <div className="calendario-container-modal">
          <section>
            {dia} de {filtro.mes}
            <p
              className="calendario-container-modal-salir"
              onClick={() => setMinimodal(false)}
            >
              X
            </p>
          </section>
          <div className="calendario-container-modal-tareas">
            {tareaabuscar.length > 0 ? (
              tareaabuscar.map((item, index) => (
                <div className="calendario-container-modal-tareas-fechafin-fechainicio">
                  <div className="calendario-container-modal-tareas-fechainicio" />
                  <p key={index}>{item.tarea}</p>
                  <p className="flecha">{flecha}</p>
                </div>
              ))
            ) : (
              <div>No hay actividades para esta fecha</div>
            )}
          </div>
          <div className="calendario-container-modal-tareas-btn">
            {" "}
            <button>Crear tarea</button>
          </div>
        </div>
      </div>
    );
  };

  const obtenerdias = obtenerDiasMes();
  switch (id) {
    case 1:
      return <label>{id}</label>;
    case 2:
      return (
        <div className="calendario-contenedor">
          <div className="calendario-contenedor-titulo">
            <section>
              <svg
                viewBox="0 0 131 126"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "50px", height: "50px", fill: "white" }}
              >
                <path d="M39.1,38.8c-2.3,0-4.1-1.9-4.1-4.1V19.7c0-2.3,1.9-4.1,4.1-4.1c2.3,0,4.1,1.9,4.1,4.1v14.9C43.2,36.9,41.4,38.8,39.1,38.8  L39.1,38.8z M89.1,38.8c-2.3,0-4.2-1.9-4.2-4.1V19.7c0-2.3,1.9-4.1,4.2-4.1c2.3,0,4.1,1.9,4.1,4.1v14.9  C93.2,36.9,91.4,38.8,89.1,38.8L89.1,38.8z M103.5,103.1V47.7H23.9v55.4H103.5L103.5,103.1z M10.3,33.2c0-5.5,4.4-9.9,9.9-9.9h13.3  v4.4c-1.7,1.5-2.8,3.8-2.8,6.2c0,4.6,3.7,8.3,8.3,8.3c4.6,0,8.3-3.7,8.3-8.3c0-2.5-1.1-4.7-2.8-6.2v-4.4h38.9v4.4  c-1.7,1.5-2.8,3.8-2.8,6.2c0,4.6,3.7,8.3,8.3,8.3c4.6,0,8.3-3.7,8.3-8.3c0-2.5-1.1-4.7-2.8-6.2v-4.4h12.6c5.5,0,9.9,4.4,9.9,9.9  v68.9c0,5.5-4.4,9.9-9.9,9.9h-87c-5.5,0-9.9-4.4-9.9-9.9V33.2L10.3,33.2z M33.7,85.8h11.5v11.5H33.7V85.8L33.7,85.8z M33.7,69.6  h11.5v11.5H33.7V69.6L33.7,69.6z M49.9,69.6h11.5v11.5H49.9V69.6L49.9,69.6z M66.1,69.6h11.5v11.5H66.1V69.6L66.1,69.6z M82.3,69.6  h11.5v11.5H82.3V69.6L82.3,69.6z M82.3,53.4h11.5v11.5H82.3V53.4L82.3,53.4z M66.1,53.4h11.5v11.5H66.1V53.4L66.1,53.4z M49.9,53.4  h11.5v11.5H49.9V53.4L49.9,53.4z M49.9,85.8h11.5v11.5H49.9V85.8L49.9,85.8z" />
              </svg>
              Crea tu actividad
              <div className="calendario-contenedor-select">
                <select
                  value={año}
                  onChange={(e) => setAño(Number(e.target.value))}
                >
                  <option hidden>Año (2026)</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                  <option value={2030}>2030</option>
                  <option value={2031}>2031</option>
                  <option value={2032}>2032</option>
                </select>
                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                >
                  <option hidden>{filtro.mes}</option>
                  {meses.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.mes}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            <p>!Selecciona un dia para crear una actividad¡</p>
          </div>
          <div className="calendario-contenedor-mes">
            {año} {filtro.mes}
          </div>
          <div className="calendario-contenedor-dias">
            {obtenerdias.map((item) => (
              <div
                className="calendario-contenedor-dias-seleccion"
                onClick={() => abirim(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {minimodal && <Minim />}
        </div>
      );
    case 3:
      return <label>{id}</label>;
  }
}

export default CrudActividades;
