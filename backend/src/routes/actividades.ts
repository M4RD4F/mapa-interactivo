import express from 'express';
import { pool } from '../db';

const router = express.Router();

// TODAS las actividades
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id_actividad,
              a.titulo,
              a.descripcion,
              a.creditos,
              a.fecha_inicio,
              a.fecha_fin,
              a.lugar,
              a.categoria,
              a.cupo_maximo,
              e.id_edificio,
              e.nombre  AS nombre_edificio,
              u.id_usuario AS id_docente,
              u.nombre AS nombre_docente
       FROM actividades a
       LEFT JOIN edificios e ON a.id_edificio = e.id_edificio
       JOIN usuarios u ON a.id_docente = u.id_usuario
       ORDER BY a.fecha_inicio ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
});

// 🔹 Actividades por edificio (para el mapa)
router.get('/edificio/:id_edificio', async (req, res) => {
  try {
    const { id_edificio } = req.params;
    const [rows] = await pool.query(
      `SELECT a.id_actividad,
              a.titulo,
              a.descripcion,
              a.creditos,
              a.fecha_inicio,
              a.fecha_fin,
              a.lugar,
              a.categoria,
              a.cupo_maximo,
              u.nombre AS nombre_docente
       FROM actividades a
       JOIN usuarios u ON a.id_docente = u.id_usuario
       WHERE a.id_edificio = ?
       ORDER BY a.fecha_inicio ASC`,
      [id_edificio]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener actividades del edificio' });
  }
});

// 🔹 ACTIVIDADES POR DOCENTE
router.get('/docente/:id_docente', async (req, res) => {
  try {
    const { id_docente } = req.params;

    const [rows] = await pool.query(
      `SELECT a.id_actividad,
              a.titulo,
              a.descripcion,
              a.creditos,
              a.fecha_inicio,
              a.fecha_fin,
              a.lugar,
              a.categoria,
              a.cupo_maximo,
              e.id_edificio,
              e.nombre  AS nombre_edificio,
              u.id_usuario AS id_docente,
              u.nombre AS nombre_docente
       FROM actividades a
       LEFT JOIN edificios e ON a.id_edificio = e.id_edificio
       JOIN usuarios u ON a.id_docente = u.id_usuario
       WHERE a.id_docente = ?
       ORDER BY a.fecha_inicio DESC`,
      [id_docente]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener actividades del docente' });
  }
});

// 🔹 CREAR NUEVA ACTIVIDAD
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      creditos,
      fecha_inicio,
      fecha_fin,
      lugar,
      categoria,
      cupo_maximo,
      id_edificio,
      id_docente,
    } = req.body;

    if (!titulo || !descripcion || !creditos || !id_edificio || !id_docente) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO actividades 
       (titulo, descripcion, creditos, fecha_inicio, fecha_fin, lugar, categoria, cupo_maximo, id_edificio, id_docente)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion,
        creditos,
        fecha_inicio || new Date(),
        fecha_fin || null,
        lugar || null,
        categoria || null,
        cupo_maximo ?? null,
        id_edificio,
        id_docente,
      ]
    );

    const insertId = result.insertId;

    const [rows] = await pool.query<any[]>(
      `SELECT a.id_actividad,
              a.titulo,
              a.descripcion,
              a.creditos,
              a.fecha_inicio,
              a.fecha_fin,
              a.lugar,
              a.categoria,
              a.cupo_maximo,
              e.id_edificio,
              e.nombre  AS nombre_edificio,
              u.id_usuario AS id_docente,
              u.nombre AS nombre_docente
       FROM actividades a
       LEFT JOIN edificios e ON a.id_edificio = e.id_edificio
       JOIN usuarios u ON a.id_docente = u.id_usuario
       WHERE a.id_actividad = ?`,
      [insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
});

// 👉 ACTUALIZAR ACTIVIDAD
router.put('/:id_actividad', async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const {
      titulo,
      descripcion,
      creditos,
      fecha_inicio,
      fecha_fin,
      lugar,
      categoria,
      cupo_maximo,
      id_edificio,
      id_docente,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE actividades
      SET
        titulo = ?,
        descripcion = ?,
        creditos = ?,
        fecha_inicio = ?,
        fecha_fin = ?,
        lugar = ?,
        categoria = ?,
        cupo_maximo = ?,
        id_edificio = ?,
        id_docente = ?
      WHERE id_actividad = ?
      `,
      [
        titulo,
        descripcion,
        creditos,
        fecha_inicio,
        fecha_fin,
        lugar,
        categoria,
        cupo_maximo,
        id_edificio,
        id_docente,
        id_actividad,
      ]
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({ ok: true, mensaje: 'Actividad actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la actividad' });
  }
});

// 👉 ELIMINAR ACTIVIDAD
router.delete('/:id_actividad', async (req, res) => {
  try {
    const { id_actividad } = req.params;

    const [result] = await pool.query(
      'DELETE FROM actividades WHERE id_actividad = ?',
      [id_actividad]
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({ ok: true, mensaje: 'Actividad eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la actividad' });
  }
});


export default router;

