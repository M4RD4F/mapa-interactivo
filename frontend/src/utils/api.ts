// frontend/src/utils/api.ts
import type { Actividad, EdificioApi } from './types';  // 👈 OJO: import type
import type { Building } from '../components/CampusMap/types';
import { BUILDING_LAYOUT } from './buildingsLayout';

const API_URL = 'http://localhost:3000/api';

export async function obtenerActividades(): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/actividades`);
  if (!res.ok) throw new Error('Error al cargar actividades');
  return res.json();
}

export async function obtenerActividadesPorEdificio(idEdificio: number): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/actividades/edificio/${idEdificio}`);
  if (!res.ok) throw new Error('Error al cargar actividades del edificio');
  return res.json();
}

// 👉 NUEVO: actividades de un docente
export async function obtenerActividadesPorDocente(idDocente: number): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/actividades/docente/${idDocente}`);
  if (!res.ok) throw new Error('Error al cargar actividades del docente');
  return res.json();
}

// 👉 NUEVO: crear actividad
export interface NuevaActividadPayload {
  titulo: string;
  descripcion: string;
  creditos: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  lugar: string;
  categoria: string;
  cupo_maximo: number | null;
  id_edificio: number;
  id_docente: number;
}

export async function crearActividad(payload: NuevaActividadPayload): Promise<Actividad> {
  const res = await fetch(`${API_URL}/actividades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Error al crear actividad:', text);
    throw new Error('Error al crear actividad');
  }

  return res.json();
}

export interface LoginDocenteResponse {
  id_docente: number;
  nombre: string;
}

export async function loginDocente(
  email: string,
  password: string
): Promise<LoginDocenteResponse> {
  const res = await fetch(`${API_URL}/auth/login-docente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Credenciales inválidas');
  }

  return res.json();
}

export async function obtenerEdificiosMapa(): Promise<EdificioApi[]> {
  const res = await fetch(`${API_URL}/edificios`);
  if (!res.ok) {
    throw new Error('Error al cargar edificios');
  }
  return res.json();
}