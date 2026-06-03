'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    audience: '',
    location: '',
    schoolName: '',
    sessionDate: '',
    startTime: '',
  });

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
      if (filters.location) params.append('location', filters.location);
      if (filters.schoolName) params.append('schoolName', filters.schoolName);
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
      if (filters.startTime) params.append('startTime', filters.startTime);
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
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen  bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Título y contador */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{pagination.total} álbumes encontrados</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex gap-2">
            <button onClick={() => handleFilterChange('audience', '')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${!filters.audience ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Todos</button>
            <button onClick={() => handleFilterChange('audience', 'FREE_SURFERS')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${filters.audience === 'FREE_SURFERS' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Free surfers</button>
            <button onClick={() => handleFilterChange('audience', 'SCHOOLS')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${filters.audience === 'SCHOOLS' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Escuelas</button>
          </div>

          <input type="text" placeholder="Playa o ubicación..." value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900" />

          <input type="date" value={filters.sessionDate} onChange={(e) => handleFilterChange('sessionDate', e.target.value)} className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900" />

          <select onChange={(e) => handleFilterChange('startTime', e.target.value)} className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900">
            <option value="">Desde</option>
            <option value="09:00">09:00 am</option>
            <option value="10:00">10:00 am</option>
          </select>
        </div>

        {/* Grid de Sesiones */}
        {loading ? (
          <p className="text-center py-20 text-gray-500">Cargando sesiones...</p>
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
                        <span className="text-4xl">🌊</span>
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
    <div className="flex items-center justify-between px-8 py-6 border-t">
      <p className="text-lg font-medium text-gray-900">
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