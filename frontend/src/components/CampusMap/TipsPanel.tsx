import React from 'react';
import { Info, Navigation, Calendar, Search, Keyboard } from 'lucide-react';
import { CATEGORIES } from './constants';

const TipsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
          <Info className="text-blue-600" size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Consejos de Uso</h2>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Navigation size={16} />
            Navegación
          </h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Clic izquierdo</strong> en edificio para detalles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Arrastra</strong> el mapa para moverte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Rueda del mouse</strong> para zoom in/out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Ctrl/⌘ + scroll</strong> para zoom rápido</span>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Calendar size={16} />
            Eventos
          </h3>
          <ul className="text-sm text-green-700 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Edificios con <span className="inline-block w-3 h-3 rounded-full bg-red-500 align-middle"></span> tienen eventos próximos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Haz clic para ver horarios y ubicaciones</span>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Search size={16} />
            Búsqueda
          </h3>
          <ul className="text-sm text-purple-700 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Usa el buscador superior para filtrar edificios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Filtra por categorías: Académico, Servicios, Deportes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Los resultados se actualizan en tiempo real</span>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Keyboard size={16} />
            Atajos de Teclado
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded p-2 text-center">
              <kbd className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">ESC</kbd>
              <div className="text-xs text-gray-600 mt-1">Cerrar panel</div>
            </div>
            <div className="bg-white rounded p-2 text-center">
              <kbd className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">+/-</kbd>
              <div className="text-xs text-gray-600 mt-1">Zoom</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda simplificada */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Simbología</h3>
        <div className="space-y-3">
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <div key={cat.id} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-gray-700">{cat.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-gray-700">Evento próximo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-gray-700">Ocupación baja</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPanel;