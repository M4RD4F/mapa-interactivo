import express from 'express';
import cors from 'cors';

import buildingsRouter from './routes/buildings';
import eventsRouter from './routes/events';
import actividadesRouter from './routes/actividades';
import authRoutes from './routes/auth';
import edificiosRouter from './routes/edificios';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/buildings', buildingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/actividades', actividadesRouter);
app.use('/api/auth', authRoutes);
app.use('/api/edificios', edificiosRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API del mapa interactivo funcionando 🚀' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
