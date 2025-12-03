import express from 'express';
const router = express.Router();

// Datos de ejemplo
const buildings = [
  {
    id: 'library',
    name: 'Biblioteca Central',
    description: 'Biblioteca principal con 3 pisos...',
    schedule: [
      { day: 'Lunes-Viernes', time: '7:00 AM - 10:00 PM' },
      { day: 'Sábado', time: '9:00 AM - 6:00 PM' },
      { day: 'Domingo', time: '10:00 AM - 4:00 PM' }
    ],
    teachers: [
      { name: 'Dra. María López', subject: 'Investigación', office: 'Sala A-101' },
      { name: 'Lic. Carlos Ruiz', subject: 'Metodología', office: 'Sala B-203' }
    ],
    classrooms: [
      { number: 'A-101', capacity: 30, type: 'Sala de Estudio' },
      { number: 'B-203', capacity: 20, type: 'Laboratorio de Computación' }
    ]
  }
  // ... más edificios
];

router.get('/', (req, res) => {
  res.json(buildings);
});

router.get('/:id', (req, res) => {
  const building = buildings.find(b => b.id === req.params.id);
  res.json(building || { error: 'Edificio no encontrado' });
});

export default router;