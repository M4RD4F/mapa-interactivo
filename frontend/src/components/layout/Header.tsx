import React from 'react';
import { Menu, MapPin, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">
                Campus Universitario
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Edificios</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Eventos</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contacto</a>
            </nav>
            
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
