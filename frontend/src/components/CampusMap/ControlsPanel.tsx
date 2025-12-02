import React from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Calendar } from 'lucide-react';
import { CATEGORIES } from './constants';

interface ControlsPanelProps {
  searchTerm: string;
  selectedCategory: string;
  showEvents: boolean;
  filteredCount: number;
  totalCount: number;
  zoomLevel: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onToggleEvents: (checked: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  searchTerm,
  selectedCategory,
  showEvents,
  filteredCount,
  totalCount,
  zoomLevel,
  onSearchChange,
  onCategoryChange,
  onToggleEvents,
  onZoomIn,
  onZoomOut,
  onResetView
}) => {
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar edificios..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : undefined
            }}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Controles de zoom */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <button
            onClick={onResetView}
            className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            title="Reiniciar vista"
          >
            <Maximize2 size={20} />
          </button>
          <div className="flex items-center bg-white rounded-lg shadow">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-gray-50 rounded-l-lg"
              title="Alejar"
            >
              <ZoomOut size={20} />
            </button>
            <span className="px-3 text-sm font-medium">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-gray-50 rounded-r-lg"
              title="Acercar"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>

        {/* Toggle eventos y contador */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={(e) => onToggleEvents(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <Calendar size={16} />
              Mostrar eventos
            </span>
          </label>
          <div className="text-sm text-gray-500">
            {filteredCount} de {totalCount} edificios
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
