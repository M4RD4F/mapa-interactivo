// frontend/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/layout';
import CampusMap from './components/CampusMap/CampusMap';
import EdificiosPage from './pages/EdificiosPage';
import EventosPage from './pages/EventosPage';
import ContactoPage from './pages/ContactoPage';
import TeacherActivities from './components/Teacher/TeacherActivities';
import TeacherLogin from './components/Auth/TeacherLogin';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(null);
  const [docenteId, setDocenteId] = useState<number | null>(null);
  const [docenteNombre, setDocenteNombre] = useState<string | null>(null);

  // Cambia rol desde el header (y limpia profe si sale)
  const handleLogin = (role: 'student' | 'professor' | null) => {
    setUserRole(role);
    if (role !== 'professor') {
      setDocenteId(null);
      setDocenteNombre(null);
    }
  };

  // Login exitoso del profe
  const handleLoginDocenteSuccess = (id: number, nombre: string) => {
    setUserRole('professor');
    setDocenteId(id);
    setDocenteNombre(nombre);
  };

  return (
    <BrowserRouter>
      <Layout userRole={userRole} onLogin={handleLogin} userName={docenteNombre}>
        <Routes>
          <Route path="/" element={<CampusMap />} />
          <Route path="/mapa" element={<CampusMap />} />
          <Route path="/edificios" element={<EdificiosPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />

          {/* Login docente */}
          <Route
            path="/login-docente"
            element={
              userRole === 'professor' && docenteId
                ? <Navigate to="/admin" />
                : <TeacherLogin onLoginSuccess={handleLoginDocenteSuccess} />
            }
          />

          {/* Panel docente */}
          <Route
            path="/admin"
            element={
              userRole === 'professor' && docenteId
                ? <TeacherActivities docenteId={docenteId} />
                : <Navigate to="/login-docente" />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

