'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
function CardSkeleton({ delay = 0 }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ aspectRatio: '16/10', animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-[#dce8f5]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'waveSweep 1.6s ease-in-out infinite',
          animationDelay: `${delay}ms`,
        }}
      />
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <div className="h-6 w-20 rounded-full bg-black/15" />
        <div className="h-6 w-20 rounded-full bg-black/15" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2.5">
        <div className="h-4 w-3/4 rounded bg-white/30" />
        <div className="h-3 w-1/2 rounded bg-white/30" />
        <div className="h-3 w-2/5 rounded bg-white/30" />
        <div className="h-3 w-1/3 rounded bg-white/30" />
      </div>
    </div>
  );
}
export default function SesionesPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

 const [filters, setFilters] = useState({
  audience: 'FREE_SURFERS',
  location: '',
  schoolName: '',
  search: '',           // ← si ya lo tenías
  sessionDate: '',
  timeFrom: '',         // ← nuevo
  timeTo: '',           // ← nuevo
});
const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [title, setTitle] = useState('Sesiones');

  // Función para calcular días restantes
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

  // Cargar sesiones públicas
  useEffect(() => {
  const fetchPublicSessions = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (filters.audience) params.append('audience', filters.audience);
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.schoolName) params.append('schoolName', filters.schoolName);
    if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
    if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
    if (filters.timeTo) params.append('timeTo', filters.timeTo);
    
    params.append('page', pagination.page);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions?${params.toString()}`);

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
        console.error('Error al cargar sesiones públicas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSessions();
  }, [filters, pagination.page]);

  // Actualizar título
  useEffect(() => {
    if (filters.schoolName) {
      setTitle(`Sesiones de ${filters.schoolName}`);
    } else if (filters.location) {
      setTitle(`Sesiones en ${filters.location}`);
    } else {
      setTitle('Sesiones');
    }
  }, [filters.schoolName, filters.location]);

const handleFilterChange = (key, value) => {
  setFilters(prev => {
    const newFilters = { ...prev, [key]: value };
    
    if (key === 'audience') {
      newFilters.search = '';
      newFilters.timeFrom = '';
      newFilters.timeTo = '';
      if (value === 'FREE_SURFERS') {
        newFilters.schoolName = '';
      } else {
        newFilters.location = '';
      }
    }
    return newFilters;
  });
  
  setPagination(prev => ({ ...prev, page: 1 }));
};
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
  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen  bg-gray-50 pb-12">
      <div className=" mx-auto px-6 py-8">

        {/* Título y contador */}
        <div className="mb-8">
          <h1 className="text-[24px] font-medium text-[#10487C] pb-5 md:pb-0">{title}</h1>
          <p className="text-gray-600 text-[16px] mt-1">{pagination.total} álbumes encontrados</p>
        </div>

      {/* Filtros */}
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

        {/* Grid de Sesiones */}
    {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <CardSkeleton key={i} delay={i * 100} />
    ))}
  </div>
) : sessions.length === 0 ? (
  <div className="text-center py-20">
    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <img src='/icons/logo.svg' width={40} height={40} alt='logo' />
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">
      No se encontraron sesiones
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      {filters.search || filters.location || filters.schoolName || filters.sessionDate || filters.timeFrom
        ? "Prueba con otros filtros o fechas diferentes."
        : "Todavía no hay sesiones disponibles en esta categoría."}
    </p>
  </div>
) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
              const daysLeft = getDaysRemaining(session.activeUntil);

              return (
                <Link href={`/sesiones/${session.id}`} key={session.id} className="group">
                  <div className="relative rounded-3xl overflow-hidden bg-black shadow-md hover:shadow-xl transition-all">
                    {session.images?.[0]?.publicUrl ? (
                      <img
                      onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                        src={session.images[0].publicUrl}
                        alt={session.title}
                        className="w-full aspect-16/10 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full aspect-16/10 bg-gray-200 flex items-center justify-center">
                        <img src='/icons/logo.svg' width={20} height={20} alt='logo'/>
                      </div>
                    )}

                    {/* Badges superiores */}
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
                      
                        <p className="text-sm opacity-90">{session.location || session.schoolName}</p>
                      <p className="text-sm opacity-90">
                        {session.startTime} - {session.endTime}
                      </p>
                      <p className="text-sm opacity-90">
                        by {session.photographer?.firstName && session.photographer?.lastName
                          ? `${session.photographer.firstName} ${session.photographer.lastName}`
                          : session.photographer?.alias || 'Fotógrafo'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Paginación */}
       {/* Paginación - Estilo Mis Ventas */}
{pagination.totalPages > 1 && (
  <div className="bg-white rounded-3xl shadow-sm mt-12">
    <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 ">
      <p className="text-lg font-medium text-[#10487C]">
        Página {pagination.page} de {pagination.totalPages}
      </p>

      <div className="flex gap-3">
        <button 
          onClick={() => goToPage(1)} 
          disabled={!pagination.hasPreviousPage}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
        >
          «
        </button>
        <button 
          onClick={() => goToPage(pagination.page - 1)} 
          disabled={!pagination.hasPreviousPage}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
        >
          ‹
        </button>

        <button 
          onClick={() => goToPage(pagination.page + 1)} 
          disabled={!pagination.hasNextPage}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
        >
          ›
        </button>
        <button 
          onClick={() => goToPage(pagination.totalPages)} 
          disabled={!pagination.hasNextPage}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
        >
          »
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}