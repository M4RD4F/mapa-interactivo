// src/components/CampusMap/types.ts
// Asegúrate de que tenga ESTA estructura exacta:

export type Building = {    // <-- export ES OBLIGATORIO
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