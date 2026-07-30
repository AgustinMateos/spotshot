'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CustomDatePicker from '@/components/CustomDatePicker';

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
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
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

export default function EscuelaCantabraDeSurfPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeFilterRef = useRef(null);
  const fileInputRef = useRef(null);

  // Face search
  const [faceMatches, setFaceMatches] = useState(null); // null = no búsqueda activa
  const [isFaceSearching, setIsFaceSearching] = useState(false);
  const [faceError, setFaceError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [filters, setFilters] = useState({
    audience: 'SCHOOLS',
    schoolName: 'Escuela Cantabra de Surf',
    sessionDate: '',
    timeFrom: '',
    timeTo: '',
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeFilterRef.current && !timeFilterRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado en cliente (horario)
  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (filters.timeFrom && filters.timeTo) {
      result = result.filter((s) => {
        const start = s.startTime?.slice(0, 5);
        return start && start >= filters.timeFrom && start <= filters.timeTo;
      });
    }

    return result;
  }, [sessions, filters.timeFrom, filters.timeTo]);

  const getDaysRemaining = (activeUntil) => {
    if (!activeUntil) return null;
    const today = new Date();
    const expiryDate = new Date(activeUntil);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    return `Expira en ${diffDays} días`;
  };

  // Cargar sesiones normales
  useEffect(() => {
    // Si hay resultados de face search, no cargamos la lista normal
    if (faceMatches !== null) return;

    const fetchPublicSessions = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      params.append('audience', 'SCHOOLS');
      params.append('schoolName', 'Escuela Cantabra de Surf');
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
      if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
      if (filters.timeTo) params.append('timeTo', filters.timeTo);
      params.append('page', pagination.page);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(
          `${API_URL}/api/v1/public/photo-sessions?${params.toString()}`
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

    fetchPublicSessions();
  }, [filters, pagination.page, faceMatches]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ==================== FACE SEARCH ====================
  const handleFaceSearch = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
      setFaceError('Formato no válido. Usá JPEG, PNG, WebP o HEIC.');
      return;
    }

    setIsFaceSearching(true);
    setFaceError('');
    setFaceMatches(null);

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/public/face-search`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setFaceError(data.message || 'No se detectó un rostro válido en la imagen.');
        } else {
          setFaceError(data.message || 'Error al buscar. Intentá de nuevo.');
        }
        return;
      }

      // data.matches = array de fotos que coinciden
      setFaceMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      setFaceError('Error de conexión. Intentá de nuevo.');
    } finally {
      setIsFaceSearching(false);
      // Limpiamos el input para poder subir la misma foto otra vez si quieren
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFaceSearch = () => {
    setFaceMatches(null);
    setFaceError('');
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
            {value || 'Hs.'}
          </span>
          <Image src="/icons/flechaAbajo.svg" width={18} height={18} alt="↓" />
        </div>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
            {times.map((time) => (
              <div
                key={time}
                onClick={() => handleSelect(time)}
                className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm ${
                  value === time
                    ? 'bg-blue-50 font-medium text-[#0D2744]'
                    : 'text-gray-700'
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
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-[24px] font-medium text-[#10487C] pb-5 md:pb-0">
            Escuela Cantabra de Surf
          </h1>
          <p className="text-gray-600 text-[16px] mt-1">
            {faceMatches !== null
              ? `${faceMatches.length} foto${faceMatches.length !== 1 ? 's' : ''} encontrada${faceMatches.length !== 1 ? 's' : ''}`
              : `${pagination.total} álbumes encontrados`}
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm">
          <div className="flex flex-wrap gap-4 items-start">
            {/* Filtro de Hora */}
            <div className="relative w-full md:w-80" ref={timeFilterRef}>
              <div
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
              >
                <span className="text-gray-700">
                  {filters.timeFrom && filters.timeTo
                    ? `${filters.timeFrom} - ${filters.timeTo}`
                    : 'Seleccionar hora'}
                </span>
                <Image
                  src="/icons/flechaAbajo.svg"
                  width={20}
                  height={20}
                  alt="flecha"
                />
              </div>

              {showTimeDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl p-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desde
                      </label>
                      <CustomTimeSelect
                        value={filters.timeFrom}
                        onChange={(v) => handleFilterChange('timeFrom', v)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hasta
                      </label>
                      <CustomTimeSelect
                        value={filters.timeTo}
                        onChange={(v) => handleFilterChange('timeTo', v)}
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
                      className="flex-1 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fecha */}
            <div className="relative w-full md:w-auto">
              <CustomDatePicker
                value={filters.sessionDate}
                onChange={(date) => handleFilterChange('sessionDate', date)}
                placeholder="Seleccionar fecha"
                className="w-full md:w-56"
              />
            </div>

            {/* ====== BOTÓN FACE SEARCH ====== */}
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                ref={fileInputRef}
                onChange={handleFaceSearch}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isFaceSearching}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isFaceSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Buscando...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Buscar por selfie
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Botón limpiar face search */}
            {faceMatches !== null && (
              <button
                onClick={clearFaceSearch}
                className="px-5 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {/* Error de face search */}
          {faceError && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
              {faceError}
            </div>
          )}
        </div>

        {/* ==================== RESULTADOS ==================== */}

        {/* Modo Face Search */}
        {faceMatches !== null ? (
          faceMatches.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <img src="/icons/logo.webp" width={40} height={40} alt="logo" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No encontramos coincidencias
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No hay fotos en el catálogo que coincidan con el rostro de la selfie.
              </p>
              <button
                onClick={clearFaceSearch}
                className="mt-6 px-6 py-3 bg-[#1F2937] text-white rounded-2xl hover:bg-black transition cursor-pointer"
              >
                Volver a las sesiones
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {faceMatches.map((match) => (
                <Link
                  href={`/sesiones/${match.sessionId}`}
                  key={match.imageId}
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm"
                >
                  <img
                    src={match.publicUrl}
                    alt="Coincidencia"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-medium truncate">
                      {match.sessionTitleShort || 'Sesión'}
                    </p>
                    <p className="text-white/80 text-[11px]">
                      {Math.round((match.similarity || 0) * 100)}% coincidencia
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : /* Modo normal (sesiones) */
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <CardSkeleton key={i} delay={i * 100} />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <img src="/icons/logo.webp" width={40} height={40} alt="logo" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No se encontraron sesiones
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filters.sessionDate || filters.timeFrom
                ? 'Prueba con otros filtros o fechas diferentes.'
                : 'Todavía no hay sesiones disponibles de esta escuela.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const daysLeft = getDaysRemaining(session.activeUntil);

              return (
                <Link
                  href={`/sesiones/${session.id}`}
                  key={session.id}
                  className="group"
                >
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
                        <img
                          src="/icons/logo.webp"
                          width={20}
                          height={20}
                          alt="logo"
                        />
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      {daysLeft && (
                        <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <Image
                            src="/icons/hour.svg"
                            width={16}
                            height={16}
                            alt="hora"
                          />
                          {daysLeft}
                        </div>
                      )}
                      <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Image
                          src="/icons/camara.svg"
                          width={16}
                          height={16}
                          alt="camara"
                        />
                        {session.photoCount} fotos
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-5 text-white">
                      <p className="font-semibold text-lg">
                        {session.titleShort}
                      </p>
                      <p className="text-sm opacity-90">
                        {session.location || session.schoolName}
                      </p>
                      <p className="text-sm opacity-90">
                        {session.startTime} - {session.endTime}
                      </p>
                      <p className="text-sm opacity-90">
                        by{' '}
                        {session.photographer?.alias ||
                          (session.photographer?.firstName &&
                          session.photographer?.lastName
                            ? `${session.photographer.firstName} ${session.photographer.lastName}`
                            : 'Fotógrafo')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Paginación (solo en modo normal) */}
        {faceMatches === null && pagination.totalPages > 1 && (
          <div className="bg-white rounded-3xl shadow-sm mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6">
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