'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShotPage() {
  const { user, token, loading: authLoading } = useAuth();
  
  const [stripeConnect, setStripeConnect] = useState(null);
  const [allSessions, setAllSessions] = useState([]); // Todas las sesiones del backend
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',           // Búsqueda instantánea (client-side)
    audience: '',
    status: '',
    location: '',
    sessionDate: '',
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

  // Cargar Mis Sesiones (solo cuando cambian filtros del backend)
  useEffect(() => {
    const loadMySessions = async () => {
      if (!token) return;
      setLoadingSessions(true);

      const params = new URLSearchParams();
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
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
        setLoadingSessions(false);
      }
    };
    loadMySessions();
  }, [token, filters.audience, filters.status, filters.location, filters.sessionDate, filters.page]);

  // Filtrado instantáneo (client-side) - Sin loading al escribir
  const filteredSessions = useMemo(() => {
    if (!filters.search.trim()) return allSessions;

    const term = filters.search.toLowerCase().trim();
    return allSessions.filter(session =>
      session.title?.toLowerCase().includes(term) ||
      session.location?.toLowerCase().includes(term) ||
      session.schoolName?.toLowerCase().includes(term)
    );
  }, [allSessions, filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value, 
      page: 1 
    }));
  };

  const goToPage = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const isStripeReady = stripeConnect?.isReady === true;
  const alias = user?.alias || 'Fotógrafo';

  if (authLoading || loadingProfile || loadingSessions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
                  className={`px-6 py-3 rounded-xl font-medium transition inline-flex items-center gap-3 ${
                    isStripeReady 
                      ? 'bg-gray-900 text-white hover:bg-black' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xl">+</span>
                  Crear sesión
                </Link>
              </div>

              <div className="hidden md:block">
                <Image height={183} width={280} alt="stripe steps" src="/icons/stripeSteps.svg"/>
              </div>
            </div>
          )}
        </div>

        {/* ====================== MIS SESIONES ====================== */}
      

        {isStripeReady ? (
            /* ==================== LISTA DE SESIONES ==================== */
            <>
                <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Mis sesiones ({filteredSessions.length})</h3>
            <Link 
              href="/shot/newAlbum" 
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black"
            >
              <span className="text-xl">+</span> Crear nueva sesión
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Buscar por título, playa o escuela..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="lg:col-span-2 border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500"
            />

            <select 
              onChange={(e) => handleFilterChange('audience', e.target.value)} 
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Todas las audiencias</option>
              <option value="FREE_SURFERS">Free Surfers</option>
              <option value="SCHOOLS">Escuelas</option>
            </select>

            <select 
              onChange={(e) => handleFilterChange('status', e.target.value)} 
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Todos los estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="ACTIVE">Activa</option>
              <option value="DISABLED">Desactivada</option>
            </select>

            <input
              type="date"
              value={filters.sessionDate}
              onChange={(e) => handleFilterChange('sessionDate', e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
            />
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

                    <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                      📸 {session.photoCount}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-5 text-white">
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
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => goToPage(filters.page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-5 py-2 border rounded-xl disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="px-6 py-2">
                Página {filters.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => goToPage(filters.page + 1)}
                disabled={!pagination.hasNextPage}
                className="px-5 py-2 border rounded-xl disabled:opacity-50"
              >
                Siguiente →
              </button>
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