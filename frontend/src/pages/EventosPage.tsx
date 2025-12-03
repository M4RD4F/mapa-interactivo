// frontend/src/pages/EventosPage.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import type { Actividad } from '../utils/types';
import { obtenerActividades } from '../utils/api';

const EventosPage: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<'todas' | 'académica' | 'deportiva' | 'cultural' | 'servicio'>('todas');

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerActividades();
        setActividades(data);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar las actividades');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const actividadesFiltradas = actividades.filter(act => {
    const coincideBusqueda =
      busqueda.trim() === '' ||
      act.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (act.descripcion ?? '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (act.nombre_edificio ?? '').toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === 'todas' || (act.categoria ?? '').toLowerCase() === categoria;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Actividades con créditos
            </h1>
            <p className="text-slate-600">
              Consulta las actividades disponibles en el campus. Pregunta a tu profesor cómo obtener tus créditos.
            </p>
          </div>
        </header>

        {/* Filtros */}
        <section className="bg-white rounded-2xl shadow-xl p-4 md:p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por título, descripción o edificio…"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoria}
                onChange={e => setCategoria(e.target.value as any)}
              >
                <option value="todas">Todas</option>
                <option value="académica">Académica</option>
                <option value="deportiva">Deportiva</option>
                <option value="cultural">Cultural</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </section>

        {/* Lista de actividades */}
        <section className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          {cargando && actividades.length === 0 && (
            <p className="text-sm text-slate-500">Cargando actividades…</p>
          )}

          {!cargando && actividadesFiltradas.length === 0 && (
            <p className="text-sm text-slate-500">
              No hay actividades que coincidan con los filtros.
            </p>
          )}

          {actividadesFiltradas.length > 0 && (
            <div className="space-y-3">
              {actividadesFiltradas.map(act => (
                <div
                  key={act.id_actividad}
                  className="border border-slate-200 rounded-lg p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900">
                      {act.titulo}{' '}
                      <span className="text-xs text-blue-600">
                        ({act.creditos} crédito{act.creditos !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {act.descripcion}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {act.nombre_edificio || 'Edificio por confirmar'}
                        {act.lugar ? ` • ${act.lugar}` : ''}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(act.fecha_inicio).toLocaleString()}
                        {act.fecha_fin && ` — ${new Date(act.fecha_fin).toLocaleString()}`}
                      </span>
                      {act.categoria && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {act.categoria}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 md:text-right">
                    <div>Cupo máx: {act.cupo_maximo ?? 'N/A'}</div>
                    {act.nombre_docente && (
                      <div>Docente: {act.nombre_docente}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventosPage;
