import React, { useState, useCallback, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import MapRenderer from './MapRenderer'; 
import ControlsPanel from './ControlsPanel';
import BuildingPanel from './BuildingPanel';
import TipsPanel from './TipsPanel';
import { BUILDINGS, INITIAL_VIEWPORT } from './constants';
import { useMapNavigation } from '../../hooks/useMapNavigation';
import { useBuildingSelection } from '../../hooks/useBuildingSelection';
import { getFilteredBuildings, getBuildingStatistics } from '../../utils/mapCalculations';
import './styles.css';

const CampusMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEvents, setShowEvents] = useState(true);

  const {
    viewport,
    isDragging,
    handleZoom,
    resetViewport,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleMouseUp
  } = useMapNavigation(INITIAL_VIEWPORT);

  const {
    selectedBuilding,
    selectBuilding,
    deselectBuilding,
    lastFocusedRef
  } = useBuildingSelection();

  const filteredBuildings = getFilteredBuildings(BUILDINGS, searchTerm, selectedCategory);
  const statistics = getBuildingStatistics(BUILDINGS);

  const handleBuildingClick = useCallback((building: any) => {
    selectBuilding(building);
  }, [selectBuilding]);

  const handleBuildingKeyDown = useCallback((e: React.KeyboardEvent, building: any) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectBuilding(building, e.currentTarget as HTMLElement);
    }
  }, [selectBuilding]);

  const handleNavigate = useCallback((buildingName: string) => {
    alert(`Navegando a ${buildingName}`);
  }, []);

  // Eventos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedBuilding) {
        e.preventDefault();
        deselectBuilding();
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoom(0.2);
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoom(-0.2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBuilding, deselectBuilding, handleZoom]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MapPin className="text-blue-600" size={32} />
            Mapa Interactivo del Campus
          </h1>
          <p className="text-gray-600">
            Explora las instalaciones del campus. Haz clic/toca en cualquier edificio para más información.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel izquierdo - Consejos */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <TipsPanel />
            </div>
          </div>

          {/* Panel central - Mapa y controles */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
              <ControlsPanel
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                showEvents={showEvents}
                filteredCount={filteredBuildings.length}
                totalCount={BUILDINGS.length}
                zoomLevel={viewport.scale}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onToggleEvents={setShowEvents}
                onZoomIn={() => handleZoom(0.2)}
                onZoomOut={() => handleZoom(-0.2)}
                onResetView={resetViewport}
              />
            </div>

            <MapRenderer
              viewport={viewport}
              isDragging={isDragging}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              showEvents={showEvents}
              selectedBuildingId={selectedBuilding?.id || null}
              onBuildingClick={handleBuildingClick}
              onBuildingKeyDown={handleBuildingKeyDown}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart} // ¡CORREGIDO!
            />
          </div>

          {/* Panel derecho - Información del edificio */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <BuildingPanel
                building={selectedBuilding}
                onClose={deselectBuilding}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>

        {/* Footer con estadísticas */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{statistics.totalBuildings}</div>
              <div className="text-sm text-gray-600">Edificios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {statistics.buildingsWithEvents}
              </div>
              <div className="text-sm text-gray-600">Con eventos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {statistics.averageOccupancy}%
              </div>
              <div className="text-sm text-gray-600">Ocupación promedio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Biblioteca disponible</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CampusMap;