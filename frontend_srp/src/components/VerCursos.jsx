import "../styles/VerCursos.css";

function VerCursos({ cursosC = [], onClick }) {
  const listaDeColores = [
    "rgba(156, 1, 1, 0.9)", // un poco más fuerte
    "rgba(156, 1, 1, 0.7)", // un poco más suave
    "rgba(176, 10, 10, 0.85)", // tono ligeramente más claro
    "rgba(136, 0, 0, 0.85)", // tono ligeramente más oscuro
    "rgba(180, 20, 20, 0.8)", // más brillante
    "rgba(120, 0, 0, 0.8)", // más oscuro
    "rgba(200, 40, 40, 0.75)", // menos saturado y más claro
    "rgba(100, 0, 0, 0.9)", // más profundo
    "rgba(160, 20, 20, 0.6)", // rojo suave
    "rgba(140, 0, 0, 0.95)", // casi sólido
  ];
  return (
    <div className="contenedor_grid_targetasC">
      {cursosC.length > 0 ? (
        cursosC.map((item, index) => {
          const RandomColor =
            listaDeColores[Math.floor(Math.random() * listaDeColores.length)];
          return (
            <div
              className="Targetas_cursosC"
              key={index}
              style={{ backgroundColor: `${RandomColor}` }}
              onClick={() => onClick(item.nombre)}
            >
              <span>{item.nombre}</span>
            </div>
          );
        })
      ) : (
        <p>No hay cursos</p>
      )}
    </div>
  );
}

export default VerCursos;
