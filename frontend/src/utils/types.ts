// src/utils/types.ts

// Tipo que representa una actividad que viene del backend
export interface Actividad {
  id_actividad: number;
  titulo: string;
  descripcion: string;
  creditos: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  lugar: string | null;
  categoria: string | null;
  cupo_maximo: number | null;

  // Campos “extra” cuando hacemos joins
  id_edificio?: number;
  nombre_edificio?: string;
  id_docente?: number;
  nombre_docente?: string;
}

export type EdificioApi = {
  id_edificio: number;
  nombre: string;
  descripcion: string | null;
  categoria: 'academico' | 'servicios' | 'deportivo' | 'estacionamiento' | 'otro';
  pos_x: number | null;
  pos_y: number | null;
};