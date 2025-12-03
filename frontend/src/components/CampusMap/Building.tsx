import React, { useCallback } from 'react';

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
  onFocus?: () => void;
  onBlur?: () => void;
}

const BuildingComponent: React.FC<BuildingProps> = ({
  building,
  isSelected,
  showEvents,
  onClick,
  onKeyDown,
  onFocus = () => {},
  onBlur = () => {}
}) => {
  const handleClick = useCallback(() => {
    onClick(building);
  }, [building, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    onKeyDown(e, building);
  }, [building, onKeyDown]);

  const handleFocus = useCallback(() => {
    onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur();
  }, [onBlur]);

  const hasEvents = building.hasUpcomingEvent && showEvents;
  const fontSize = Math.max(10, Math.min(14, building.width / 12));
  
  // Generar IDs únicos para ARIA
  const descriptionId = `building-desc-${building.id}`;
  const labelId = `building-label-${building.id}`;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      aria-haspopup="dialog"
      aria-expanded={isSelected}
      data-building-id={building.id}
      data-testid={`building-${building.id}`}
      className="transition-all duration-200 hover:opacity-90 focus:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      
      {/* Edificio principal */}
      <rect
        x={building.x}
        y={building.y}
        width={building.width}
        height={building.height}
        rx={8}
        fill={isSelected ? `${building.fill}DD` : building.fill}
        stroke={isSelected ? "#1e40af" : "#ffffff"}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
        aria-hidden="true"
      />
      
      {/* Etiqueta visual del edificio */}
      <text
        x={building.x + building.width / 2}
        y={building.y + building.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none pointer-events-none font-semibold"
        fill="#ffffff"
        fontSize={fontSize}
        style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
        aria-hidden="true"
      >
        {building.name.split(" ").map((word, i, arr) => 
          arr.length > 2 && i === 1 ? `${word}\n` : word
        ).join(" ")}
      </text>
      
      {/* Indicador de ocupación */}
      {building.occupancy !== undefined && (
        <g 
          transform={`translate(${building.x + 8}, ${building.y + 8})`}
          aria-hidden="true"
          data-testid={`occupancy-${building.id}`}
        >
          <circle 
            r={6} 
            fill={building.occupancy > 80 ? "#ef4444" : building.occupancy > 60 ? "#f59e0b" : "#10b981"}
            data-occupancy-level={building.occupancy > 80 ? "high" : building.occupancy > 60 ? "medium" : "low"}
          />
          <text
            x={0}
            y={2}
            textAnchor="middle"
            fontSize={7}
            fill="white"
            fontWeight="bold"
          >
            {building.occupancy}%
          </text>
        </g>
      )}
      
      {/* Badge de eventos */}
      {hasEvents && (
        <g 
          transform={`translate(${building.x + building.width - 12}, ${building.y + 12})`}
          role="status"
          aria-label="Evento próximo"
          data-testid={`event-badge-${building.id}`}
        >
          <circle 
            r={6} 
            fill="#dc2626" 
            stroke="#ffffff" 
            strokeWidth={1.5}
            className="animate-pulse"
          />
          <text
            x={0}
            y={1}
            textAnchor="middle"
            fontSize={7}
            fill="#ffffff"
            fontWeight="bold"
            aria-hidden="true"
          >
            !
          </text>
        </g>
      )}
      
      {/* Área táctil ampliada */}
      <rect
        x={building.x - Math.max(0, (44 - building.width) / 2)}
        y={building.y - Math.max(0, (44 - building.height) / 2)}
        width={Math.max(building.width, 44)}
        height={Math.max(building.height, 44)}
        fill="transparent"
        style={{ cursor: "pointer" }}
        aria-hidden="true"
      />
      
      {/* Indicador visual de foco - CORREGIDO */}
      <rect
        x={building.x - 4}
        y={building.y - 4}
        width={building.width + 8}
        height={building.height + 8}
        rx={10}
        fill="none"
        stroke="transparent"
        strokeWidth={2}
        className="focus-visible:stroke-blue-500"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      />
    </g>
  );
};

export default BuildingComponent;