'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DynamicSesionesPage() {
  const params = useParams();
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const audienceParam = params.audience;
  const locationSegments = params.location || [];

// Parsing del slug desde la URL
let searchTerm = Array.isArray(locationSegments)
  ? decodeURIComponent(locationSegments.join(' '))
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  : '';

// Restaurar ñ de forma más robusta
searchTerm = searchTerm
  .replace(/\bcan tabria\b/gi, 'Cantabria')
  .replace(/\bespana\b/gi, 'España')
  .replace(/\bnnora\b/gi, 'Ñora')
  .replace(/\bpenarrubia\b/gi, 'Peñarrubia')
  .replace(/\bpena\b/gi, 'Peña')
  .replace(/\b n /gi, ' Ñ ');

  const audience = audienceParam === 'free-surfers' ? 'FREE_SURFERS'
                 : audienceParam === 'escuelas' ? 'SCHOOLS' : '';

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
const CustomTimeSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const times = [];
  for (let h = 6; h <= 23; h++) {
    times.push(`${h.toString().padStart(2, '0')}:00`);
    times.push(`${h.toString().padStart(2, '0')}:30`);
  }

  const handleSelect = (time) => {
    onChange(time);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || "Hs."}
        </span>
        <Image src='/icons/flechaAbajo.svg' width={18} height={18} alt='↓' />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
          {times.map((time) => (
            <div
              key={time}
              onClick={() => handleSelect(time)}
              className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm ${value === time ? 'bg-blue-50 font-medium text-[#0D2744]' : 'text-gray-700'
                }`}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  const [filters, setFilters] = useState({
    audience,
    location: audience === 'FREE_SURFERS' ? searchTerm : '',
    schoolName: audience === 'SCHOOLS' ? searchTerm : '',
    sessionDate: '',
    startTime: '',
  });

  const [title, setTitle] = useState('Sesiones');

  const getDaysRemaining = (activeUntil) => {
    if (!activeUntil) return null;
    const today = new Date();
    const expiryDate = new Date(activeUntil);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) return "Expira hoy";
    if (diffDays === 1) return "Expira mañana";
    return `Expira en ${diffDays} días`;
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const paramsQuery = new URLSearchParams();

      if (filters.audience) paramsQuery.append('audience', filters.audience);
      
      // === LÓGICA CLAVE ===
      if (filters.location) paramsQuery.append('location', filters.location);
      if (filters.schoolName) paramsQuery.append('schoolName', filters.schoolName);

      if (filters.sessionDate) paramsQuery.append('sessionDate', filters.sessionDate);
      if (filters.startTime) paramsQuery.append('startTime', filters.startTime);
      paramsQuery.append('page', pagination.page);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions?${paramsQuery.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setSessions(data.items || []);
          setPagination({
            page: data.page || 1,
            total: data.total || 0,
            totalPages: data.totalPages || 1,
            hasPreviousPage: data.hasPreviousPage || false,
            hasNextPage: data.hasNextPage || false,
          });
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filters, pagination.page]);

  // Actualizar título
// Actualizar título
useEffect(() => {
  let newTitle = audience === 'FREE_SURFERS' ? 'Free Surfers'
               : audience === 'SCHOOLS' ? 'Escuelas' : 'Sesiones';

  if (searchTerm) {
    newTitle += ` en ${searchTerm}`;
  }
  setTitle(newTitle);
}, [audience, searchTerm]);

// Dentro del input de búsqueda:
<input 
  type="text" 
  placeholder={filters.audience === 'SCHOOLS' ? "Buscar escuela..." : "Buscar playa o spot..."} 
  value={filters.audience === 'SCHOOLS' ? (filters.schoolName || '') : (filters.location || '')} 
  onChange={(e) => {
    const field = filters.audience === 'SCHOOLS' ? 'schoolName' : 'location';
    handleFilterChange(field, e.target.value);
  }} 
  className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" 
/>

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{pagination.total} álbumes encontrados</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm">
          <div className="flex flex-wrap gap-4 items-start">
        
            {/* Toggle Free Surfers / Escuelas */}
            <div className="flex bg-[#F1F7FE] p-1 rounded-lg w-auto h-12.25">
              <button 
                onClick={() => handleFilterChange('audience', 'FREE_SURFERS')}
                className={`px-6 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  filters.audience === 'FREE_SURFERS' ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Free Surfers
              </button>
              <button 
                onClick={() => handleFilterChange('audience', 'SCHOOLS')}
                className={`px-6 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  filters.audience === 'SCHOOLS' ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Escuelas
              </button>
            </div>
        
            {/* Buscador */}
            <div className="relative flex-1 min-w-[280px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Image src="/icons/search.svg" alt="Buscar" width={15} height={15} />
              </div>
              <input
                type="text"
                placeholder={filters.audience === 'FREE_SURFERS' ? "Playa o ubicación..." : "Nombre de la escuela..."}
                value={filters.audience === 'FREE_SURFERS' ? filters.location : filters.schoolName}
                onChange={(e) => handleFilterChange(
                  filters.audience === 'FREE_SURFERS' ? 'location' : 'schoolName', 
                  e.target.value
                )}
                className="w-full border border-gray-300 rounded-lg pl-11 pr-5 py-3 focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>
        
            {/* Filtro de Hora (el que querías replicar) */}
            <div className="relative w-full md:w-80">
              <div
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
              >
                <span className="text-gray-700">
                  {filters.timeFrom && filters.timeTo
                    ? `${filters.timeFrom} - ${filters.timeTo}`
                    : "Seleccionar hora"}
                </span>
                <Image src='/icons/flechaAbajo.svg' width={20} height={20} alt='flecha' />
              </div>
        
              {showTimeDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl p-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                      <CustomTimeSelect
                        value={filters.timeFrom}
                        onChange={(value) => handleFilterChange('timeFrom', value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                      <CustomTimeSelect
                        value={filters.timeTo}
                        onChange={(value) => handleFilterChange('timeTo', value)}
                      />
                    </div>
                  </div>
        
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        handleFilterChange('timeFrom', '');
                        handleFilterChange('timeTo', '');
                        setShowTimeDropdown(false);
                      }}
                      className="flex-1 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setShowTimeDropdown(false)}
                      className="flex-1 py-2.5 bg-[#0D2744] text-white rounded-xl hover:bg-[#0a1f35]"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
        
            {/* Fecha */}
            <input 
              type="date" 
              value={filters.sessionDate} 
              onChange={(e) => handleFilterChange('sessionDate', e.target.value)} 
              className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 w-full md:w-auto" 
            />
        
          </div>
        </div>

        {/* Grid y Paginación (mantén igual) */}
        {loading ? (
          <p className="text-center py-20 text-gray-500">Cargando sesiones...</p>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
              const daysLeft = getDaysRemaining(session.activeUntil);
              return (
                <Link href={`/sesiones/${session.id}`} key={session.id} className="group">
                  <div className="relative rounded-3xl overflow-hidden bg-black shadow-md hover:shadow-xl transition-all">
                    {session.images?.[0]?.publicUrl ? (
                      <img
                        src={session.images[0].publicUrl}
                        alt={session.title}
                        className="w-full aspect-16/10 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full aspect-16/10 bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">🌊</span>
                      </div>
                    )}

                     <div className="absolute top-4 right-4 flex  gap-2 z-10">
                                          {daysLeft && (
                                            <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                              <Image src={'/icons/hour.svg'} width={16} height={16} alt='camara' />  {daysLeft}
                                            </div>
                                          )}
                                          <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                            <Image src={'/icons/camara.svg'} width={16} height={16} alt='camara' />
                                            {session.photoCount} fotos
                                          </div>
                    
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-5 text-white">
                      <p className="font-semibold text-lg">{session.title}</p>
                      
                        <p>{session.location || session.schoolName}</p>
                        <p>{session.startTime?.slice(0,5)} - {session.endTime?.slice(0,5)}</p>
                     
                      <p className="text-sm opacity-75 mt-2">
                        by {session.photographer?.alias || 'Fotógrafo'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-xl text-gray-500">No encontramos sesiones para esta búsqueda.</p>
          </div>
        )}

        {/* Paginación (igual que antes) */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-3xl shadow-sm mt-12 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 ">
              <p className="text-lg font-medium text-gray-900">
                Página {pagination.page} de {pagination.totalPages}
              </p>
              <div className="flex gap-3">
                <button onClick={() => goToPage(1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40">«</button>
                <button onClick={() => goToPage(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40">‹</button>
                <button onClick={() => goToPage(pagination.page + 1)} disabled={!pagination.hasNextPage} className="w-10 h-10 border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40">›</button>
                <button onClick={() => goToPage(pagination.totalPages)} disabled={!pagination.hasNextPage} className="w-10 h-10 border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40">»</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}