'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { escuelas, playas } from '@/lib/constants/surfData';


export default function Buscador() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('free');
  const [searchLocation, setSearchLocation] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')                    // ← Volvemos a 'n' (más simple y estable)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const audienceSlug = activeTab === 'free' ? 'free-surfers' : 'escuelas';
    let url = `/sesiones/buscar/${audienceSlug}`;

    if (searchLocation.trim()) {
      // Buscamos coincidencia exacta para usar el "value" si existe
      const items = activeTab === 'free' ? playas : escuelas;
      const matched = items.find(item => 
        item.label.toLowerCase() === searchLocation.toLowerCase()
      );
      
      const textToSlug = matched ? matched.value : searchLocation.trim();
      const locationSlug = slugify(textToSlug);
      url += `/${locationSlug}`;
    }

    router.push(url);
  };

  const suggestions = activeTab === 'free' 
    ? playas.filter(item => 
        item.label.toLowerCase().includes(searchLocation.toLowerCase())
      ).slice(0, 10)
    : escuelas.filter(item => 
        item.label.toLowerCase().includes(searchLocation.toLowerCase())
      ).slice(0, 10);

  return (
    <div className="relative -mt-60 z-10 px-6 pb-36">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl">
          
          {/* Tabs */}
          <div className="flex p-2 border-b border-gray-100">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1">
              <button 
                onClick={() => { setActiveTab('free'); setSearchLocation(''); }}
                className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === 'free' ? 'bg-white shadow text-black' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Free surfers
              </button>
              <button 
                onClick={() => { setActiveTab('escuelas'); setSearchLocation(''); }}
                className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === 'escuelas' ? 'bg-white shadow text-black' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Escuelas
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-gray-200 rounded-3xl p-2 shadow-sm relative">
              
              <div className="flex-1 flex items-center gap-3 px-5 py-4 relative">
                <MapPin className="text-gray-400" size={22} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">
                    {activeTab === 'free' ? 'Playa' : 'Escuela'}
                  </p>
                  <input
                    type="text"
                    placeholder={activeTab === 'free' ? "Busca tu playa (Ej. Somo)" : "Busca escuela (Ej. Sunset...)"}
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full bg-transparent outline-none text-base placeholder:text-gray-400"
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && searchLocation.length > 0 && suggestions.length > 0 && (
                  <div className="absolute top-19.5 left-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-72 overflow-auto">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onMouseDown={() => {
                          setSearchLocation(item.label);
                          setShowDropdown(false);
                        }}
                        className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none text-sm"
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
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