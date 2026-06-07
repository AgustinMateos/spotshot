'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShotPage() {
  const { user, token, loading: authLoading } = useAuth();

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false); // ← Agregado

  const [stripeConnect, setStripeConnect] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    audience: 'FREE_SURFERS',
    status: '',
    location: '',
    sessionDate: '',
    timeFrom: '',      // ← Agregado
    timeTo: '',        // ← Agregado
    page: 1,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Cargar perfil (Stripe)
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStripeConnect(data.stripeConnect);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [token]);

  // Cargar sesiones
  useEffect(() => {
    const loadMySessions = async () => {
      if (!token) return;
      setLoadingFilters(true);

      const params = new URLSearchParams();
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
      if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
      if (filters.timeTo) params.append('timeTo', filters.timeTo);
      params.append('page', filters.page);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(
          `${API_URL}/api/v1/photographers/me/photo-sessions?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (res.ok) {
          setAllSessions(data.items || []);
          setPagination({
            total: data.total || 0,
            totalPages: data.totalPages || 1,
            hasPreviousPage: data.hasPreviousPage || false,
            hasNextPage: data.hasNextPage || false,
          });
        }
      } catch (err) {
        console.error("Error cargando mis sesiones:", err);
      } finally {
        setLoadingFilters(false);
        if (loadingInitial) setLoadingInitial(false);
      }
    };

    loadMySessions();
  }, [token, filters.audience, filters.status, filters.location, filters.sessionDate, 
      filters.timeFrom, filters.timeTo, filters.page]); // ← Agregados timeFrom y timeTo

  // Filtrado client-side (búsqueda)
// Filtrado client-side (búsqueda + horario)
const filteredSessions = useMemo(() => {
  let result = allSessions;

  // Filtro de búsqueda
  if (filters.search.trim()) {
    const term = filters.search.toLowerCase().trim();
    result = result.filter(session =>
      session.title?.toLowerCase().includes(term) ||
      session.location?.toLowerCase().includes(term) ||
      session.schoolName?.toLowerCase().includes(term)
    );
  }

  // ← FILTRO DE HORA (el que faltaba)
  if (filters.timeFrom && filters.timeTo) {
    result = result.filter(session => {
      const sessionStart = session.startTime?.slice(0, 5); // "12:30:00" → "12:30"
      if (!sessionStart) return false;

      return sessionStart >= filters.timeFrom && sessionStart <= filters.timeTo;
    });
  }

  return result;
}, [allSessions, filters.search, filters.timeFrom, filters.timeTo]);
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Traducción de estados
  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return 'Borrador';
      case 'PROCESSING': return 'En proceso';
      case 'ACTIVE': return 'Publicada';
      case 'DISABLED': return 'Desactivada';
      default: return status || 'Todos los estados';
    }
  };

  const isStripeReady = stripeConnect?.isReady === true;
  const alias = user?.alias || 'Fotógrafo';
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
        <Image src='/icons/flechaabajo.svg' width={18} height={18} alt='↓' />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
          {times.map((time) => (
            <div
              key={time}
              onClick={() => handleSelect(time)}
              className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm ${
                value === time ? 'bg-blue-50 font-medium text-[#0D2744]' : 'text-gray-700'
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
  if (authLoading || loadingProfile || loadingInitial) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  }
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-full mx-auto px-6 py-8">

        {/* Header de bienvenida */}
        <div className="bg-[#F1F7FE] rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">Hola {alias}!</h2>
          <p className="text-[#71717A] mt-1">
            {allSessions.length > 0 ? "Gestiona tus sesiones publicadas" : "Completa estos pasos para comenzar"}
          </p>

          {/* Pasos solo si NO tiene sesiones */}
          {allSessions.length === 0 && (
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {/* Paso 1 - Stripe */}
              <div className="border border-gray-200 bg-white rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Paso 1</div>
                    <h3 className="text-2xl font-semibold">Conecta tu cuenta de pagos</h3>
                  </div>
                  {isStripeReady && (
                    <div className="bg-[#059669] text-white text-sm font-medium px-5 py-1.5 rounded-full">
                      Completo
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-6">
                  Vinculá Stripe para poder publicar tus sesiones y recibir pagos automáticamente.
                </p>

                {isStripeReady ? (
                  <div className="flex items-center gap-2 text-[#71717A] font-medium">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Stripe Conectado
                  </div>
                ) : (
                  <Link
                    href="/shot/perfil"
                    className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition"
                  >
                    Conectar Stripe →
                  </Link>
                )}
              </div>

              {/* Paso 2 - Crear Sesión */}
              <div className="border border-gray-200 bg-white rounded-xl p-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 2</div>
                <h3 className="text-xl font-semibold mb-2">Crea tu primera sesión</h3>
                <p className="text-gray-600 mb-6">
                  Sube tus fotos, configurá precios y publica para que los surfistas te encuentren.
                </p>

                <Link
                  href="/shot/newAlbum"
                  className={`px-6 py-3 rounded-xl font-medium transition inline-flex items-center gap-3 ${isStripeReady
                      ? 'bg-gray-900 text-white hover:bg-black'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span className="text-xl">+</span>
                  Crear sesión
                </Link>
              </div>

              <div className="hidden md:block">
                <Image height={183} width={280} alt="stripe steps" src="/icons/stripeSteps.svg" />
              </div>
            </div>
          )}
        </div>



        {isStripeReady ? (
          /* ==================== LISTA DE SESIONES ==================== */
          <>
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-xl text-[#10487C] font-semibold pb-5 md:pb-0">
                  Mis sesiones ({pagination.total})
                </h3>
                <Link
                  href="/shot/newAlbum"
                  className="bg-gray-900  text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black"
                >
                  <span className="text-xl">+</span> Crear nueva sesión
                </Link>
              </div>

             <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <div className='flex w-full gap-6 flex-wrap flex-col md:flex-row items-start'>

                {/* Toggle Audience */}
                <div className="flex bg-[#F1F7FE] p-1 rounded-lg w-auto h-12.25">
                  <button onClick={() => handleFilterChange('audience', 'FREE_SURFERS')}
                    className={`px-6 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      filters.audience === 'FREE_SURFERS' ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    Free Surfers
                  </button>
                  <button onClick={() => handleFilterChange('audience', 'SCHOOLS')}
                    className={`px-6 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      filters.audience === 'SCHOOLS' ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    Escuelas
                  </button>
                </div>

                {/* Buscador */}
                <div className="relative w-70">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Image src="/icons/search.svg" alt="Buscar" width={15} height={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar playa o escuela..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-11 pr-5 py-3 focus:outline-none focus:border-gray-900 bg-white"
                  />
                </div>

                {/* Dropdown Hora */}
                <div className="relative w-full md:w-55">
                  {/* ... tu código del dropdown de hora (ya lo tenías) ... */}
                  <div onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition">
                    <span className="text-gray-700">
                      {filters.timeFrom && filters.timeTo 
                        ? `${filters.timeFrom} - ${filters.timeTo}` 
                        : "Seleccionar hora"}
                    </span>
                    <Image src='/icons/flechaabajo.svg' width={20} height={20} alt='flecha' />
                  </div>

                  {showTimeDropdown && (
                    <div onClick={(e) => e.stopPropagation()} className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                          <CustomTimeSelect value={filters.timeFrom} onChange={(v) => handleFilterChange('timeFrom', v)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                          <CustomTimeSelect value={filters.timeTo} onChange={(v) => handleFilterChange('timeTo', v)} />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button onClick={() => {
                          handleFilterChange('timeFrom', '');
                          handleFilterChange('timeTo', '');
                          setShowTimeDropdown(false);
                        }} className="flex-1 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50">
                          Limpiar
                        </button>
                        <button onClick={() => setShowTimeDropdown(false)} className="flex-1 py-2.5 bg-[#0D2744] text-white rounded-xl hover:bg-[#0a1f35]">
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown Estados */}
                <div className="relative w-full md:w-56">
                  <div
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
                  >
                    <span className="text-gray-700">
                      {filters.status ? getStatusLabel(filters.status) : "Todos los estados"}
                    </span>
                    <Image src='/icons/flechaabajo.svg' width={20} height={20} alt='flecha' />
                  </div>

                  {showStatusDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl py-2" onClick={(e) => e.stopPropagation()}>
                      {['', 'DRAFT', 'PROCESSING', 'ACTIVE', 'DISABLED'].map((status) => (
                        <div
                          key={status || 'all'}
                          onClick={() => {
                            handleFilterChange('status', status);
                            setShowStatusDropdown(false);
                          }}
                          className={`px-5 py-3 hover:bg-gray-50 cursor-pointer text-sm ${
                            filters.status === status ? 'bg-blue-50 text-[#0D2744] font-medium' : 'text-gray-700'
                          }`}
                        >
                          {status === '' ? 'Todos los estados' : getStatusLabel(status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fecha */}
                <input
                  type="date"
                  value={filters.sessionDate}
                  onChange={(e) => handleFilterChange('sessionDate', e.target.value)}
                  className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:border-gray-900 w-full md:w-auto"
                />
              </div>
            </div>

              {/* Grid de Sesiones */}
              {filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSessions.map((session) => (
                    <Link href={`/shot/sesion/${session.id}`} key={session.id} className="group">
                      <div className="relative rounded-3xl overflow-hidden bg-black shadow hover:shadow-xl transition">
                        {session.images?.[0]?.publicUrl ? (
                          <img
                            src={session.images[0].publicUrl}
                            alt={session.title}
                            className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full aspect-[16/10] bg-gray-800 flex items-center justify-center text-6xl">🌊</div>
                        )}

                        <div className="absolute top-3 right-3 bg-[#0F172A] px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                          <Image src={'/icons/camara.svg'} width={16} height={16} alt='hora' />{session.photoCount}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-5 text-white">
                          <div className="text-xs mt-2 inline-block px-3 py-1 bg-[#0F172A] rounded-full">
                            {session.status}
                          </div>
                          <p className="font-semibold">{session.title}</p>
                          <p className="text-sm opacity-90">{session.location || session.schoolName}</p>
                          <p className="text-xs opacity-75">{session.startTime} - {session.endTime}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl">
                  <p className="text-gray-500">No se encontraron sesiones con los filtros aplicados.</p>
                </div>
              )}

              {/* Paginación */}
              {/* Paginación - Estilo idéntico a Mis Ventas */}
              {pagination.totalPages > 1 && (
                <div className="bg-white rounded-3xl shadow-sm mt-10">
                  <div className="flex items-center justify-between px-8 py-6 ">
                    <p className="text-lg font-medium text-gray-900">
                      Página {filters.page} de {pagination.totalPages}
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
                        onClick={() => goToPage(filters.page - 1)}
                        disabled={!pagination.hasPreviousPage}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                      >
                        ‹
                      </button>

                      <button
                        onClick={() => goToPage(filters.page + 1)}
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
          </>
        ) : (
          /* ==================== EMPTY STATE (como en tu foto) ==================== */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Image
              src="/crearPrimerAlbum.svg"
              alt="Sin sesiones"
              width={120}
              height={120}
              className="mx-auto mb-6 opacity-75"
            />
            <h4 className="text-2xl font-medium text-gray-800 mb-3">Crea tu primer álbum</h4>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Sube tu primer álbum para empezar a vender tus mejores capturas
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              <span className="text-2xl">+</span> Crear álbum
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}