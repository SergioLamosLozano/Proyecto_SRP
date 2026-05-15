import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/RAs.css";
import { CrearRAs, TraerMateriasProfesor } from "../api/cursos";
import { Alert } from "../utils/alert";

function CrearOModificarRAs({ listaRAs, funcion }) {
  const [id_profe, setid_profe] = useState("");
  const [id, setid] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalseleccioncurso, setmodalseleccioncurso] = useState(false);
  const [Materias, setMaterias] = useState([]);
  const [MateriaSeleccionada, setMateriaSeleccionada] = useState([]);
  const [selecciondemateriaycurso, setselecciondemateriaycurso] = useState(
    "seleccione una materia",
  );
  const [disabledModificar, setdisabledModificar] = useState(true);
  // estados para crear R.A
  const [mat, setmat] = useState(0);
  const [nombreRA, setnombreRA] = useState("");
  const [porcentaje, setporcentaje] = useState(0);
  const [numeroRA, setnumeroRA] = useState(0);
  const [periodoRA, setperiodoRA] = useState(0);
  // estados para modificar R.A
  const [idRAM, setidRAM] = useState(0);
  const [matM, setmatM] = useState(0);
  const [nombreRAM, setnombreRAM] = useState("");
  const [porcentajeM, setporcentajeM] = useState(0);
  const [numeroRAM, setnumeroRAM] = useState(0);
  const [periodoRAM, setperiodoRAM] = useState(0);
  const [selecciondemateriaycursoM, setselecciondemateriaycursoM] = useState(
    "seleccione una materia",
  );

  const RAseleccionado = (item) => {
    setdisabledModificar(false);
    setidRAM(item.id_ra);
    setmatM(item.fk_id_materia_profesores);
    setnombreRAM(item.nombre_ra);
    setporcentajeM(item.porcentaje);
    setnumeroRAM(item.numero_ra);
    setperiodoRAM(item.fk_id_periodo_academico);
    setselecciondemateriaycursoM(`${item.materia} / ${item.curso}`);
  };

  const BuscarRAModificar = () => {
    const filtro = listaRAs.find((ra) => ra.id_ra == idRAM);
    if (!filtro) {
      return Alert("error", "R.A no encontrado, porfavor revisar el id");
    }
    setdisabledModificar(false);
    setidRAM(filtro.id_ra);
    setmatM(filtro.fk_id_materia_profesores);
    setnombreRAM(filtro.nombre_ra);
    setporcentajeM(filtro.porcentaje);
    setnumeroRAM(filtro.numero_ra);
    setperiodoRAM(filtro.fk_id_periodo_academico);
    setselecciondemateriaycursoM(`${filtro.materia} / ${filtro.curso}`);
  };

  const filtro1 = (item) => {
    const filtro = Materias.filter((mat) => mat.nombre_materia == item);
    setMateriaSeleccionada(filtro);
    setmodalseleccioncurso(true);
    console.log(filtro);
  };

  const SeleccionarCursoYMateria = (id_materia, materiaycurso) => {
    if (id == 2) {
      setmatM(parseInt(id_materia));
      setselecciondemateriaycursoM(materiaycurso);
      setmodalseleccioncurso(false);
      setModal(false);
      return;
    }
    setmat(parseInt(id_materia));
    setselecciondemateriaycurso(materiaycurso);
    setmodalseleccioncurso(false);
    setModal(false);
  };

  const TraerMat = async (prof) => {
    const res = await TraerMateriasProfesor(prof);
    setMaterias(res.data);
  };

  const CrearRA = async () => {
    if (
      !nombreRA &&
      !porcentaje &&
      !numeroRA != 0 &&
      !periodoRA != 0 &&
      !mat != 0
    ) {
      return Alert("info", "llene todos los campos porfavor");
    }
    const res = await CrearRAs({
      id_profesor: id_profe,
      nombre_ra: nombreRA,
      porcentaje: porcentaje,
      numero_ra: numeroRA,
      fk_id_periodo_academico: periodoRA,
      fk_id_materia_profesores: mat,
    });
    setmat(0);
    setselecciondemateriaycurso("seleccione una materia");
    setnombreRA("");
    setnumeroRA(0);
    setporcentaje(0);
    setperiodoRA(0);
    funcion();
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decoded = jwtDecode(token);
    TraerMat(decoded.username);
    setid_profe(decoded.username);
  }, []);

  const MateriasProfesor = () => {
    return (
      <div className="modal-fondo-negro">
        {modalseleccioncurso ? (
          <div className="modal-campos-materias">
            <div className="modal-campos-materias-titulo">
              <h1>Seleccione un curso</h1>
              <p onClick={() => setmodalseleccioncurso(false)}>X</p>
            </div>
            <div className="modal-campos-materias-selecionar-materia-2">
              {MateriaSeleccionada.length > 0 ? (
                MateriaSeleccionada.map((item, index) => (
                  <div
                    key={index}
                    className="modal-campos-materias-selecionar-materia-2-cursos"
                  >
                    {item.cursos.map((item2, index) => (
                      <div
                        onClick={() =>
                          SeleccionarCursoYMateria(
                            item2.id_materia_profesores,
                            `${item.nombre_materia} / ${item2.nombre_curso}`,
                          )
                        }
                      >
                        <span>
                          ID Materia: <label>{item.fk_id_materia}</label>
                        </span>
                        <span>
                          Materia: <label>{item.nombre_materia}</label>
                        </span>
                        <span>
                          curso: <label>{item2.nombre_curso}</label>
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>
                  <h1>No se selecciono ninguna materia</h1>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modal-campos-materias">
            <div className="modal-campos-materias-titulo">
              <h1>Seleccione una materia</h1>
              <p onClick={() => setModal(false)}>X</p>
            </div>
            <div className="modal-campos-materias-selecionar-materia">
              {Materias.length ? (
                Materias.map((item, index) => (
                  <div
                    key={index}
                    className="modal-campos-materias-selecionar-materia-tarjeta"
                    onClick={() => filtro1(item.nombre_materia)}
                  >
                    <h2>{item.nombre_materia}</h2>
                  </div>
                ))
              ) : (
                <div>
                  <h1>No hay materias para mostrar</h1>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="RA-contenedor-padre">
      <div className="RA-contenedor-modificar-o-crear">
        <span
          className={`RA-contenedor-modificar-o-crear-span ${
            id == 1 ? "" : "activate"
          }`}
          onClick={() => setid(1)}
        >
          Crear
        </span>
        <span
          className={`RA-contenedor-modificar-o-crear-span ${
            id == 2 ? "" : "activate"
          }`}
          onClick={() => setid(2)}
        >
          Modificar
        </span>
      </div>
      <div className="RA-contenedor-modificar-o-crear-informacion">
        {id == 1 ? (
          <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1">
            <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-titulo">
              <h1>Crear</h1>
              <p>
                ¡Aqui podras crear todos los R.As necesarios para cada materia!
              </p>
            </div>
            <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-campos">
              <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-campos-informacion-uso">
                <p>
                  Para Crear un R.A se debe se seleccionar primero una materia
                  asignada, despues llene todos los campos, revise bien los
                  porcentajes de los cortes
                </p>
              </div>
              <div className="RA-contenedor-modificar-o-crear-contenedor-2">
                <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos">
                  <section>
                    <label>Nombre del R.A</label>
                    <input
                      placeholder="ej: R.A 1"
                      value={nombreRA}
                      onChange={(e) => setnombreRA(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Porcentaje del R.A</label>
                    <input
                      placeholder="ej: 4.5"
                      value={porcentaje}
                      onChange={(e) => setporcentaje(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Numero del R.A</label>
                    <input
                      placeholder="ej: 1"
                      value={numeroRA}
                      onChange={(e) => setnumeroRA(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Periodo</label>
                    <select
                      value={periodoRA}
                      onChange={(e) => setperiodoRA(e.target.value)}
                    >
                      <option hidden>Seleccione una opcion</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </section>
                  <section>
                    <label>Materia del R.A</label>
                    <button
                      className="RA-contenedor-modificar-o-crear-contenedor-2-campos-seleccionar-materia"
                      onClick={() => setModal(true)}
                    >
                      Seleccionar Materia
                    </button>
                    <input
                      value={selecciondemateriaycurso}
                      className="RA-contenedor-modificar-o-crear-contenedor-2-campos-seleccionar-materia-ver-materia"
                    />
                  </section>
                </div>
                <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs">
                  <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-titulo">
                    <h1>R.As</h1>
                  </div>
                  {listaRAs.length > 0 ? (
                    listaRAs.map((item, index) => (
                      <section onClick={() => RAseleccionado(item)}>
                        <span>
                          ID: <label>{item.id_ra}</label>
                        </span>
                        <span>
                          Nombre: <label>{item.nombre_ra}</label>
                        </span>
                        <span>
                          Materia: <label>{item.materia}</label>
                        </span>
                        <span>
                          Porcentaje: <label>{item.porcentaje}</label>
                        </span>
                        <span>
                          Curso: <label>{item.curso}</label>
                        </span>
                        <button onClick={() => RAseleccionado(item)}>
                          Modificar R.A
                        </button>
                      </section>
                    ))
                  ) : (
                    <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-no-RAs">
                      <h1>No hay R.As disponibles</h1>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-boton-crear"
                onClick={() => CrearRA()}
              >
                Crear R.A
              </button>
            </div>
          </div>
        ) : (
          <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1">
            <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-titulo">
              <h1>Modificar</h1>
              <p>¡Aqui podras modificar los diferentes R.As!</p>
            </div>
            <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-campos">
              <div className="RA-contenedor-modificar-o-crear-informacion-contenedor-1-campos-informacion-uso">
                <p>
                  Para modificar un R.A, primero selecciona un R.A de la parte
                  derecha, acontinuacion se mapeara todo su contenido en los
                  campos izquierdos, solo modifique el contendio de esos campos
                  y presione el boton actualizar, tambien puede buscar un R.A
                  por su codigo y de igual manera se mapeara su contenido
                </p>
              </div>
              <div className="RA-contenedor-modificar-o-crear-contenedor-2">
                <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos">
                  <section>
                    <label>Buscar por ID</label>
                    <input
                      placeholder="ej: 123"
                      className="RA-contenedor-modificar-o-crear-contenedor-2-campos-input-buscar"
                      value={idRAM}
                      disabled={!disabledModificar}
                      onChange={(e) => setidRAM(e.target.value)}
                    />
                    <div
                      className={`modificar-nota-campos-requeridos-sections-lupa ${
                        disabledModificar ? "" : "disabled"
                      }`}
                      onClick={() => BuscarRAModificar()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 485.213 485.213"
                      >
                        <path
                          d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324
			c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z"
                        />
                        <path
                          d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951
			C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46
			c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465
			C318.424,257.208,257.206,318.416,181.956,318.416z"
                        />
                        <path d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" />
                      </svg>
                    </div>
                  </section>
                  <section>
                    <label>Nombre del R.A</label>
                    <input
                      placeholder="ej: R.A 1"
                      disabled={disabledModificar}
                      value={nombreRAM}
                      onChange={(e) => setnombreRAM(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Porcentaje del R.A</label>
                    <input
                      placeholder="ej: 4.5"
                      disabled={disabledModificar}
                      value={porcentajeM}
                      onChange={(e) => setporcentajeM(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Numero del R.A</label>
                    <input
                      placeholder="ej: 1"
                      disabled={disabledModificar}
                      value={numeroRAM}
                      onChange={(e) => setnumeroRAM(e.target.value)}
                    />
                  </section>
                  <section>
                    <label>Periodo</label>
                    <select
                      value={periodoRAM}
                      onChange={(e) => setperiodoRAM(e.target.value)}
                      disabled={disabledModificar}
                    >
                      <option hidden>Seleccione una opcion</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </section>
                  <section>
                    <label>Materia del R.A</label>
                    <button
                      className="RA-contenedor-modificar-o-crear-contenedor-2-campos-seleccionar-materia"
                      onClick={() => setModal(true)}
                      disabled={disabledModificar}
                    >
                      Seleccionar Materia
                    </button>
                    <input
                      value={selecciondemateriaycursoM}
                      className="RA-contenedor-modificar-o-crear-contenedor-2-campos-seleccionar-materia-ver-materia"
                    />
                  </section>
                </div>
                <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs">
                  <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-titulo">
                    <h1>R.As</h1>
                  </div>
                  {listaRAs.length > 0 ? (
                    listaRAs.map((item, index) => (
                      <section onClick={() => RAseleccionado(item)}>
                        <span>
                          ID: <label>{item.id_ra}</label>
                        </span>
                        <span>
                          Nombre: <label>{item.nombre_ra}</label>
                        </span>
                        <span>
                          Materia: <label>{item.materia}</label>
                        </span>
                        <span>
                          Porcentaje: <label>{item.porcentaje}</label>
                        </span>
                        <span>
                          Curso: <label>{item.curso}</label>
                        </span>
                      </section>
                    ))
                  ) : (
                    <div className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-no-RAs">
                      <h1>No hay R.As disponibles</h1>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="RA-contenedor-modificar-o-crear-contenedor-2-campos-RAs-boton-crear"
                onClick={() => CrearRA()}
              >
                Crear R.A
              </button>
            </div>
          </div>
        )}
      </div>
      {modal && <MateriasProfesor />}
    </div>
  );
}

export default CrearOModificarRAs;
