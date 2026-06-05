'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function MisSesiones() {
  const { token } = useAuth();

  const [stripeConnect, setStripeConnect] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(true);
const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

// Filtros
const [filters, setFilters] = useState({
  search: '',
  audience: 'FREE_SURFERS',   // ← Free Surfers por defecto
  status: '',
  location: '',
  sessionDate: '',
});

  // Cargar estado de Stripe
  useEffect(() => {
    const loadStripeStatus = async () => {
      if (!token) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStripeConnect(data.stripeConnect);
        }
      } catch (err) {
        console.error("Error cargando Stripe:", err);
      } finally {
        setLoadingStripe(false);
      }
    };
    loadStripeStatus();
  }, [token]);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {  // evita cerrar al hacer clic dentro del dropdown
      setShowStatusDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  // Traducción y colores de estados
  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return 'Borrador';
      case 'PROCESSING': return 'En proceso';
      case 'ACTIVE': return 'Publicada';
      case 'DISABLED': return 'Desactivada';
      default: return status || 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return 'bg-[#0D2744] text-white';
      case 'PROCESSING': return 'bg-[#0D2744] text-white';
      case 'ACTIVE': return 'bg-[#0D2744] text-white';
      case 'DISABLED': return 'bg-[#0D2744] text-white';
      default: return 'bg-[#0D2744] text-white';
    }
  };

  // Cargar sesiones
  useEffect(() => {
    const fetchMySessions = async () => {
      if (!token) return;
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
      params.append('page', pagination.page);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(
          `${API_URL}/api/v1/photographers/me/photo-sessions?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

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
        console.error('Error al cargar sesiones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMySessions();
  }, [token, filters, pagination.page]);

  // Filtrado local por búsqueda
  const filteredSessions = useMemo(() => {
    if (!filters.search) return sessions;
    const term = filters.search.toLowerCase();
    return sessions.filter(s =>
      s.title?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term) ||
      s.schoolName?.toLowerCase().includes(term)
    );
  }, [sessions, filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const isStripeReady = stripeConnect?.isReady === true;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 py-10">

        <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 pb-5 md:pb-0">Mis Sesiones</h1>

          <Link
            href={isStripeReady ? "/shot/newAlbum" : "#"}
            className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition font-medium ${isStripeReady
                ? 'bg-[#0D2744] text-white hover:bg-[#0d2744e5]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            onClick={(e) => {
              if (!isStripeReady) {
                e.preventDefault();
                alert("Debes conectar tu cuenta de Stripe para crear sesiones");
              }
            }}
          >
            <span className="text-xl">+</span> Crear Nueva Sesión
          </Link>
        </div>

        {/* Filtros */}
<div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

    {/* Toggle Free Surfers / Escuelas */}
    <div className="flex bg-[#F1F7FE] p-1 rounded-3xl w-fit h-[50px]">
      <button
        onClick={() => handleFilterChange('audience', 'FREE_SURFERS')}
        className={`px-6 py-2.5 rounded-2xl text-[14px] font-medium transition-all ${
          filters.audience === 'FREE_SURFERS' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Free Surfers
      </button>
      <button
        onClick={() => handleFilterChange('audience', 'SCHOOLS')}
        className={`px-6 py-2.5 rounded-2xl text-[14px] font-medium transition-all ${
          filters.audience === 'SCHOOLS' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Escuelas
      </button>
    </div>

    <input
      type="text"
      placeholder="Buscar playa o escuela..."
      value={filters.search}
      onChange={(e) => handleFilterChange('search', e.target.value)}
      className="lg:col-span-2 border border-gray-300 w-[250px] rounded-2xl px-5 py-3 focus:outline-none focus:border-gray-900"
    />

    {/* === DROPDOWN PERSONALIZADO DE ESTADOS === */}
    {/* === DROPDOWN PERSONALIZADO DE ESTADOS === */}
<div className="relative">
  <div
    onClick={(e) => {
      e.stopPropagation();
      setShowStatusDropdown(!showStatusDropdown);
    }}
    className="w-full px-5 py-3 border border-gray-300 rounded-2xl bg-white cursor-pointer flex justify-between items-center focus:outline-none focus:border-blue-500"
  >
    <span className="text-gray-700">
      {filters.status 
        ? getStatusLabel(filters.status) 
        : "Todos los estados"}
    </span>
    <span className="text-gray-400">▼</span>
  </div>

  {showStatusDropdown && (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-lg overflow-auto py-2 max-h-80"
    >
      <div
        onClick={() => {
          handleFilterChange('status', '');
          setShowStatusDropdown(false);
        }}
        className={`px-5 py-3 hover:bg-blue-50 cursor-pointer ${!filters.status ? 'bg-blue-50 font-medium' : ''}`}
      >
        Todos los estados
      </div>
      {[
        { value: 'DRAFT', label: 'Borrador' },
        { value: 'PROCESSING', label: 'En proceso' },
        { value: 'ACTIVE', label: 'Publicada' },
        { value: 'DISABLED', label: 'Desactivada' },
      ].map((status) => (
        <div
          key={status.value}
          onClick={() => {
            handleFilterChange('status', status.value);
            setShowStatusDropdown(false);
          }}
          className={`px-5 py-3 hover:bg-blue-50 cursor-pointer ${
            filters.status === status.value ? 'bg-blue-50 font-medium' : ''
          }`}
        >
          {status.label}
        </div>
      ))}
    </div>
  )}
</div>

    <input
      type="date"
      value={filters.sessionDate}
      onChange={(e) => handleFilterChange('sessionDate', e.target.value)}
      className="border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:border-gray-900"
    />
  </div>
</div>


        {/* Grid de Sesiones */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full aspect-16/10 bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Link href={`/shot/sesion/${session.id}`} key={session.id} className="group">
                <div className="relative rounded-3xl overflow-hidden bg-black shadow-md hover:shadow-xl transition-all">
                  {session.images?.[0]?.publicUrl ? (
                    <img
                      src={session.images[0].publicUrl}
                      alt={session.title}
                      className="w-full aspect-16/10 object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full aspect-16/10 bg-gray-800 flex items-center justify-center text-6xl">🌊</div>
                  )}

                  <div className="absolute top-3 right-3 bg-[#0F172A] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Image src={'/icons/camara.svg'} width={16} height={16} alt='fotos' /> 
                    {session.photoCount} fotos
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
                    <div className={`text-xs inline-block px-3 py-1 rounded-full mb-2 ${getStatusColor(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </div>
                    <p className="font-semibold text-lg">{session.title}</p>
                    <p className="text-sm opacity-90">{session.location || session.schoolName}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {session.startTime} - {session.endTime}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No se encontraron sesiones con los filtros aplicados.</p>
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-3xl shadow-sm mt-12 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6">
              <p className="text-lg font-medium text-gray-900">
                Página {pagination.page} de {pagination.totalPages}
              </p>

              <div className="flex gap-3">
                <button onClick={() => goToPage(1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">«</button>
                <button onClick={() => goToPage(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">‹</button>
                <button onClick={() => goToPage(pagination.page + 1)} disabled={!pagination.hasNextPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">›</button>
                <button onClick={() => goToPage(pagination.totalPages)} disabled={!pagination.hasNextPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">»</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}