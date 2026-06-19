'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2.5">
        <div className="h-4 w-3/4 rounded bg-white/30" />
        <div className="h-3 w-1/2 rounded bg-white/30" />
        <div className="h-3 w-1/3 rounded bg-white/30" />
      </div>
    </div>
  );
}

const CustomTimeSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const times = [];
  for (let h = 6; h <= 23; h++) {
    times.push(`${h.toString().padStart(2, '0')}:00`);
    times.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Hs.'}</span>
        <Image src='/icons/flechaAbajo.svg' width={18} height={18} alt='↓' />
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1">
          {times.map((time) => (
            <div
              key={time}
              onClick={() => { onChange(time); setOpen(false); }}
              className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm ${value === time ? 'bg-blue-50 font-medium text-[#0D2744]' : 'text-gray-700'}`}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusLabel = (status) => {
  switch (status?.toUpperCase()) {
    case 'DRAFT': return 'Borrador';
    case 'PROCESSING': return 'En proceso';
    case 'ACTIVE': return 'Publicada';
    case 'DISABLED': return 'Desactivada';
    default: return status || 'Desconocido';
  }
};

// ← Todos con el mismo color de fondo
const getStatusColor = () => 'bg-[#0D2744] text-white';

// ← Nueva función para calcular expiración
const getExpiryInfo = (activeUntil) => {
  if (!activeUntil) return null;
  const today = new Date();
  const expiry = new Date(activeUntil);
  const diffDays = Math.ceil((expiry - today) / (1000 * 3600 * 24));

  if (diffDays <= 0) return { label: 'Expira hoy', urgent: true };
  if (diffDays === 1) return { label: 'Expira mañana', urgent: true };
  if (diffDays <= 10) return { label: `Expira en ${diffDays} días`, urgent: true };
  return { label: `Expira en ${diffDays} días`, urgent: false };
};

export default function MisSesionesTable({
  sessions,
  loading,
  pagination,
  onFilterChange,
  onPageChange,
  filters,
  onDelete,
  onCopyLink,
  openMenuId,
  setOpenMenuId,
  copiedId,
  sessionLinkBase = '/shot/sesion',
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);


// Refs para detectar clics fuera
const timeDropdownRef = useRef(null);
const statusDropdownRef = useRef(null);

 // Cerrar dropdowns al hacer clic fuera
useEffect(() => {
  const handleClickOutside = (event) => {
    if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
      setShowTimeDropdown(false);
    }
    if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
      setShowStatusDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  const filteredSessions = useMemo(() => {
    let result = sessions;
    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(s =>
        s.title?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term) ||
        s.schoolName?.toLowerCase().includes(term)
      );
    }
    if (filters.timeFrom && filters.timeTo) {
      result = result.filter(s => {
        const start = s.startTime?.slice(0, 5);
        return start && start >= filters.timeFrom && start <= filters.timeTo;
      });
    }
    return result;
  }, [sessions, filters.search, filters.timeFrom, filters.timeTo]);

  return (
    <>
      {/* ── FILTROS ── */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex w-full gap-6 flex-wrap flex-col md:flex-row items-start">

          <div className="flex bg-[#F1F7FE] p-1 rounded-lg w-auto h-12.25">
            {['FREE_SURFERS', 'SCHOOLS'].map((aud) => (
              <button
                key={aud}
                onClick={() => onFilterChange('audience', aud)}
                className={`px-6 py-2.5 rounded-lg text-[14px] cursor-pointer font-medium transition-all ${
                  filters.audience === aud ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {aud === 'FREE_SURFERS' ? 'Free Surfers' : 'Escuelas'}
              </button>
            ))}
          </div>

          <div className="relative w-70">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Image src="/icons/search.svg" alt="Buscar" width={15} height={15} />
            </div>
            <input
              type="text"
              placeholder={filters.audience === 'FREE_SURFERS' ? 'Buscar playa...' : 'Buscar escuela...'}
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-11 pr-5 py-3 focus:outline-none focus:border-gray-900 bg-white"
            />
          </div>

          <div className="relative w-full md:w-55" ref={timeDropdownRef}>
  <div
    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
  >
    <span className="text-gray-700">
      {filters.timeFrom && filters.timeTo ? `${filters.timeFrom} - ${filters.timeTo}` : 'Seleccionar hora'}
    </span>
    <Image src='/icons/flechaAbajo.svg' width={20} height={20} alt='flecha' />
  </div>
            {showTimeDropdown && (
              <div onClick={(e) => e.stopPropagation()} className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                    <CustomTimeSelect value={filters.timeFrom} onChange={(v) => onFilterChange('timeFrom', v)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                    <CustomTimeSelect value={filters.timeTo} onChange={(v) => onFilterChange('timeTo', v)} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { onFilterChange('timeFrom', ''); onFilterChange('timeTo', ''); setShowTimeDropdown(false); }} className="flex-1 py-2.5 text-gray-600 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">Limpiar</button>
                  <button onClick={() => setShowTimeDropdown(false)} className="flex-1 py-2.5 bg-[#0D2744] text-white rounded-xl hover:bg-[#0a1f35] cursor-pointer">Aplicar</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full md:w-56" ref={statusDropdownRef}>
  <div
    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
  >
    <span className="text-gray-700">{filters.status ? getStatusLabel(filters.status) : 'Todos los estados'}</span>
    <Image src='/icons/flechaAbajo.svg' width={20} height={20} alt='flecha' />
  </div>

  {showStatusDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl py-2" onClick={(e) => e.stopPropagation()}>
                {['', 'DRAFT', 'PROCESSING', 'ACTIVE', 'DISABLED'].map((s) => (
                  <div
                    key={s || 'all'}
                    onClick={() => { onFilterChange('status', s); setShowStatusDropdown(false); }}
                    className={`px-5 py-3 hover:bg-gray-50 cursor-pointer text-sm ${filters.status === s ? 'bg-blue-50 text-[#0D2744] font-medium' : 'text-gray-700'}`}
                  >
                    {s === '' ? 'Todos los estados' : getStatusLabel(s)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full md:w-auto">
  <input
    type="date"
    value={filters.sessionDate || ''}
    onChange={(e) => onFilterChange('sessionDate', e.target.value)}
    className="border border-gray-300 rounded-lg pl-5 pr-11 py-3 focus:outline-none focus:border-gray-900 w-full md:w-auto [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
  />
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
    <Image src="/icons/calendario.svg" width={18} height={18} alt="fecha" />
  </div>
</div>
        </div>
      </div>

      {/* ── GRID ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0,1,2,3,4,5].map((i) => <CardSkeleton key={i} delay={i * 100} />)}
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const expiry = getExpiryInfo(session.activeUntil);

            return (
              <div key={session.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <Link href={`${sessionLinkBase}/${session.id}`}>
                  <div className="relative">
                    {session.images?.[0]?.publicUrl ? (
                      <img
                        src={session.images[0].publicUrl}
                        alt={session.title}
                        className="w-full aspect-16/10 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full aspect-16/10 bg-gray-800 flex items-center justify-center text-6xl">🌊</div>
                    )}

                    {/* Badges top-right */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      {/* Badge expiración — rojo si urgente */}
                      {expiry && (
                        <div className={`text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          expiry.urgent ? 'bg-red-600' : 'bg-[#0F172A]'
                        }`}>
                          <Image src='/icons/hour.svg' width={14} height={14} alt='hora' />
                          {expiry.label}
                        </div>
                      )}
                      {/* Badge fotos */}
                      <div className="bg-[#0F172A] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Image src='/icons/camara.svg' width={16} height={16} alt='fotos' />
                        {session.photoCount} fotos
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
                      {/* Estado — todos con bg-[#0D2744] */}
                      <div className={`text-xs inline-block px-3 py-1 rounded-full mb-2 ${getStatusColor()}`}>
                        {getStatusLabel(session.status)}
                      </div>
                      <p className="font-semibold text-lg">{session.titleShort}</p>
                      <p className="text-sm opacity-90">{session.location || session.schoolName}</p>
                      <p className="text-xs opacity-75 mt-1">{session.startTime} - {session.endTime}</p>
                    </div>
                  </div>
                </Link>

                {/* Menú tres puntos */}
               {setOpenMenuId && (
                  <>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(openMenuId === session.id ? null : session.id); }}
                      className="absolute cursor-pointer bottom-10 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition z-10"
                    >
                      ⋮
                    </button>
                    {openMenuId === session.id && (
                      <div className="absolute top-14 right-4 bg-white rounded-2xl shadow-xl py-2 w-56 z-20 border border-gray-100" onClick={(e) => e.stopPropagation()}>
                        {session.status !== 'DRAFT' && onCopyLink && (
                          <button
                            onClick={() => onCopyLink(session.id)}
                            className={`w-full text-left px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-all ${copiedId === session.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}
                          >
                            <Image src={copiedId === session.id ? '/icons/check.svg' : '/icons/copiar.svg'} alt='copiar' width={20} height={20} />
                            {copiedId === session.id ? '¡Copiado!' : 'Copiar link'}
                          </button>
                        )}
                        <Link href={`${sessionLinkBase}/${session.id}`} onClick={() => setOpenMenuId(null)} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                          <Image src='/icons/editar2.svg' alt='editar' width={20} height={20} />
                          Editar sesión
                        </Link>
                        <button
                          onClick={() => { onDelete(session); setOpenMenuId(null); }}
                          className="w-full cursor-pointer text-left px-5 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 border-t border-gray-100 mt-1 pt-2"
                        >
                          <Image src='/icons/redtrash.svg' alt='eliminar' width={20} height={20} />
                          Eliminar sesión
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No se encontraron sesiones con los filtros aplicados.</p>
        </div>
      )}

      {/* ── PAGINACIÓN ── */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-3xl shadow-sm mt-12 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6">
            <p className="text-lg font-medium text-[#10487C]">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <button onClick={() => onPageChange(1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">«</button>
              <button onClick={() => onPageChange(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">‹</button>
              <button onClick={() => onPageChange(pagination.page + 1)} disabled={!pagination.hasNextPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">›</button>
              <button onClick={() => onPageChange(pagination.totalPages)} disabled={!pagination.hasNextPage} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition">»</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}