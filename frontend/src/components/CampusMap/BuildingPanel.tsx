// src/components/CampusMap/BuildingPanel.tsx
import React, { useEffect, useState } from 'react';
import { Navigation, Calendar, Info, X } from 'lucide-react';
import type { Building } from './types';
import type { Actividad } from '../../utils/types';
import { obtenerActividadesPorEdificio } from '../../utils/api';

interface BuildingPanelProps {
  building: Building | null;
  onClose: () => void;
  onNavigate: (buildingName: string) => void;
}

const BuildingPanel: React.FC<BuildingPanelProps> = ({
  building,
  onClose,
  onNavigate
}) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargandoActividades, setCargandoActividades] = useState(false);
  const [errorActividades, setErrorActividades] = useState<string | null>(null);

  // Cargar actividades del backend cuando cambia el edificio seleccionado
  useEffect(() => {
    if (!building || !building.idEdificioDb) {
      setActividades([]);
      setErrorActividades(null);
      return;
    }

    const cargar = async () => {
      try {
        setCargandoActividades(true);
        setErrorActividades(null);
        const data = await obtenerActividadesPorEdificio(building.idEdificioDb!);
        setActividades(data);
      } catch (err) {
        console.error(err);
        setErrorActividades('No se pudieron cargar las actividades de este edificio');
      } finally {
        setCargandoActividades(false);
      }
    };

    cargar();
  }, [building?.idEdificioDb]);

  if (!building) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
          <Navigation size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Selecciona un edificio
        </h3>
        <p className="text-gray-600 mb-6">
          Haz clic en cualquier edificio del mapa para ver información detallada, actividades con créditos y servicios disponibles.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>📍 <strong>Edificios con eventos</strong> tienen un círculo rojo</p>
          <p>📊 <strong>El porcentaje</strong> indica ocupación actual</p>
          <p>🎯 <strong>Usa la búsqueda</strong> para filtrar por categoría</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onClose}
        className="self-end text-gray-400 hover:text-gray-600 mb-4"
        aria-label="Cerrar detalles"
      >
        <X size={24} />
      </button>
      
      <div className="flex-1">
        <div
          className="w-full h-32 rounded-xl mb-4"
          style={{ backgroundColor: building.fill }}
        />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {building.name}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {building.description}
        </p>
        
        {/* Información de ocupación */}
        {building.occupancy !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Ocupación actual</span>
              <span className={`text-sm font-bold ${
                building.occupancy > 80 ? 'text-red-600' : 'text-green-600'
              }`}>
                {building.occupancy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  building.occupancy > 80 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${building.occupancy}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Instalaciones */}
        {building.facilities && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Info size={16} />
              Instalaciones disponibles
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔹 Actividades con créditos (desde la BD) */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Actividades con créditos en este edificio
          </h3>

          {cargandoActividades && (
            <p className="text-sm text-gray-500">Cargando actividades…</p>
          )}

          {errorActividades && (
            <p className="text-sm text-red-600">{errorActividades}</p>
          )}

          {!cargandoActividades && !errorActividades && actividades.length === 0 && building.idEdificioDb && (
            <p className="text-sm text-gray-500">
              No hay actividades registradas por ahora en este edificio.
            </p>
          )}

          {!cargandoActividades && actividades.length > 0 && (
            <div className="space-y-3">
              {actividades.map((act) => (
                <div
                  key={act.id_actividad}
                  className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm"
                >
                  <div className="font-medium text-emerald-800">
                    {act.titulo}
                  </div>
                  <div className="text-emerald-700 mt-1">
                    Créditos: <strong>{act.creditos}</strong>
                  </div>
                  <div className="text-emerald-700">
                    {new Date(act.fecha_inicio).toLocaleString()}
                  </div>
                  {act.lugar && (
                    <div className="text-emerald-700">
                      📍 {act.lugar}
                    </div>
                  )}
                  {act.nombre_docente && (
                    <div className="text-emerald-700">
                      👨‍🏫 {act.nombre_docente}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Eventos “de diseño” que ya tenías (puedes dejarlos como complemento) */}
        {building.hasUpcomingEvent && building.events && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Otros eventos del edificio
            </h3>
            <div className="space-y-3">
              {building.events.map((event, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg"
                >
                  <div className="font-medium text-red-800">{event.title}</div>
                  <div className="text-sm text-red-600 mt-1">
                    🕒 {event.time} 📍 {event.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Acciones */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate(building.name)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation size={18} />
            Cómo llegar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingPanel;

