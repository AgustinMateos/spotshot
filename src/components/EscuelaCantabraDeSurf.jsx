'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  QrCode,
  Search,
  Images,
  ScanFace,
  ArrowRight,
} from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';
import { useCart } from '@/contexts/CartContext';

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

const STEPS = [
  {
    number: 1,
    icon: QrCode,
    title: 'Entra',
    text: 'Escanea el QR o entra al enlace de tu escuela.',
  },
  {
    number: 2,
    icon: Search,
    title: 'Busca',
    text: 'Busca tus fotos por reconocimiento facial.',
  },
  {
    number: 3,
    icon: Images,
    title: 'Encuentra',
    text: 'Te mostramos todas las fotos de tu sesión.',
  },
  {
    number: 4,
    icon: ShoppingCart,
    title: 'Compra y descarga',
    text: 'Elige tus favoritas y descárgalas en alta calidad.',
  },
];

export default function EscuelaCantabraDeSurfPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeFilterRef = useRef(null);
  const fileInputRef = useRef(null);

  // Face search
  const [faceMatches, setFaceMatches] = useState(null);
  const [isFaceSearching, setIsFaceSearching] = useState(false);
  const [faceError, setFaceError] = useState('');

  // Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxSession, setLightboxSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cart
  const { cart, addToCart, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Bloquear scroll
  useEffect(() => {
    if (isLightboxOpen || isCartOpen || isCheckoutModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, isCartOpen, isCheckoutModalOpen]);

  // Navegación con teclado en lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentIndex, lightboxImages.length]);

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

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)
    ) {
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

      setFaceMatches(data.sessions || []);
    } catch (err) {
      console.error(err);
      setFaceError('Error de conexión. Intentá de nuevo.');
    } finally {
      setIsFaceSearching(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFaceSearch = () => {
    setFaceMatches(null);
    setFaceError('');
  };

  // ==================== LIGHTBOX ====================
  const openLightbox = (session, matchIndex) => {
    setLightboxSession(session);
    setLightboxImages(session.matches || []);
    setCurrentIndex(matchIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setLightboxSession(null);
    setCurrentIndex(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === lightboxImages.length - 1 ? 0 : prev + 1
    );
  };

  // ==================== CART ====================
  const isInCart = (imageId) => {
    return cart.some((item) => item.id === imageId);
  };

  const handleAddFromFaceSearch = (match, session) => {
    const imageForCart = {
      id: match.imageId,
      publicUrl: match.publicUrl,
    };

    const sessionForCart = {
      id: session.sessionId,
      title: session.title,
      titleShort: session.titleShort,
      location: session.location,
      schoolName: session.schoolName,
      photographer: {
        ...session.photographer,
        id: session.photographer?.id || session.photographer?.alias,
      },
    };

    if (
      cart.length > 0 &&
      cart[0].photographerId &&
      sessionForCart.photographer?.id &&
      cart[0].photographerId !== sessionForCart.photographer.id
    ) {
      alert('Solo podés comprar fotos de un mismo fotógrafo por compra.');
      return;
    }

    addToCart(imageForCart, sessionForCart);
  };

  // ==================== CHECKOUT ====================
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      imageIds: cart.map((item) => item.id),
      buyerEmail: buyerEmail.trim() || undefined,
    };

    try {
      const res = await fetch(`${API_URL}/api/v1/orders/checkout/from-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al crear el checkout');
        return;
      }

      if (data.checkoutUrl) {
        localStorage.setItem(
          'lastOrder',
          JSON.stringify({
            orderId: data.orderId,
            email: buyerEmail,
            imageCount: cart.length,
          })
        );
        window.location.href = data.checkoutUrl;
      } else {
        alert('No se recibió la URL de pago');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unitPrice = cart[0]?.unitPrice || cart[0]?.price || 8;
  const totalPhotos = cart.length;
  const subtotal = totalPhotos * unitPrice;

  let discount = 0;
  let packName = '';
  if (totalPhotos >= 10) {
    discount = subtotal * 0.4;
    packName = 'Pack 10 fotos (-40%)';
  } else if (totalPhotos >= 5) {
    discount = subtotal * 0.2;
    packName = 'Pack 5 fotos (-20%)';
  }
  const totalToPay = subtotal - discount;

  const formatPrice = (price) => {
    if (price == null) return '0';
    const num = Number(price);
    if (isNaN(num)) return '0';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2).replace(/\.?0+$/, '');
  };

  const totalFacePhotos = faceMatches
    ? faceMatches.reduce((acc, s) => acc + (s.matchCount || 0), 0)
    : 0;

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
      {/* ==================== TOPBAR ==================== */}
      <header className="bg-[#B4121B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
             <div className="w-60 h-20 flex items-center justify-center">
                          <Image 
                            src="/escuelaLogo.png"
                            alt="SpotShot"
                            width={400}
                            height={220}
                            className="w-full h-full object-cover"
                          />
                        </div>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 rounded-full px-5 py-2.5 transition cursor-pointer"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold tracking-wide">SURFSHOP</span>
            {totalPhotos > 0 && (
              <span className="bg-white text-[#B4121B] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalPhotos}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ==================== HERO IMAGEN ==================== */}
      <section className="relative">
        <div className="relative h-[340px] md:h-[420px] w-full">
          <Image
            src="/escuela.jpg"
            alt="Surfista en Playa de Somo"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/40 to-transparent md:from-white/95 md:via-white/10" />

          <div className="relative z-10 h-full mx-auto max-w-7xl px-6 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-[1.05] text-[#0D0D0D]">
              Encuentra
              <br />
              tus fotos
              <br />
              <span className="text-[#B4121B]">de surf</span>
            </h1>
            <p className="mt-4 text-gray-700 text-lg max-w-xs">
              Revive tu experiencia y comparte los mejores momentos.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CARD BÚSQUEDA POR SELFIE ==================== */}
      <section className="mx-auto max-w-3xl px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 shrink-0 rounded-full bg-[#B4121B] flex items-center justify-center">
            <ScanFace className="text-white" size={30} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-gray-900">Búsqueda por selfie</h3>
            <p className="text-gray-500 text-sm">
              Escanéate y encuentra todas tus fotos al instante con IA.
            </p>
          </div>

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
            className="w-full sm:w-auto shrink-0 bg-[#B4121B] hover:bg-[#8f0e15] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
          >
            {isFaceSearching ? 'BUSCANDO...' : 'BUSCAR POR SELFIE'}
          </button>
        </div>

        {faceError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            {faceError}
          </div>
        )}

        {faceMatches !== null && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={clearFaceSearch}
              className="px-5 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </section>

      {/* ==================== ASÍ FUNCIONA (solo si no hay búsqueda activa) ==================== */}
      {faceMatches === null && (
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-4">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[#B4121B] font-bold tracking-widest text-sm">
              ASÍ FUNCIONA
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map(({ number, icon: Icon, title, text }) => (
              <div key={number} className="flex flex-col items-center text-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#B4121B] text-white text-xs font-bold flex items-center justify-center">
                  {number}
                </span>
                <Icon className="text-[#B4121B]" size={34} strokeWidth={1.5} />
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500 max-w-[160px]">{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

   

      {/* Todo lo de abajo (contador, filtros, grilla, paginación) solo aparece
          después de una búsqueda por selfie */}
      {faceMatches !== null && (
      <div className="mx-auto px-6 py-8">
        {/* Contador de resultados */}
        <div className="mb-8">
          <p className="text-gray-600 text-[16px] mt-1">
            {`${totalFacePhotos} foto${totalFacePhotos !== 1 ? 's' : ''} encontrada${totalFacePhotos !== 1 ? 's' : ''} en ${faceMatches.length} sesión${faceMatches.length !== 1 ? 'es' : ''}`}
          </p>
        </div>

        {/* Filtros */}
        {/* <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm">
          <div className="flex flex-wrap gap-4 items-start">
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
                <Image src="/icons/flechaAbajo.svg" width={20} height={20} alt="flecha" />
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

            <div className="relative w-full md:w-auto">
              <CustomDatePicker
                value={filters.sessionDate}
                onChange={(date) => handleFilterChange('sessionDate', date)}
                placeholder="Seleccionar fecha"
                className="w-full md:w-56"
              />
            </div>
          </div>
        </div> */}

        {/* ==================== RESULTADOS ==================== */}
        {faceMatches.length === 0 ? (
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
            <div className="space-y-12">
              {faceMatches.map((session) => (
                <div key={session.sessionId}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0D2744]">
                        {session.titleShort || session.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {session.schoolName || session.location}
                        {session.startTime && (
                          <>
                            {' '}
                            · {session.startTime.slice(0, 5)} -{' '}
                            {session.endTime?.slice(0, 5)}
                          </>
                        )}
                        {session.photographer?.alias && (
                          <> · by {session.photographer.alias}</>
                        )}
                      </p>
                    </div>
                    <span className="self-start text-sm font-medium text-[#106BB9] bg-blue-50 px-3 py-1.5 rounded-full">
                      {session.matchCount} coincidencia
                      {session.matchCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {session.matches.map((match, matchIndex) => {
                      const inCart = isInCart(match.imageId);

                      return (
                        <div
                          key={match.imageId}
                          className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm cursor-pointer"
                        >
                          <div
                            onClick={() => openLightbox(session, matchIndex)}
                            className="w-full h-full"
                          >
                            <img
                              src={match.publicUrl}
                              alt="Coincidencia"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>

                          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                            <p className="text-white text-xs font-medium truncate">
                              {session.titleShort}
                            </p>
                            <p className="text-white/80 text-[11px]">
                              {Math.round((match.similarity || 0) * 100)}% coincidencia
                            </p>
                          </div>

                          <div className="absolute top-3 right-3 z-10">
                            {inCart ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(match.imageId);
                                }}
                                className="bg-emerald-600 hover:bg-red-600 text-white w-9 h-9 flex items-center justify-center rounded-2xl shadow-lg transition hover:scale-110 active:scale-95"
                                title="Quitar del carrito"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={4}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFromFaceSearch(match, session);
                                }}
                                className="bg-white/95 hover:bg-white text-[#1F2937] w-9 h-9 flex items-center justify-center rounded-2xl shadow-lg transition hover:scale-110 active:scale-95"
                                title="Agregar al carrito"
                              >
                                <ShoppingCart size={18} />
                              </button>
                            )}
                          </div>

                          <Link
                            href={`/sesiones/${session.sessionId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-3 left-3 z-10 bg-black/60 hover:bg-black/80 text-white text-[11px] px-2.5 py-1 rounded-full"
                          >
                            Ver sesión
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      )}

      {/* ==================== CARRITO FLOTANTE ==================== */}
      {cart.length > 0 && (
        <div
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-[#1F2937] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-black transition z-50"
        >
          <ShoppingCart size={24} />
          <div>
            <p className="font-medium">Carrito • €{formatPrice(totalToPay)}</p>
            <p className="text-sm opacity-75">
              {totalPhotos} foto{totalPhotos !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalPhotos}
          </div>
        </div>
      )}

      {/* ==================== DRAWER DEL CARRITO ==================== */}
      <div
        className={`fixed inset-0 z-[200] flex justify-end transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70"
          onClick={() => setIsCartOpen(false)}
        />

        <div
          className={`relative bg-white w-full max-w-md h-full overflow-auto transition-transform duration-300 ease-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-2xl font-semibold">Tu selección ({totalPhotos})</h3>
            <button className="cursor-pointer" onClick={() => setIsCartOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {cart.map((img, idx) => (
              <div key={img.id} className="flex gap-4 bg-gray-50 rounded-2xl p-3">
                <img
                  src={img.publicUrl}
                  className="w-20 h-20 object-cover rounded-xl"
                  alt=""
                />
                <div className="flex-1">
                  <p className="font-medium">Foto {idx + 1}</p>
                  <p className="text-sm text-gray-500">{img.sessionTitle}</p>
                  <p className="text-xs text-gray-400">{img.location}</p>
                </div>
                <button
                  onClick={() => removeFromCart(img.id)}
                  className="text-red-500 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 border-t bg-gray-50 sticky bottom-0">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({totalPhotos} fotos)</span>
                <span>€{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{packName}</span>
                  <span>-€{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold pt-4 border-t">
                <span>Total a pagar</span>
                <span>€{formatPrice(totalToPay)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutModalOpen(true);
              }}
              className="w-full cursor-pointer transition-all active:scale-95 bg-[#1F2937] hover:bg-black text-white py-4 rounded-2xl mt-6 font-medium text-lg"
            >
              Ir a pagar
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MODAL EMAIL + CHECKOUT ==================== */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setIsCartOpen(true);
                }}
                className="text-gray-500 cursor-pointer hover:text-gray-700 text-sm flex items-center gap-1"
              >
                ← Volver a la selección de fotos
              </button>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-gray-400 cursor-pointer hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-2">
                Ingresa tu correo electrónico
              </h2>
              <p className="text-gray-600 mb-6">
                Te enviaremos por mail las imágenes en alta calidad
              </p>

              <input
                type="email"
                placeholder="Ejemplo@gmail.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#1F2937] mb-8 text-base"
              />

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full transition-all active:scale-95 cursor-pointer bg-[#1F2937] hover:bg-black disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-medium"
              >
                {isSubmitting ? 'Procesando...' : 'Ir a pagar'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Checkout rápido con Stripe
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== LIGHTBOX ==================== */}
      {isLightboxOpen && lightboxImages.length > 0 && lightboxSession && (
        <div
          className="fixed inset-0 cursor-pointer bg-black/90 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg z-30 transition"
          >
            <X size={22} />
          </button>

          <div
            className="relative w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src={lightboxImages[currentIndex].publicUrl}
                alt={`Foto ${currentIndex + 1}`}
                className="rounded-3xl max-h-[75vh] object-cover md:object-contain mx-auto select-none"
                draggable={false}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image
                  src="/icons/logo.webp"
                  className="opacity-60"
                  width={60}
                  height={60}
                  alt="logo"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="flex items-center justify-center absolute cursor-pointer left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:p-4 rounded-full hover:bg-white transition z-30"
              >
                <ChevronLeft className="w-6 h-6 md:w-9 md:h-9" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="flex items-center justify-center absolute cursor-pointer right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:p-4 rounded-full hover:bg-white transition z-30"
              >
                <ChevronRight className="w-6 h-6 md:w-9 md:h-9" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                {isInCart(lightboxImages[currentIndex].imageId) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(lightboxImages[currentIndex].imageId);
                    }}
                    className="bg-emerald-600 hover:bg-red-600 text-white px-5 md:px-10 py-3 md:py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl transition active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="hidden md:inline">Quitar del carrito</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFromFaceSearch(
                        lightboxImages[currentIndex],
                        lightboxSession
                      );
                    }}
                    className="bg-[#1F2937] hover:bg-black text-white px-5 md:px-10 py-3 md:py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl transition active:scale-95"
                  >
                    <ShoppingCart size={26} />
                    <span className="hidden md:inline">Agregar al carrito</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-center text-white mt-4 text-sm pointer-events-none">
              {currentIndex + 1} / {lightboxImages.length}
              {lightboxSession.titleShort && (
                <span className="ml-2 opacity-70">· {lightboxSession.titleShort}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}