// src/components/CampusMap/constants.ts
import type { Category, Viewport } from './types'; 

export const CATEGORIES: Category[] = [
  { id: "all", label: "Todos", color: "#6b7280", icon: "Grid" },
  { id: "academic", label: "Académico", color: "#3b82f6", icon: "BookOpen" },
  { id: "services", label: "Servicios", color: "#ef4444", icon: "Coffee" },
  { id: "sports", label: "Deportes", color: "#f59e0b", icon: "Dumbbell" },
  { id: "parking", label: "Estacionamiento", color: "#64748b", icon: "ParkingCircle" }
];

export const INITIAL_VIEWPORT: Viewport = { x: 0, y: 0, scale: 1 };
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.2;
export const TOUCH_TARGET_SIZE = 44;

