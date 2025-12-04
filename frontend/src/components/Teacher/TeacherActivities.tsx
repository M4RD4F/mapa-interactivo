import React, { useEffect, useState } from 'react';
import { Calendar, PlusCircle, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import type { Actividad, EdificioApi } from '../../utils/types';
import {
  obtenerActividadesPorDocente,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  type NuevaActividadPayload,
  obtenerEdificiosMapa,
} from '../../utils/api';

interface TeacherActivitiesProps {
  docenteId: number;
}

const TeacherActivities: React.FC<TeacherActivitiesProps> = ({ docenteId }) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [edificios, setEdificios] = useState<EdificioApi[]>([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // para modo edición
  const [actividadEditando, setActividadEditando] = useState<Actividad | null>(null);

  // Formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [creditos, setCreditos] = useState('1');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [lugar, setLugar] = useState('');
  const [categoria, setCategoria] = useState('académica');
  const [cupoMaximo, setCupoMaximo] = useState('');
  const [idEdificioSeleccionado, setIdEdificioSeleccionado] = useState<string>('');

  const limpiarForm = () => {
    setTitulo('');
    setDescripcion('');
    setCreditos('1');
    setFechaInicio('');
    setFechaFin('');
    setLugar('');
    setCategoria('académica');
    setCupoMaximo('');
    setIdEdificioSeleccionado('');
    setActividadEditando(null);
  };

  const mostrarMensajeExito = (texto: string) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const cargarActividades = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerActividadesPorDocente(docenteId);
      setActividades(data);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las actividades del docente');
    } finally {
      setCargando(false);
    }
  };

  const cargarEdificios = async () => {
    try {
      const data = await obtenerEdificiosMapa();
      setEdificios(data);
    } catch (e) {
      console.error('Error al cargar edificios para el docente', e);
    }
  };

  useEffect(() => {
    cargarActividades();
    cargarEdificios();
  }, [docenteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEdificioSeleccionado) {
      alert('Selecciona un edificio');
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const payload: NuevaActividadPayload = {
        titulo,
        descripcion,
        creditos: Number(creditos),
        fecha_inicio: fechaInicio || new Date().toISOString(),
        fecha_fin: fechaFin || null,
        lugar,
        categoria,
        cupo_maximo: cupoMaximo ? Number(cupoMaximo) : null,
        id_edificio: Number(idEdificioSeleccionado),
        id_docente: docenteId,
      };

      if (actividadEditando) {
        // 🔁 ACTUALIZAR
        await actualizarActividad(actividadEditando.id_actividad, payload);
        mostrarMensajeExito('Actividad actualizada correctamente.');
      } else {
        // ➕ CREAR
        await crearActividad(payload);
        mostrarMensajeExito('Actividad guardada correctamente.');
      }

      limpiarForm();
      await cargarActividades();
    } catch (e) {
      console.error(e);
      setError('No se pudo guardar la actividad');
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (act: Actividad) => {
    setActividadEditando(act);
    setTitulo(act.titulo);
    setDescripcion(act.descripcion);
    setCreditos(String(act.creditos));
    setLugar(act.lugar || '');
    setCategoria(act.categoria || 'académica');
    setCupoMaximo(act.cupo_maximo ? String(act.cupo_maximo) : '');
    setFechaInicio(act.fecha_inicio ? act.fecha_inicio.slice(0, 16) : '');
    setFechaFin(act.fecha_fin ? act.fecha_fin.slice(0, 16) : '');
    // asegúrate de que tu SELECT de actividades incluya a.id_edificio
    // @ts-ignore
    setIdEdificioSeleccionado(act.id_edificio ? String(act.id_edificio) : '');
  };

  const handleEliminar = async (act: Actividad) => {
    const ok = window.confirm(`¿Seguro que deseas eliminar "${act.titulo}"?`);
    if (!ok) return;

    try {
      setCargando(true);
      setError(null);
      await eliminarActividad(act.id_actividad);
      mostrarMensajeExito('Actividad eliminada correctamente.');
      await cargarActividades();
    } catch (e) {
      console.error(e);
      setError('No se pudo eliminar la actividad');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Panel del Docente
            </h1>
            <p className="text-slate-600">
              Crea y gestiona actividades que otorgan créditos escolares.
            </p>
          </div>
        </header>

        {/* Mensajes globales */}
        {mensajeExito && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm">
            <CheckCircle2 size={18} />
            <span>{mensajeExito}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <PlusCircle className="text-blue-600" />
              {actividadEditando ? 'Editar actividad' : 'Nueva actividad'}
            </h2>
            {actividadEditando && (
              <button
                type="button"
                onClick={limpiarForm}
                className="text-xs text-slate-500 underline"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Título de la actividad *
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Edificio *
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={idEdificioSeleccionado}
                  onChange={e => setIdEdificioSeleccionado(e.target.value)}
                  required
                >
                  <option value="">Selecciona un edificio…</option>
                  {edificios.map(e => (
                    <option key={e.id_edificio} value={e.id_edificio}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Descripción *
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Créditos *
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={creditos}
                  onChange={e => setCreditos(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Cupo máximo
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={cupoMaximo}
                  onChange={e => setCupoMaximo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Categoría
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                >
                  <option value="académica">Académica</option>
                  <option value="deportiva">Deportiva</option>
                  <option value="cultural">Cultural</option>
                  <option value="servicio">Servicio</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Fecha y hora de inicio
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Fecha y hora de fin
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Lugar (ej. “Lab 3”, “Cancha principal”)
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                value={lugar}
                onChange={e => setLugar(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={cargando}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {cargando
                  ? 'Guardando…'
                  : actividadEditando
                  ? 'Actualizar actividad'
                  : 'Guardar actividad'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista de actividades del docente */}
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Mis actividades
          </h2>

          {cargando && actividades.length === 0 && (
            <p className="text-sm text-slate-500">Cargando actividades…</p>
          )}

          {!cargando && actividades.length === 0 && (
            <p className="text-sm text-slate-500">
              Aún no tienes actividades registradas.
            </p>
          )}

          {actividades.length > 0 && (
            <div className="space-y-3">
              {actividades.map(act => (
                <div
                  key={act.id_actividad}
                  className="border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {act.titulo}{' '}
                      <span className="text-xs text-blue-600">
                        ({act.creditos} crédito{act.creditos !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {act.nombre_edificio && `${act.nombre_edificio} • `}{act.lugar}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {new Date(act.fecha_inicio).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Cupo: {act.cupo_maximo ?? 'N/A'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEditar(act)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminar(act)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
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

export default TeacherActivities;


