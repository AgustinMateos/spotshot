'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react'; // Instala con: npm install lucide-react

export default function Buscador() {
  const [activeTab, setActiveTab] = useState('free');

  return (
    <div className="relative -mt-12 z-10 px-6 pb-12 ">
      <div className="max-w-4xl mx-auto">
        
        {/* Contenedor principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ">
          
          {/* Tabs redondeados */}
          <div className="flex p-2 border-b border-gray-100">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('free')}
                className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'free'
                    ? 'bg-white shadow text-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Free surfers
              </button>
              <button
                onClick={() => setActiveTab('escuelas')}
                className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'escuelas'
                    ? 'bg-white shadow text-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Escuelas
              </button>
            </div>
          </div>

          {/* Barra de búsqueda grande */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4  bg-white border border-gray-200 rounded-3xl p-2 shadow-sm">
              
              {/* Input Playa */}
              <div className="flex-1 flex items-center gap-3 px-5 py-4">
                <MapPin className="text-gray-400" size={22} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Playa</p>
                  <input
                    type="text"
                    placeholder="Busca tu playa (Ej. Somo)"
                    className="w-full bg-transparent outline-none text-base placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Botón Buscar */}
              <button className="w-full md:w-auto bg-[#DEB656] hover:bg-[#deb556c4] transition-all text-white font-semibold px-10 py-4 rounded-2xl whitespace-nowrap text-base active:scale-[0.97]">
                Buscar fotos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}