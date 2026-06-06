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
const [openMenuId, setOpenMenuId] = useState(null); // ID de la sesión cuyo menú está abierto
// Filtros
const [filters, setFilters] = useState({
  search: '',
  audience: 'FREE_SURFERS',   // ← Free Surfers por defecto
  status: '',
  location: '',
  sessionDate: '',
  timeFrom: '',   // ← nuevo
  timeTo: '',
});
const [showTimeDropdown, setShowTimeDropdown] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);        // ← Nuevo
const [deleteSuccess, setDeleteSuccess] = useState(false);
const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
const [sessionToDelete, setSessionToDelete] = useState(null);
const [copiedId, setCopiedId] = useState(null);
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
    if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
    if (filters.timeTo) params.append('timeTo', filters.timeTo);

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


// Filtrado local por búsqueda + horario (MEJORADO)
const filteredSessions = useMemo(() => {
  let result = sessions;

  // Filtro de búsqueda
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(s =>
      s.title?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term) ||
      s.schoolName?.toLowerCase().includes(term)
    );
  }

  // Filtro por horario - Solo sesiones que EMPIEZAN dentro del rango seleccionado
  if (filters.timeFrom && filters.timeTo) {
    result = result.filter(session => {
      const sessionStart = session.startTime?.slice(0, 5); // "12:30:00" → "12:30"

      if (!sessionStart) return false;

      // Comparación: startTime está entre timeFrom y timeTo
      return sessionStart >= filters.timeFrom && sessionStart <= filters.timeTo;
    });
  }

  return result;
}, [sessions, filters.search, filters.timeFrom, filters.timeTo]);
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const isStripeReady = stripeConnect?.isReady === true;
const handleDeleteSession = async (sessionId) => {
  if (!token || !sessionId) return;

  setIsDeleting(true);
  setDeleteSuccess(false);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setDeleteSuccess(true);        // ← Activamos el mensaje de éxito
    } else {
      alert('No se pudo eliminar la sesión');
    }
  } catch (err) {
    console.error(err);
    alert('Error al eliminar la sesión');
  } finally {
    setIsDeleting(false);
  }
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
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 py-10">

        <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8">
          <h1 className="text-[24px] font-medium text-[#10487C] pb-5 md:pb-0">Mis Sesiones</h1>

          <Link
            href={isStripeReady ? "/shot/newAlbum" : "#"}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 h-10 transition font-medium ${isStripeReady
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
            <span className="text-xl">+</span> Crear Sesión
          </Link>
        </div>

{/* Filtros */}
<div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
  <div className='flex w-full gap-6 flex-wrap flex-col md:flex-row items-start'>

    {/* Toggle Free Surfers / Escuelas */}
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
      <div
        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
        className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
      >
        <span className="text-gray-700">
          {filters.timeFrom && filters.timeTo 
            ? `${filters.timeFrom} - ${filters.timeTo}` 
            : "Seleccionar hora"}
        </span>
        <Image src='/icons/flechaabajo.svg' width={20} height={20} alt='flecha' />
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
      className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:border-gray-900 w-full md:w-auto"
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
        ) 
            : filteredSessions.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredSessions.map((session) => (
      <div key={session.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
        
        <Link href={`/shot/sesion/${session.id}`}>
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

            <div className="absolute top-3 right-3 bg-[#0F172A] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Image src={'/icons/camara.svg'} width={16} height={16} alt='fotos' /> 
              {session.photoCount} fotos
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-5 text-white">
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

        {/* BOTÓN DE TRES PUNTITOS */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(openMenuId === session.id ? null : session.id);
          }}
          className="absolute bottom-10 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition z-10"
        >
          ⋮
        </button>

        {/* DROPDOWN MENU */}
        {/* DROPDOWN MENU */}
{/* DROPDOWN MENU */}
{openMenuId === session.id && (
  <div 
    className="absolute top-14 right-4 bg-white rounded-2xl shadow-xl py-2 w-56 z-20 border border-gray-100"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Copiar Link - Solo si NO es borrador */}
    {/* Copiar Link - Solo si NO es borrador */}
{session.status !== 'DRAFT' && (
  <button
    onClick={() => {
      const shareUrl = `https://spotshot-rho.vercel.app/sesiones/${session.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedId(session.id);   // Activa el estado de copiado

        // Cerramos el menú después de 1.8 segundos para que veas el mensaje
        setTimeout(() => {
          setOpenMenuId(null);
          setCopiedId(null);
        }, 1800);
      });
    }}
    className={`w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 transition-all ${
      copiedId === session.id 
        ? 'bg-emerald-50 text-emerald-700 font-medium' 
        : 'text-gray-700'
    }`}
  >
    <Image 
      src={copiedId === session.id ? "/icons/check.svg" : "/icons/copiar.svg"} 
      alt="copiar" 
      width={20} 
      height={20} 
    />
    <span>
      {copiedId === session.id ? '¡Copiado!' : 'Copiar link'}
    </span>
  </button>
)}

    {/* Editar Sesión */}
    <Link 
      href={`/shot/sesion/${session.id}`} 
      onClick={() => setOpenMenuId(null)}
      className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 "
    >
      <Image src="/icons/editar2.svg" alt="editar" width={20} height={20} />
      <span>Editar sesión</span>
    </Link>

   {/* Eliminar Sesión */}
<button
  onClick={() => {
    setSessionToDelete(session);
    setShowDeleteConfirmModal(true);
    setOpenMenuId(null);
  }}
  className="w-full text-left px-5 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 border-t border-gray-100 mt-1 pt-2"
>
  <Image src="/icons/redtrash.svg" alt="eliminar" width={20} height={20} />
  <span>Eliminar sesión</span>
</button>
  </div>
)}
      </div>
    ))}
  </div>
)  : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No se encontraron sesiones con los filtros aplicados.</p>
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-3xl shadow-sm mt-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6">
              <p className="text-lg font-medium text-[#10487C]">
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
{/* ==================== MODAL CONFIRMAR ELIMINAR SESIÓN ==================== */}
{showDeleteConfirmModal && sessionToDelete && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
      
      {!deleteSuccess ? (
        // Estado inicial (confirmación)
        <>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🗑️</span>
          </div>
          
          <h3 className="text-2xl font-semibold mb-3">¿Eliminar esta sesión?</h3>
          <p className="text-gray-600 mb-8">
            Se eliminará permanentemente la sesión:<br />
            <strong>"{sessionToDelete.title}"</strong>
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setSessionToDelete(null);
                setDeleteSuccess(false);
              }}
              className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteSession(sessionToDelete.id)}
              disabled={isDeleting}
              className="flex-1 py-3.5 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </>
      ) : (
        // Estado de éxito
        <>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">✅</span>
          </div>
          
          <h3 className="text-2xl font-semibold mb-3 text-green-600">¡Sesión eliminada correctamente!</h3>
          <p className="text-gray-600 mb-8">
            La sesión "{sessionToDelete.title}" ha sido eliminada.
          </p>

          <button
            onClick={() => {
              setShowDeleteConfirmModal(false);
              setSessionToDelete(null);
              setDeleteSuccess(false);
            }}
            className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black"
          >
            Cerrar
          </button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}