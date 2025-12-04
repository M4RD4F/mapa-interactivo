// frontend/src/utils/buildingsLayout.ts
type LayoutConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

// Ajusta los IDs a los de tu tabla `edificios` (1, 2, 3, etc.)
export const BUILDING_LAYOUT: Record<number, LayoutConfig> = {
  1: { x: 60,  y: 60,  width: 220, height: 120, fill: '#3b82f6' }, // Biblioteca
  2: { x: 320, y: 60,  width: 180, height: 110, fill: '#ef4444' }, // Comedor
  3: { x: 520, y: 60,  width: 230, height: 120, fill: '#10b981' }, // Centro de Cómputo
  4: { x: 60,  y: 220, width: 240, height: 120, fill: '#8b5cf6' }, // Edificio A
  5: { x: 340, y: 220, width: 240, height: 120, fill: '#7c3aed' }, // Edificio B
  6: { x: 640, y: 220, width: 220, height: 120, fill: '#6d28d9' }, // Edificio C
  7: { x: 20,  y: 370, width: 200, height: 140, fill: '#64748b' }, // Estacionamiento
  8: { x: 260, y: 370, width: 480, height: 140, fill: '#f59e0b' }, // Complejo deportivo
};
