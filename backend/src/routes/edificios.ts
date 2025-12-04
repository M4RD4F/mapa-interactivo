import { Router } from 'express';
import { pool } from '../db'; // ajusta la ruta si tu archivo de conexión se llama diferente

const router = Router();

// GET /api/edificios
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id_edificio,
        nombre,
        descripcion,
        categoria,
        pos_x,
        pos_y
      FROM edificios
      `
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener edificios' });
  }
});

export default router;
