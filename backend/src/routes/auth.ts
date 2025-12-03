// backend/src/routes/auth.ts
import express from 'express';
import { pool } from '../db';

const router = express.Router();

/**
 * Login sencillo para DOCENTES
 * Front le manda: { email, password }
 * Usamos columnas: correo, password, rol='docente'
 */
router.post('/login-docente', async (req, res) => {
  try {
    const { email, password } = req.body; // viene del front

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }

    const [rows] = await pool.query<any[]>(
      `SELECT id_usuario, nombre, correo, password, rol
       FROM usuarios
       WHERE correo = ? AND rol = 'docente'
       LIMIT 1`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    // Comparación simple (texto plano)
    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Todo ok
    res.json({
      id_docente: usuario.id_usuario,
      nombre: usuario.nombre,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el login' });
  }
});

export default router;

