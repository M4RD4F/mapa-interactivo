import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Building, Calendar, Mail, User, LogOut } from 'lucide-react';

interface HeaderProps {
  userRole: 'student' | 'professor' | null;
  onLogin: (role: 'student' | 'professor' | null) => void; // ✅ Permite null
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogin }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: <MapPin size={20} /> },
    { path: '/edificios', label: 'Edificios', icon: <Building size={20} /> },
    { path: '/eventos', label: 'Eventos', icon: <Calendar size={20} /> },
    { path: '/contacto', label: 'Contacto', icon: <Mail size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={24} />
              <span className="font-bold text-gray-900 text-xl">CampusMap</span>
            </Link>

            <div className="hidden md:flex gap-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userRole ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {userRole === 'professor' ? 'Profesor' : 'Estudiante'}
                  </span>
                </div>
                
                {userRole === 'professor' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Panel Admin
                  </Link>
                )}
                
                <button
                  onClick={() => onLogin(null)} // ✅ Ahora null es válido
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => onLogin('student')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Estudiante
                </button>
                <button
                  onClick={() => onLogin('professor')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Profesor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;