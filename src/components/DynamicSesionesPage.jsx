'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function DynamicSesionesPage() {
  const params = useParams();

  const audienceParam = params.audience;
  const locationSegments = params.location || [];
  const locationParam = locationSegments.join(' ');

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

  const [filters, setFilters] = useState({
    audience,
    location: locationParam || '',
    schoolName: '',
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
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filters, pagination.page]);

  useEffect(() => {
    let newTitle = audience === 'FREE_SURFERS' ? 'Free Surfers' 
                 : audience === 'SCHOOLS' ? 'Escuelas' : 'Sesiones';
    if (locationParam) newTitle += ` en ${locationParam}`;
    setTitle(newTitle);
  }, [audience, locationParam]);

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
        <div className="flex flex-wrap gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex gap-2">
            <button onClick={() => handleFilterChange('audience', '')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${!filters.audience ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Todos</button>
            <button onClick={() => handleFilterChange('audience', 'FREE_SURFERS')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${filters.audience === 'FREE_SURFERS' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Free surfers</button>
            <button onClick={() => handleFilterChange('audience', 'SCHOOLS')} className={`px-6 py-2.5 rounded-2xl font-medium transition ${filters.audience === 'SCHOOLS' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Escuelas</button>
          </div>

          <input 
            type="text" 
            placeholder="Playa o ubicación..." 
            value={filters.location} 
            onChange={(e) => handleFilterChange('location', e.target.value)} 
            className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" 
          />

          <input type="date" value={filters.sessionDate} onChange={(e) => handleFilterChange('sessionDate', e.target.value)} className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500" />

          <select value={filters.startTime} onChange={(e) => handleFilterChange('startTime', e.target.value)} className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500">
            <option value="">Desde</option>
            <option value="09:00">09:00 am</option>
            <option value="10:00">10:00 am</option>
          </select>
        </div>

        {/* Grid de Sesiones */}
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

                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      {daysLeft && (
                        <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <Image src="/icons/hour.svg" width={16} height={16} alt="tiempo" /> {daysLeft}
                        </div>
                      )}
                      <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Image src="/icons/camara.svg" width={16} height={16} alt="fotos" />
                        {session.photoCount} fotos
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-5 text-white">
                      <p className="font-semibold text-lg">{session.title}</p>
                      <div className="flex justify-between text-sm opacity-90 mt-1">
                        <p>{session.location || session.schoolName}</p>
                        <p>{session.startTime} - {session.endTime}</p>
                      </div>
                      <p className="text-sm opacity-75 mt-2">
                        by {session.photographer?.alias || `${session.photographer?.firstName || ''} ${session.photographer?.lastName || ''}`.trim() || 'Fotógrafo'}
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

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={() => goToPage(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="px-6 py-3 border border-gray-300 rounded-2xl disabled:opacity-50">← Anterior</button>
            <span className="px-8 py-3 text-gray-700 font-medium">Página {pagination.page} de {pagination.totalPages}</span>
            <button onClick={() => goToPage(pagination.page + 1)} disabled={!pagination.hasNextPage} className="px-6 py-3 border border-gray-300 rounded-2xl disabled:opacity-50">Siguiente →</button>
          </div>
        )}
      </div>
     
    </div>
  );
}