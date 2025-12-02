import type { Building, Category, Viewport } from './types'; 

export const CATEGORIES: Category[] = [
  { id: "all", label: "Todos", color: "#6b7280", icon: "Grid" },
  { id: "academic", label: "Académico", color: "#3b82f6", icon: "BookOpen" },
  { id: "services", label: "Servicios", color: "#ef4444", icon: "Coffee" },
  { id: "sports", label: "Deportes", color: "#f59e0b", icon: "Dumbbell" },
  { id: "parking", label: "Estacionamiento", color: "#64748b", icon: "ParkingCircle" }
];

export const BUILDINGS: Building[] = [
  {
    id: "library",
    name: "Biblioteca Central",
    x: 60,
    y: 60,
    width: 220,
    height: 120,
    fill: "#3b82f6",
    description: "Biblioteca principal con 3 pisos, salas de estudio grupales e individuales, área de cómputo y cafetería interna.",
    category: "academic",
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
    category: "services",
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
    category: "academic",
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
    category: "academic",
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
    category: "academic",
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
    category: "academic",
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
    category: "sports",
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
    category: "parking",
    occupancy: 90,
    facilities: ["Vigilancia", "Carga eléctrica", "Motos", "Discapacitados"]
  }
];

export const INITIAL_VIEWPORT: Viewport = { x: 0, y: 0, scale: 1 };
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.2;
export const TOUCH_TARGET_SIZE = 44;