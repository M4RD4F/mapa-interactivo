import React, { useCallback } from 'react';

// Define el tipo localmente si el import falla
type BuildingType = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  description: string;
  hasUpcomingEvent?: boolean;
  events?: { title: string; time: string; location: string }[];
  occupancy?: number;
  facilities?: string[];
  category?: string;
};

interface BuildingProps {
  building: BuildingType;
  isSelected: boolean;
  showEvents: boolean;
  onClick: (building: BuildingType) => void;
  onKeyDown: (e: React.KeyboardEvent, building: BuildingType) => void;
}

const BuildingComponent: React.FC<BuildingProps> = ({
  building,
  isSelected,
  showEvents,
  onClick,
  onKeyDown
}) => {
  const handleClick = useCallback(() => {
    onClick(building);
  }, [building, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    onKeyDown(e, building);
  }, [building, onKeyDown]);

  const hasEvents = building.hasUpcomingEvent && showEvents;
  const fontSize = Math.max(10, Math.min(14, building.width / 12));

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${building.name}. ${building.description} ${hasEvents ? 'Tiene eventos próximos.' : ''}`}
      className="transition-all duration-200 hover:opacity-90"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Sombra para efecto de profundidad */}
      <rect
        x={building.x + 3}
        y={building.y + 3}
        width={building.width}
        height={building.height}
        rx={10}
        fill="rgba(0,0,0,0.1)"
        opacity={0.3}
      />
      
      {/* Edificio principal */}
      <rect
        x={building.x}
        y={building.y}
        width={building.width}
        height={building.height}
        rx={10}
        fill={isSelected ? `${building.fill}CC` : building.fill}
        stroke={isSelected ? "#1e40af" : "#ffffff"}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
      />
      
      {/* Etiqueta del edificio */}
      <text
        x={building.x + building.width / 2}
        y={building.y + building.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none pointer-events-none font-semibold"
        fill="#ffffff"
        fontSize={fontSize}
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
        {building.name.split(" ").map((word, i, arr) => 
          arr.length > 2 && i === 1 ? `${word}\n` : word
        ).join(" ")}
      </text>
      
      {/* Indicador de ocupación */}
      {building.occupancy !== undefined && (
        <g transform={`translate(${building.x + 10}, ${building.y + 10})`}>
          <circle r={8} fill={building.occupancy > 80 ? "#ef4444" : "#10b981"} />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fontSize={8}
            fill="white"
            fontWeight="bold"
          >
            {building.occupancy}%
          </text>
        </g>
      )}
      
      {/* Badge de eventos */}
      {hasEvents && (
        <g transform={`translate(${building.x + building.width - 15}, ${building.y + 15})`}>
          <circle r={8} fill="#dc2626" stroke="#ffffff" strokeWidth={1.5} />
          <text
            x={0}
            y={2}
            textAnchor="middle"
            fontSize={9}
            fill="#ffffff"
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}
      
      {/* Área táctil ampliada */}
      <rect
        x={building.x - 10}
        y={building.y - 10}
        width={building.width + 20}
        height={building.height + 20}
        fill="transparent"
        style={{ cursor: "pointer" }}
      />
    </g>
  );
};

export default BuildingComponent;