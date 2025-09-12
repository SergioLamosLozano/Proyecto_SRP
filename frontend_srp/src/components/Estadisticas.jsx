import GraficoBarras from "./Gaficas_barras";
import GraficoLineas from "./Graficas_linea";
import GraficoCircular from "./Graficas_circular";
import "../styles/Estadisticas.css";

function Estadisticas({ onBack }) {
  return (
    <div className="Estadistica-content-1">
      <main className="Estadistica-content">
        <div className="Estadistica-header">
          <h1>Estadísticas</h1>
          <p>Estadísticas de diferentes campos</p>
        </div>

        <div className="Estadistica-cards">
          <div className="card-Estadistica">
            <h3>Estadística uno</h3>
            <div className="grafico-container">
              <GraficoBarras />
            </div>
          </div>

          <div className="card-Estadistica">
            <h3>Estadística dos</h3>
            <div className="grafico-container">
              <GraficoLineas />
            </div>
          </div>

          <div className="card-Estadistica">
            <h3>Estadística tres</h3>
            <div className="grafico-container">
              <GraficoCircular />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Estadisticas;
