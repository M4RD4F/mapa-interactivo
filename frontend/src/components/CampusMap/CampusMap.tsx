// src/components/CampusMap/CampusMap.tsx
// frontend/src/components/CampusMap/CampusMap.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import MapRenderer from './MapRenderer';
import ControlsPanel from './ControlsPanel';
import BuildingPanel from './BuildingPanel';
import TipsPanel from './TipsPanel';
import { INITIAL_VIEWPORT } from './constants';
import { useMapNavigation } from '../../hooks/useMapNavigation';
import { useBuildingSelection } from '../../hooks/useBuildingSelection';
import { getFilteredBuildings, getBuildingStatistics } from '../../utils/mapCalculations';
import { obtenerEdificiosMapa } from '../../utils/api';
import type { Building } from './types';
import type { EdificioApi } from '../../utils/types';
import './styles.css';

const mapCategoriaFrontend = (cat: EdificioApi['categoria']): string => {
  switch (cat) {
    case 'academico':
      return 'academic';
    case 'servicios':
      return 'services';
    case 'deportivo':
      return 'sports';
    case 'estacionamiento':
      return 'parking';
    default:
      return 'other';
  }
};

const colorPorCategoria = (cat: EdificioApi['categoria']): string => {
  switch (cat) {
    case 'academico':
      return '#3b82f6';
    case 'servicios':
      return '#ef4444';
    case 'deportivo':
      return '#f59e0b';
    case 'estacionamiento':
      return '#64748b';
    default:
      return '#6b7280';
  }
};

const CampusMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEvents, setShowEvents] = useState(true);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [errorBuildings, setErrorBuildings] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    viewport,
    setViewport,
    isDragging,
    handleZoom,
    resetViewport,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleMouseUp,
  } = useMapNavigation(INITIAL_VIEWPORT);

  const {
    selectedBuilding,
    selectBuilding,
    deselectBuilding,
  } = useBuildingSelection();

  // 🔹 Cargar edificios desde la BD
  useEffect(() => {
    const cargarEdificios = async () => {
      try {
        setLoadingBuildings(true);
        setErrorBuildings(null);

        const data = await obtenerEdificiosMapa();

        const mapeados: Building[] = data
          .filter((e) => e.pos_x !== null && e.pos_y !== null)
          .map((e) => ({
            id: String(e.id_edificio),
            name: e.nombre,
            x: e.pos_x ?? 0,
            y: e.pos_y ?? 0,
            width: 220,
            height: 120,
            fill: colorPorCategoria(e.categoria),
            description: e.descripcion ?? '',
            category: mapCategoriaFrontend(e.categoria),
            hasUpcomingEvent: false,
            occupancy: undefined,
            facilities: [],
          }));

        setBuildings(mapeados);
      } catch (err) {
        console.error(err);
        setErrorBuildings('Error al cargar los edificios del campus');
      } finally {
        setLoadingBuildings(false);
      }
    };

    cargarEdificios();
  }, []);

  const filteredBuildings = getFilteredBuildings(buildings, searchTerm, selectedCategory);
  const statistics = getBuildingStatistics(buildings);

  // Zoom a un edificio
  const zoomToBuilding = useCallback(
    (building: Building) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const targetArea = {
        left: Math.max(0, building.x - 80),
        top: Math.max(0, building.y - 80),
        right: Math.min(900, building.x + building.width + 80),
        bottom: Math.min(540, building.y + building.height + 80),
      };

      const targetWidth = targetArea.right - targetArea.left;
      const targetHeight = targetArea.bottom - targetArea.top;

      const scaleX = (containerWidth * 0.7) / targetWidth;
      const scaleY = (containerHeight * 0.7) / targetHeight;

      let targetScale = Math.min(scaleX, scaleY);
      targetScale = Math.max(1, Math.min(2.5, targetScale));

      const centerX = (targetArea.left + targetArea.right) / 2;
      const centerY = (targetArea.top + targetArea.bottom) / 2;

      let newX = containerWidth / 2 - centerX * targetScale;
      let newY = containerHeight / 2 - centerY * targetScale;

      const mapWidth = 900;
      const mapHeight = 540;

      if (targetScale > 1) {
        const maxOffsetX = mapWidth * targetScale - containerWidth;
        const maxOffsetY = mapHeight * targetScale - containerHeight;

        newX = Math.max(-maxOffsetX, Math.min(0, newX));
        newY = Math.max(-maxOffsetY, Math.min(0, newY));
      } else {
        newX = (containerWidth - mapWidth * targetScale) / 2;
        newY = (containerHeight - mapHeight * targetScale) / 2;
      }

      setViewport({
        x: newX,
        y: newY,
        scale: targetScale,
      });
    },
    [setViewport]
  );

  const handleBuildingClick = useCallback(
    (building: Building) => {
      selectBuilding(building);
      zoomToBuilding(building);
    },
    [selectBuilding, zoomToBuilding]
  );

  const handleBuildingKeyDown = useCallback(
    (e: React.KeyboardEvent, building: Building) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectBuilding(building, e.currentTarget as HTMLElement);
        zoomToBuilding(building);
      }
    },
    [selectBuilding, zoomToBuilding]
  );

  const handleNavigate = useCallback((buildingName: string) => {
    alert(`Navegando a ${buildingName}`);
  }, []);

  useEffect(() => {
    if (!selectedBuilding) {
      resetViewport();
    }
  }, [selectedBuilding, resetViewport]);

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
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MapPin className="text-blue-600" size={32} />
            Mapa interactivo del Tecnológico
          </h1>
          <p className="text-gray-600">
            Explora las instalaciones del campus. Haz clic/toca en cualquier edificio para más información.
          </p>
          {errorBuildings && (
            <p className="mt-2 text-sm text-red-600">
              {errorBuildings}
            </p>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <TipsPanel />
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
              <ControlsPanel
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                showEvents={showEvents}
                filteredCount={filteredBuildings.length}
                totalCount={buildings.length}
                zoomLevel={viewport.scale}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onToggleEvents={setShowEvents}
                onZoomIn={() => handleZoom(0.2)}
                onZoomOut={() => handleZoom(-0.2)}
                onResetView={resetViewport}
              />
            </div>

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
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
                onTouchStart={handleTouchStart}
                buildings={filteredBuildings}
              />
            </div>
          </div>

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

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {statistics.totalBuildings}
              </div>
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


