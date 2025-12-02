import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Search, ZoomIn, ZoomOut, Maximize2, Navigation, Calendar, Info, MapPin } from "lucide-react";

type Building = {
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
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

// Definición mejorada de edificios
const BUILDINGS: Building[] = [
  {
    id: "library",
    name: "Biblioteca Central",
    x: 60,
    y: 60,
    width: 220,
    height: 120,
    fill: "#3b82f6",
    description: "Biblioteca principal con 3 pisos, salas de estudio grupales e individuales, área de cómputo y cafetería interna.",
    hasUpcomingEvent: true,
    events: [
      { title: "Taller de Investigación", time: "15:00", location: "Sala A" },
      { title: "Club de Lectura", time: "17:00", location: "Sala B" }
    ],
    occupancy: 75,
    facilities: ["Wifi", "Impresión", "Préstamo", "Estudio 24/7"]
  },
  {
    id: "cafeteria",
    name: "Comedor Principal",
    x: 320,
    y: 60,
    width: 180,
    height: 110,
    fill: "#ef4444",
    description: "Cafetería con 5 puestos de comida, área de food trucks y terraza exterior.",
    occupancy: 40,
    facilities: ["Comida rápida", "Vegetariano", "Terraza", "Wifi"]
  },
  {
    id: "computers",
    name: "Centro de Cómputo",
    x: 520,
    y: 60,
    width: 230,
    height: 120,
    fill: "#10b981",
    description: "Laboratorios de cómputo con equipos de última generación, salas de electrónica y robótica.",
    hasUpcomingEvent: false,
    occupancy: 60,
    facilities: ["PC Gaming", "Impresión 3D", "Servidores", "Redes"]
  },
  {
    id: "aulas-a",
    name: "Edificio A",
    x: 60,
    y: 220,
    width: 240,
    height: 120,
    fill: "#8b5cf6",
    description: "Bloque de aulas para ciencias básicas y laboratorios de química/física.",
    facilities: ["Laboratorios", "Aulas inteligentes", "Auditorio"]
  },
  {
    id: "aulas-b",
    name: "Edificio B",
    x: 340,
    y: 220,
    width: 240,
    height: 120,
    fill: "#7c3aed",
    description: "Bloque de humanidades con auditorios, salas de seminario y mediateca.",
    hasUpcomingEvent: true,
    events: [{ title: "Conferencia Internacional", time: "10:00", location: "Auditorio Principal" }],
    facilities: ["Auditorios", "Mediateca", "Salas de videoconferencia"]
  },
  {
    id: "aulas-c",
    name: "Edificio C",
    x: 640,
    y: 220,
    width: 220,
    height: 120,
    fill: "#6d28d9",
    description: "Facultad de ciencias sociales y administración.",
    facilities: ["Aulas MBA", "Sala de juntas", "Coworking"]
  },
  {
    id: "deportes",
    name: "Complejo Deportivo",
    x: 260,
    y: 370,
    width: 480,
    height: 140,
    fill: "#f59e0b",
    description: "Canchas multiusos, gimnasio, pista de atletismo y alberca semiolímpica.",
    hasUpcomingEvent: true,
    events: [{ title: "Torneo Interuniversitario", time: "16:00", location: "Cancha Principal" }],
    facilities: ["Gimnasio", "Alberca", "Canchas", "Lockers"]
  },
  {
    id: "estacionamiento",
    name: "Estacionamiento",
    x: 20,
    y: 370,
    width: 200,
    height: 140,
    fill: "#64748b",
    description: "Estacionamiento principal con 250 cajones, área para motos y carga eléctrica.",
    occupancy: 90,
    facilities: ["Vigilancia", "Carga eléctrica", "Motos", "Discapacitados"]
  }
];

// Categorías para filtrado
const CATEGORIES = [
  { id: "all", label: "Todos", color: "#6b7280" },
  { id: "academic", label: "Académico", color: "#3b82f6" },
  { id: "services", label: "Servicios", color: "#ef4444" },
  { id: "sports", label: "Deportes", color: "#f59e0b" },
  { id: "parking", label: "Estacionamiento", color: "#64748b" }
];

export default function CampusMap() {
  // Estados principales
  const [selected, setSelected] = useState<Building | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showEvents, setShowEvents] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Referencias
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Filtrar edificios según búsqueda y categoría
  const filteredBuildings = useMemo(() => {
    return BUILDINGS.filter(building => {
      const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMap: Record<string, string[]> = {
        academic: ["library", "computers", "aulas-a", "aulas-b", "aulas-c"],
        services: ["cafeteria"],
        sports: ["deportes"],
        parking: ["estacionamiento"]
      };
      
      const matchesCategory = selectedCategory === "all" || 
                             (categoryMap[selectedCategory]?.includes(building.id) ?? false);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Control de zoom
  const handleZoom = useCallback((delta: number) => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }));
  }, []);

  // Zoom al edificio seleccionado
  const zoomToBuilding = useCallback((building: Building) => {
    if (!svgRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetX = building.x + building.width / 2;
    const targetY = building.y + building.height / 2;
    
    setViewport({
      x: containerRect.width / 2 - targetX * 1.5,
      y: containerRect.height / 2 - targetY * 1.5,
      scale: 1.5
    });
  }, []);

  // Manejo de interacciones
  const openBuilding = useCallback((building: Building, opener?: HTMLElement | null) => {
    if (opener) lastFocusedRef.current = opener;
    setSelected(building);
    zoomToBuilding(building);
  }, [zoomToBuilding]);

  const closePanel = useCallback(() => {
    setSelected(null);
    lastFocusedRef.current?.focus();
  }, []);

  // Eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) {
        e.preventDefault();
        closePanel();
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoom(0.2);
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoom(-0.2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, closePanel, handleZoom]);

  // Drag & pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setViewport({
      ...viewport,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, viewport, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch events para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - viewport.x,
        y: e.touches[0].clientY - viewport.y
      });
    }
  };

  // Renderizar edificio
  const renderBuilding = useCallback((building: Building) => {
    const isSelected = selected?.id === building.id;
    const hasEvents = building.hasUpcomingEvent && showEvents;
    
    return (
      <g
        key={building.id}
        role="button"
        tabIndex={0}
        aria-label={`${building.name}. ${building.description} ${hasEvents ? 'Tiene eventos próximos.' : ''}`}
        className="transition-all duration-200 hover:opacity-90"
        onClick={() => openBuilding(building)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openBuilding(building);
          }
        }}
      >
        {/* Sombra para efecto de profundidad */}
        <rect
          x={building.x + 3}
          y={building.y + 3}
          width={building.width}
          height={building.height}
          rx={10}
          fill="rgba(0,0,0,0.1)"
          opacity={0.3}
        />
        
        {/* Edificio principal */}
        <rect
          x={building.x}
          y={building.y}
          width={building.width}
          height={building.height}
          rx={10}
          fill={isSelected ? `${building.fill}CC` : building.fill}
          stroke={isSelected ? "#1e40af" : "#ffffff"}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-all duration-200"
        />
        
        {/* Etiqueta del edificio */}
        <text
          x={building.x + building.width / 2}
          y={building.y + building.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="select-none pointer-events-none font-semibold"
          fill="#ffffff"
          fontSize={Math.max(10, Math.min(14, building.width / 12))}
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
        >
          {building.name.split(" ").map((word, i, arr) => 
            arr.length > 2 && i === 1 ? `${word}\n` : word
          ).join(" ")}
        </text>
        
        {/* Indicador de ocupación */}
        {building.occupancy !== undefined && (
          <g transform={`translate(${building.x + 10}, ${building.y + 10})`}>
            <circle r={8} fill={building.occupancy > 80 ? "#ef4444" : "#10b981"} />
            <text
              x={0}
              y={3}
              textAnchor="middle"
              fontSize={8}
              fill="white"
              fontWeight="bold"
            >
              {building.occupancy}%
            </text>
          </g>
        )}
        
        {/* Badge de eventos */}
        {hasEvents && (
          <g transform={`translate(${building.x + building.width - 15}, ${building.y + 15})`}>
            <circle r={8} fill="#dc2626" stroke="#ffffff" strokeWidth={1.5} />
            <text
              x={0}
              y={2}
              textAnchor="middle"
              fontSize={9}
              fill="#ffffff"
              fontWeight="bold"
            >
              !
            </text>
          </g>
        )}
        
        {/* Área táctil ampliada */}
        <rect
          x={building.x - 10}
          y={building.y - 10}
          width={building.width + 20}
          height={building.height + 20}
          fill="transparent"
          style={{ cursor: "pointer" }}
        />
      </g>
    );
  }, [selected, openBuilding, showEvents]);

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
          {/* Panel lateral izquierdo - Consejos */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
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
                  <h3 className="font-semibold text-amber-800 mb-2">Atajos de Teclado</h3>
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
              <div className="mt-6 pt-6 border-t border-gray-200">
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
          </div>

          {/* Panel central del mapa */}
          <div className="lg:w-1/2">
            {/* Controles superiores */}
            <div className="flex flex-wrap gap-3 mb-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar edificios..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
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
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controles del mapa */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewport({ x: 0, y: 0, scale: 1 })}
                  className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  title="Reiniciar vista"
                >
                  <Maximize2 size={20} />
                </button>
                <div className="flex items-center bg-white rounded-lg shadow">
                  <button
                    onClick={() => handleZoom(-0.2)}
                    className="p-2 hover:bg-gray-50 rounded-l-lg"
                    title="Alejar"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <span className="px-3 text-sm font-medium">
                    {Math.round(viewport.scale * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom(0.2)}
                    className="p-2 hover:bg-gray-50 rounded-r-lg"
                    title="Acercar"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEvents}
                    onChange={(e) => setShowEvents(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Mostrar eventos</span>
                </label>
                <div className="text-sm text-gray-500">
                  {filteredBuildings.length} de {BUILDINGS.length} edificios
                </div>
              </div>
            </div>

            {/* Contenedor del mapa */}
            <div
              ref={containerRef}
              className="relative bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden border-2 border-white"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <svg
                ref={svgRef}
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
                  {/* Jardines */}
                  <rect x="50" y="20" width="800" height="40" rx="20" fill="#22c55e" opacity="0.3" />
                  <rect x="20" y="450" width="860" height="70" rx="35" fill="#22c55e" opacity="0.3" />
                  <circle cx="150" cy="100" r="30" fill="#86efac" opacity="0.4" />
                  <circle cx="750" cy="150" r="25" fill="#86efac" opacity="0.4" />
                  <circle cx="400" cy="400" r="35" fill="#86efac" opacity="0.4" />
                </g>

                {/* Edificios */}
                <g id="buildings">
                  {filteredBuildings.map(renderBuilding)}
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
          </div>

          {/* Panel lateral derecho - Información del edificio */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              {selected ? (
                <div className="h-full flex flex-col">
                  <button
                    onClick={closePanel}
                    className="self-end text-gray-400 hover:text-gray-600 mb-4"
                    aria-label="Cerrar detalles"
                  >
                    ✕
                  </button>
                  
                  <div className="flex-1">
                    <div
                      className="w-full h-32 rounded-xl mb-4"
                      style={{ backgroundColor: selected.fill }}
                    />
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {selected.name}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      {selected.description}
                    </p>
                    
                    {/* Información de ocupación */}
                    {selected.occupancy !== undefined && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Ocupación actual</span>
                          <span className={`text-sm font-bold ${
                            selected.occupancy > 80 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {selected.occupancy}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selected.occupancy > 80 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${selected.occupancy}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Instalaciones */}
                    {selected.facilities && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Info size={16} />
                          Instalaciones disponibles
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selected.facilities.map((facility, index) => (
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
                    
                    {/* Eventos próximos */}
                    {selected.hasUpcomingEvent && selected.events && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Calendar size={16} />
                          Eventos próximos
                        </h3>
                        <div className="space-y-3">
                          {selected.events.map((event, index) => (
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
                        onClick={() => alert(`Navegando a ${selected.name}`)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Navigation size={18} />
                        Cómo llegar
                      </button>
                      <button
                        onClick={closePanel}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                    <Navigation size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Selecciona un edificio
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Haz clic en cualquier edificio del mapa para ver información detallada, eventos próximos y servicios disponibles.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>📍 <strong>Edificios con eventos</strong> tienen un círculo rojo</p>
                    <p>📊 <strong>El porcentaje</strong> indica ocupación actual</p>
                    <p>🎯 <strong>Usa la búsqueda</strong> para filtrar por categoría</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer con estadísticas */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{BUILDINGS.length}</div>
              <div className="text-sm text-gray-600">Edificios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {BUILDINGS.filter(b => b.hasUpcomingEvent).length}
              </div>
              <div className="text-sm text-gray-600">Con eventos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(BUILDINGS.reduce((acc, b) => acc + (b.occupancy || 0), 0) / BUILDINGS.length)}%
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
}