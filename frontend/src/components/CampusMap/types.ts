// src/components/CampusMap/types.ts

export type Building = {
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
  category?: string;

  // 👇 ESTE campo enlaza con la tabla `edificios.id_edificio`
  idEdificioDb?: number;
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
