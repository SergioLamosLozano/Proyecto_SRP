import { useEffect, useState } from "react";
import "../styles/Actividades.css";
import {
  CrearActividad,
  TraerActividades,
  TraerRAProfesor,
} from "../api/cursos";
import Modal from "./modal";
import { jwtDecode } from "jwt-decode";
import { Alert } from "../utils/alert";
import Calificar from "./Calificar";
import ModificarNota from "./ModificarNota";
import CrearOModificarRAs from "./CrearYModificarRA";
import DefinitivasModal from "./Definitivas";

function CrudActividades({ id, setid }) {
  const [año, setAño] = useState(2026);
  const [mes, setMes] = useState(new Date().getMonth());
  const [dia, setdia] = useState(0);
  const [minimodal, setMinimodal] = useState(false);
  const [modal, setmodal] = useState(false);
  const [actividadbuscar, setActividadBuscar] = useState({});
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [id_profe, setid_profe] = useState("");
  //estados
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [porcentaje, setPorcentaje] = useState(0);
  const [RA, setRA] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [RAs, setRAs] = useState([]);

  const obtenerDiasMes = () => {
    const dias = new Date(año, mes + 1, 0).getDate();
    return Array.from({ length: dias }, (_, i) => i + 1);
  };

  const ResultadosAprendizaje = async (id_profesor) => {
    const resp = await TraerRAProfesor(id_profesor);
    setRAs(resp.data);
  };

  const res = async (user) => {
    const resp = await TraerActividades(user);

    const data = resp.data;

    const agrupadas = data.reduce((acc, act) => {
      const fecha = act.fecha_inicio;

      if (!acc[fecha]) {
        acc[fecha] = [];
      }

      acc[fecha].push({
        id: act.id_actividades,
        nombre: act.nombre,
        descripcion: act.descripcion,
        curso: act.curso,
        materia: act.materia,
        tipo: act.Tipo_Actividad,
        porcentaje: act.porcentaje,
        fecha_inicio: act.fecha_inicio,
        fecha_fin: act.fecha_fin,
      });

      return acc;
    }, {});

    setActividadBuscar(agrupadas);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUsuario(decoded.username);
    res(decoded.username);
    ResultadosAprendizaje(decoded.username);
    setid_profe(decoded.username);
  }, []);
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

  const filtro = meses.find((m) => m.id == mes);

  const abirim = (dias) => {
    setdia(dias);
    setMinimodal(true);
  };

  const formatearFecha = (año, mes, dia) => {
    const mesFormateado = String(mes + 1).padStart(2, "0");
    const diaFormateado = String(dia).padStart(2, "0");

    return `${año}-${mesFormateado}-${diaFormateado}`;
  };

  const actividadesDelMes = Object.entries(actividadbuscar)
    .filter(([fecha]) => {
      const [a, m] = fecha.split("-");
      return Number(a) === año && Number(m) === mes + 1;
    })
    .flatMap(([fecha, actividades]) =>
      actividades.map((act) => ({
        ...act,
        fecha_inicio: fecha,
      })),
    );

  const CerrarModal = () => {
    setMinimodal(false);
    setmodal(false);
    setActividadSeleccionada(null);
  };

  const CrearAct = async () => {
    if (
      usuario &&
      nombre &&
      descripcion &&
      porcentaje != 0 &&
      fechaInicio &&
      tipo &&
      RA != 0
    ) {
      const resp = await CrearActividad({
        user_id: usuario,
        nombre: nombre,
        descripcion: descripcion,
        porcentaje: porcentaje,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        fk_id_tipo_actividad: tipo,
        fk_id_ra: RA,
      });
      if (resp.status == 201) {
        res(usuario);
        CerrarModal();
      }
    } else {
      Alert("info", "Todos los campos son requeridos");
    }
  };

  const Minim = () => {
    const fechaSeleccionada = formatearFecha(año, mes, dia);
    setFechaInicio(fechaSeleccionada);
    const tareaabuscar = actividadbuscar[fechaSeleccionada] || [];
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
              tareaabuscar.map((item) => (
                <div
                  key={item.id}
                  className="calendario-container-modal-tareas-fechafin-fechainicio"
                  onClick={() => {
                    setActividadSeleccionada(item);
                    setmodal(true);
                    setMinimodal(false);
                  }}
                >
                  <div className="calendario-container-modal-tareas-fechainicio" />

                  <div>
                    <p>
                      <strong>{item.nombre}</strong>
                    </p>
                    <p>
                      {item.tipo} - {item.porcentaje}%
                    </p>
                    <p>
                      {item.materia} ({item.curso})
                    </p>
                  </div>

                  <p className="flecha">{flecha}</p>
                </div>
              ))
            ) : (
              <div>No hay actividades para esta fecha</div>
            )}
          </div>
          <div className="calendario-container-modal-tareas-btn">
            {" "}
            <button
              onClick={() => {
                setmodal(true);
                setMinimodal(false);
              }}
            >
              Crear tarea
            </button>
          </div>
        </div>
      </div>
    );
  };

  const obtenerdias = obtenerDiasMes();
  switch (id) {
    case 1:
      return <ModificarNota listaRA={RAs} />;
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
          <div className="calendario-lista-mes">
            <h3 className="calendario-lista-mes-actividad-mes">
              Actividades del mes
            </h3>

            {actividadesDelMes.length > 0 ? (
              actividadesDelMes.map((item) => (
                <div key={item.id} className="calendario-item-mes">
                  <div>
                    <p onClick={() => console.log(item)}>
                      <strong>{item.nombre}</strong>
                    </p>
                  </div>
                  <div className="calendario-item-mes-fechas">
                    <p className="calendario-item-mes-fechas-inicio">
                      Inicio: {item.fecha_inicio}
                    </p>
                    <p className="calendario-item-mes-fechas-fin">
                      Fin: {item.fecha_fin || "Sin fecha fin"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay actividades en este mes</p>
            )}
          </div>
          {minimodal && <Minim />}
          {modal &&
            (actividadSeleccionada ? (
              <Modal
                titulo={"Detalle de Actividad"}
                inputs={[
                  {
                    nombre: "Nombre",
                    type: "text",
                    value: actividadSeleccionada.nombre,
                  },
                  {
                    nombre: "Descripción",
                    type: "text",
                    value: actividadSeleccionada.descripcion,
                  },
                  {
                    nombre: "Tipo",
                    type: "text",
                    value: actividadSeleccionada.tipo,
                  },
                  {
                    nombre: "Porcentaje",
                    type: "text",
                    value: actividadSeleccionada.porcentaje,
                  },
                  {
                    nombre: "Materia",
                    type: "text",
                    value: actividadSeleccionada.materia,
                  },
                  {
                    nombre: "Curso",
                    type: "text",
                    value: actividadSeleccionada.curso,
                  },
                  {
                    nombre: "Fecha Inicio",
                    type: "text",
                    value: actividadSeleccionada.fecha_inicio,
                  },
                  {
                    nombre: "Fecha Fin",
                    type: "text",
                    value: actividadSeleccionada.fecha_fin,
                  },
                ]}
                SalirM={() => CerrarModal()}
              />
            ) : (
              <Modal
                titulo={"Crear Actividad"}
                inputs={[
                  {
                    nombre: "Nombre",
                    type: "text",
                    value: nombre,
                    onChange: (e) => setNombre(e.target.value),
                  },
                  {
                    nombre: "Descripción",
                    type: "text",
                    value: descripcion,
                    onChange: (e) => setDescripcion(e.target.value),
                  },
                  {
                    nombre: "Porcentaje",
                    type: "number",
                    value: porcentaje,
                    onChange: (e) => setPorcentaje(e.target.value),
                  },
                  {
                    nombre: "Fecha Inicio",
                    type: "date",
                    value: fechaInicio,
                    disabled: true,
                  },
                  {
                    nombre: "Fecha Fin",
                    type: "date",
                    value: fechaFin,
                    onChange: (e) => setFechaFin(e.target.value),
                  },
                ]}
                select={[
                  {
                    nombre: "Tipo Actividad",
                    value: tipo,
                    onChange: (e) => setTipo(e.target.value),
                    opciones: [
                      { value: 1, title: "Tarea" },
                      { value: 2, title: "Taller" },
                      { value: 3, title: "Examen" },
                    ],
                  },
                  {
                    nombre: "Resultados de aprendizaje",
                    value: RA,
                    onChange: (e) => setRA(e.target.value),
                    opciones: RAs.map((item) => ({
                      value: item.id_ra,
                      title: `${item.nombre_ra} / ${item.materia}`,
                    })),
                  },
                ]}
                acciones={[
                  {
                    nombre: "Crear",
                    click: () => CrearAct(),
                  },
                ]}
                SalirM={() => CerrarModal()}
              />
            ))}
        </div>
      );
    case 3:
      return <Calificar listaRAs={RAs} />;

    case 4:
      return (
        <CrearOModificarRAs
          listaRAs={RAs}
          funcion={() => ResultadosAprendizaje(parseInt(id_profe))}
        />
      );
    case 5:
      return <DefinitivasModal />;
  }
}

export default CrudActividades;
