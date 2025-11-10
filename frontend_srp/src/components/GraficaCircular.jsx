import React from 'react';
import '../styles/Graficas.css';

const GraficaCircular = ({ data, title, size = 200 }) => {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calcular el total para obtener porcentajes
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calcular los ángulos para cada segmento
  let currentAngle = -90; // Comenzar desde arriba
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    // Convertir ángulos a radianes
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calcular puntos del arco
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // Determinar si el arco es mayor a 180 grados
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Crear el path del segmento
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      color: item.color || `hsl(${index * 60}, 70%, 50%)`
    };
  });

  return (
    <div className="grafica-circular-container">
      <h3 className="grafica-titulo">{title}</h3>
      <div className="grafica-content">
        <svg width={size} height={size} className="grafica-circular">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="2"
              className="segment"
            />
          ))}
        </svg>
        <div className="grafica-leyenda">
          {segments.map((segment, index) => (
            <div key={index} className="leyenda-item">
              <div 
                className="leyenda-color" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="leyenda-texto">
                {segment.label}: {segment.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraficaCircular;