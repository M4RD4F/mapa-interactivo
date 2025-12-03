import React from 'react';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'professor' | null;
  onLogin: (role: 'student' | 'professor' | null) => void; 
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} onLogin={onLogin} />
      <main className="py-6">{children}</main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 Campus Universitario. Todos los derechos reservados.</p>
          <p className="mt-2">Sistema de Mapa Interactivo v1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;