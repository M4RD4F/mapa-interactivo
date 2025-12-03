// frontend/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/layout';
import CampusMap from './components/CampusMap/CampusMap';
import EdificiosPage from './pages/EdificiosPage';
import EventosPage from './pages/EventosPage';
import ContactoPage from './pages/ContactoPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState<'student' | 'professor' | null>('student');
  const handleLogin = (role: 'student' | 'professor') => {
    setUserRole(role);
  };
  return (
    <BrowserRouter>
      <Layout userRole={userRole} onLogin={(role) => setUserRole(role)}>
        <Routes>
          <Route path="/" element={<CampusMap />} />
          <Route path="/mapa" element={<CampusMap />} />
          <Route path="/edificios" element={<EdificiosPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route 
            path="/admin" 
            element={userRole === 'professor' ? <AdminPage /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;