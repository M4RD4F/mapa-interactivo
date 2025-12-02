import React from 'react';
import type { Viewport } from './types';
import BuildingComponent from './Building';
import { BUILDINGS } from './constants';
import { getFilteredBuildings } from '../../utils/mapCalculations';

interface MapRendererProps {
  viewport: Viewport;
  isDragging: boolean;
  searchTerm: string;
  selectedCategory: string;
  showEvents: boolean;
  selectedBuildingId: string | null;
  onBuildingClick: (building: any) => void;
  onBuildingKeyDown: (e: React.KeyboardEvent, building: any) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

const MapRenderer: React.FC<MapRendererProps> = ({
  viewport,
  isDragging,
  searchTerm,
  selectedCategory,
  showEvents,
  selectedBuildingId,
  onBuildingClick,
  onBuildingKeyDown,
  onMouseDown,
  onTouchStart
}) => {
  const filteredBuildings = getFilteredBuildings(BUILDINGS, searchTerm, selectedCategory);

  return (
    <div
      className="relative bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden border-2 border-white"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <svg
        viewBox="0 0 900 540"
        className="w-full h-[500px] md:h-[600px]"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
      >
        {/* Caminos principales */}
        <g className="opacity-80">
          <path
            d="M0,220 L900,220 M0,260 L900,260 M300,0 L300,540 M340,0 L340,540"
            stroke="#ffffff"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <path
            d="M0,220 Q450,240 900,220 M0,260 Q450,280 900,260"
            stroke="#f8fafc"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </g>

        {/* Áreas verdes */}
        <g>
          <rect x="50" y="20" width="800" height="40" rx="20" fill="#22c55e" opacity="0.3" />
          <rect x="20" y="450" width="860" height="70" rx="35" fill="#22c55e" opacity="0.3" />
          <circle cx="150" cy="100" r="30" fill="#86efac" opacity="0.4" />
          <circle cx="750" cy="150" r="25" fill="#86efac" opacity="0.4" />
          <circle cx="400" cy="400" r="35" fill="#86efac" opacity="0.4" />
        </g>

        {/* Edificios */}
        <g id="buildings">
          {filteredBuildings.map(building => (
            <BuildingComponent
              key={building.id}
              building={building}
              isSelected={selectedBuildingId === building.id}
              showEvents={showEvents}
              onClick={onBuildingClick}
              onKeyDown={onBuildingKeyDown}
            />
          ))}
        </g>

        {/* Indicador de arrastre */}
        {isDragging && (
          <text
            x="450"
            y="270"
            textAnchor="middle"
            fontSize="14"
            fill="#6b7280"
            opacity="0.7"
            style={{ userSelect: 'none' }}
          >
            Arrastrando...
          </text>
        )}
      </svg>
    </div>
  );
};

export default MapRenderer;
