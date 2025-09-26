import React from 'react';
import '../styles/Graficas.css';

const GraficaLinea = ({ data, title, width = 400, height = 250 }) => {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Encontrar valores mínimos y máximos
  const allValues = data.flatMap(series => series.data.map(point => point.value));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  // Obtener todas las etiquetas únicas del eje X
  const allLabels = [...new Set(data.flatMap(series => series.data.map(point => point.label)))];
  
  // Función para convertir coordenadas de datos a coordenadas SVG
  const getX = (index) => padding + (index / (allLabels.length - 1)) * chartWidth;
  const getY = (value) => padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Generar líneas de cuadrícula
  const gridLines = [];
  const numGridLines = 5;
  
  // Líneas horizontales
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (i / numGridLines) * chartHeight;
    const value = maxValue - (i / numGridLines) * valueRange;
    gridLines.push(
      <g key={`h-grid-${i}`}>
        <line
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
        <text
          x={padding - 10}
          y={y + 5}
          textAnchor="end"
          fontSize="12"
          fill="#666"
        >
          {Math.round(value)}
        </text>
      </g>
    );
  }

  // Líneas verticales
  allLabels.forEach((label, index) => {
    const x = getX(index);
    gridLines.push(
      <g key={`v-grid-${index}`}>
        <line
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
        <text
          x={x}
          y={padding + chartHeight + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          {label}
        </text>
      </g>
    );
  });

  return (
    <div className="grafica-linea-container">
      <h3 className="grafica-titulo">{title}</h3>
      <div className="grafica-content">
        <svg width={width} height={height + 30} className="grafica-linea">
          {/* Cuadrícula */}
          {gridLines}
          
          {/* Líneas de datos */}
          {data.map((series, seriesIndex) => {
            const color = series.color || `hsl(${seriesIndex * 60}, 70%, 50%)`;
            
            // Crear puntos de la línea
            const points = series.data.map((point, pointIndex) => {
              const labelIndex = allLabels.indexOf(point.label);
              return {
                x: getX(labelIndex),
                y: getY(point.value),
                value: point.value
              };
            });

            // Crear el path de la línea
            const pathData = points.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ');

            return (
              <g key={seriesIndex}>
                {/* Línea */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Puntos */}
                {points.map((point, pointIndex) => (
                  <circle
                    key={pointIndex}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                    className="data-point"
                  />
                ))}
              </g>
            );
          })}
        </svg>
        
        {/* Leyenda */}
        <div className="grafica-leyenda">
          {data.map((series, index) => (
            <div key={index} className="leyenda-item">
              <div 
                className="leyenda-color" 
                style={{ backgroundColor: series.color || `hsl(${index * 60}, 70%, 50%)` }}
              ></div>
              <span className="leyenda-texto">{series.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraficaLinea;