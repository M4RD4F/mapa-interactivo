import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const ContactoPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <MessageCircle className="text-blue-600" size={32} />
            Contacto del Campus
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Si tienes dudas sobre actividades, créditos escolares o el uso del mapa interactivo, 
            puedes comunicarte con la coordinación académica a través de los siguientes medios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Datos de contacto */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Información general
              </h2>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-slate-800">
                    Campus Tecnológico “Escuela de Ejemplo”
                  </p>
                  <p className="text-sm text-slate-600">
                    Av. Tecnológico S/N, Col. Universitaria<br />
                    C.P. 72000, Ciudad Academía, Estado
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-slate-800">
                    Teléfonos de contacto
                  </p>
                  <p className="text-sm text-slate-600">
                    Conmutador: (222) 123 45 67<br />
                    Ext. Coordinación Académica: 203<br />
                    Ext. Servicios Escolares: 205
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-slate-800">
                    Correos electrónicos
                  </p>
                  <p className="text-sm text-slate-600">
                    Coordinación de actividades y créditos:{' '}
                    <span className="font-mono">actividades@campus.edu.mx</span><br />
                    Servicios escolares:{' '}
                    <span className="font-mono">escolares@campus.edu.mx</span><br />
                    Soporte del mapa interactivo:{' '}
                    <span className="font-mono">soporte.mapa@campus.edu.mx</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-slate-800">
                    Horario de atención
                  </p>
                  <p className="text-sm text-slate-600">
                    Lunes a viernes de 8:00 a 15:00 hrs<br />
                    Sábados de 9:00 a 13:00 hrs (solo atención en ventanilla)
                  </p>
                </div>
              </div>
            </div>

            {/* Nota para docentes y estudiantes */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-slate-700">
              <p className="font-semibold text-blue-800 mb-1">🔔 Importante</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Para dudas sobre <strong>actividades y créditos</strong>, escribe primero a la coordinación de actividades.
                </li>
                <li>
                  Los docentes pueden registrar y actualizar actividades desde el{' '}
                  <strong>Panel del Docente</strong> al iniciar sesión.
                </li>
                <li>
                  Si encuentras algún error en el mapa interactivo, manda captura de pantalla a{' '}
                  <span className="font-mono">soporte.mapa@campus.edu.mx</span>.
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta lateral */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Coordinación de actividades
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Responsable del registro y validación de actividades que otorgan 
                créditos escolares dentro del campus.
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Nombre:</span><br />
                Mtra. Laura Hernández<br />
                <span className="font-medium">Correo:</span><br />
                <span className="font-mono">laura.hernandez@campus.edu.mx</span>
              </p>
            </div>

            <div className="bg-slate-900 text-slate-50 rounded-2xl p-5 text-sm space-y-2">
              <p className="font-semibold">¿Tienes una duda rápida?</p>
              <p className="text-slate-200">
                También puedes acercarte a la ventanilla de servicios escolares con tu credencial 
                del alumno y el código de la actividad para recibir apoyo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;
