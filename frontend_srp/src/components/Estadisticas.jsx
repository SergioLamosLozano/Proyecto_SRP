import GraficoBarras from "./Gaficas_barras";
import GraficoLineas from "./Graficas_linea";
import GraficoCircular from "./Graficas_circular";
import "../styles/Estadisticas.css";

function Estadisticas() {
  return (
    <div className="Estadistica-content-1">
      <main className="Estadistica-content">
        <div className="Estadistica-header">
          <h1>Estadisticas</h1>
          <p>Estadisticas de diferentes campos</p>
        </div>

        <div className="Estadistica-cards">
          <div className="card-Estadistica">
            <h3>Estadistica uno</h3>
            <div>
              <GraficoBarras />
            </div>
          </div>

          <div className="card-Estadistica">
            <h3>Estadistica dos</h3>
            <div>
              <GraficoLineas />
            </div>
          </div>

          <div className="card-Estadistica">
            <h3>Estadistica tres</h3>
            <div>
              <GraficoCircular />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Estadisticas;
