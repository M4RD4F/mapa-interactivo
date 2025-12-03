// src/components/CampusMap/types.ts

export type Building = {
  // ID lógico del mapa (ej. 'library', 'lab-a')
  id: string;

  // ID en la base de datos (tabla `edificios.id_edificio`)
  // Será opcional por si algún edificio aún no existe en la BD
  idEdificioDb?: number;

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
  category?: string;
};

export type Viewport = {
  x: number;
  y: number;
  scale: number;
};

export type Category = {
  id: string;
  label: string;
  color: string;
  icon?: string;
};
