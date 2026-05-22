'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Buscador() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('free');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSubmit = (e) => {
  e.preventDefault();

  const audienceSlug = activeTab === 'free' ? 'free-surfers' : 'escuelas';
  let url = `/sesiones/buscar/${audienceSlug}`;

  if (searchLocation.trim()) {
    const locationSlug = searchLocation.trim()
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñ\s-]/g, '')
      .replace(/\s+/g, '-');
    url += `/${locationSlug}`;
  }

  router.push(url);
};

  return (
    <div className="relative -mt-60 z-10 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Tabs */}
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

          {/* Barra de búsqueda */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-gray-200 rounded-3xl p-2 shadow-sm">
              <div className="flex-1 flex items-center gap-3 px-5 py-4">
                <MapPin className="text-gray-400" size={22} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Playa</p>
                  <input
                    type="text"
                    placeholder={activeTab === 'free' 
                      ? "Busca tu playa (Ej. Somo)" 
                      : "Busca escuela o playa (Ej. Mundaka)"}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent outline-none text-base placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full md:w-auto bg-[#DEB656] hover:bg-[#c99c3f] transition-all text-white font-semibold px-10 py-4 rounded-2xl whitespace-nowrap text-base active:scale-[0.97]"
              >
                Buscar fotos
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}