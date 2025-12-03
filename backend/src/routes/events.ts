import express from 'express';
const router = express.Router();

const events = [
  {
    id: 'event-1',
    title: 'Taller de Investigación',
    date: '2024-03-15',
    time: '15:00',
    location: 'Biblioteca - Sala A',
    building: 'library',
    description: 'Taller sobre métodos de investigación...',
    images: ['event1-1.jpg', 'event1-2.jpg'],
    organizer: 'Dra. María López',
    attendees: 45,
    status: 'upcoming'
  }
  // ... más eventos
];

router.get('/', (req, res) => {
  res.json(events);
});

router.post('/', (req, res) => {
  // Solo para profesores autenticados
  const newEvent = { id: `event-${Date.now()}`, ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

export default router;