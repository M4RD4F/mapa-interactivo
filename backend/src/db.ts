import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // tu usuario
  password: '',           // tu contraseña (si tienes)
  database: 'campus_mapa',
  waitForConnections: true,
  connectionLimit: 10,
});
