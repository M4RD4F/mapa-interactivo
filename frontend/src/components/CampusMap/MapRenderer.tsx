// src/components/CampusMap/MapRenderer.tsx
import React from 'react';
import type { Viewport, Building } from './types';
import BuildingComponent from './Building';

interface MapRendererProps {
  viewport: Viewport;
  isDragging: boolean;
  searchTerm: string;                // (no se usa, pero lo dejo por si luego quieres tooltips, etc.)
  selectedCategory: string;          // idem
  showEvents: boolean;
  selectedBuildingId: string | null;
  onBuildingClick: (building: Building) => void;
  onBuildingKeyDown: (e: React.KeyboardEvent, building: Building) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  buildings: Building[];            // 👈 edificios que ya vienen filtrados desde CampusMap
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
  onTouchStart,
  buildings,                          // 👈 se nos había olvidado destructurarlo
}) => {
  return (
    <div
      className="relative bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden border-2 border-white map-container"
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
          transition: isDragging ? 'none' : 'transform 0.2s ease',
        }}
      >
        {/* Definiciones para patrones y gradientes */}
        <defs>
          <pattern
            id="boundaryGrid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>

          <linearGradient id="boundaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Límite visual del mapa */}
        <g>
          <rect x="0" y="0" width="900" height="540" fill="url(#boundaryGrid)" />
          <rect
            x="0"
            y="0"
            width="900"
            height="540"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <g opacity="0.4">
            <path d="M0,0 L30,0 M0,0 L0,30" stroke="#3b82f6" strokeWidth="3" />
            <path d="M900,0 L870,0 M900,0 L900,30" stroke="#3b82f6" strokeWidth="3" />
            <path d="M0,540 L30,540 M0,540 L0,510" stroke="#3b82f6" strokeWidth="3" />
            <path d="M900,540 L870,540 M900,540 L900,510" stroke="#3b82f6" strokeWidth="3" />
          </g>
        </g>

        {/* Caminos */}
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
          {buildings.map((building) => (
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

        {/* Indicador zoom-out extremo */}
        {viewport.scale < 0.7 && (
          <g>
            <rect
              x="0"
              y="0"
              width="900"
              height="540"
              fill="rgba(239, 68, 68, 0.05)"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <text
              x="450"
              y="270"
              textAnchor="middle"
              fontSize="20"
              fill="#ef4444"
              fontWeight="bold"
              opacity="0.8"
              style={{ userSelect: 'none' }}
            >
              🔍 Acerca para ver detalles
            </text>
          </g>
        )}

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

        {/* Indicador de zoom */}
        <g transform="translate(820, 20)" opacity="0.7">
          <rect
            x="0"
            y="0"
            width="60"
            height="30"
            rx="6"
            fill="rgba(255, 255, 255, 0.9)"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <text
            x="30"
            y="18"
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="bold"
          >
            {Math.round(viewport.scale * 100)}%
          </text>
        </g>
      </svg>

      {/* Overlay de ayuda de límites */}
      {viewport.scale > 1.5 && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-sm text-gray-700">
            <strong>💡 El mapa tiene límites</strong>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            El borde azul marca el área útil del campus.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapRenderer;

