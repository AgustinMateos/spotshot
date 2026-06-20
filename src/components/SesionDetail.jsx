'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function SesionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useCart();
const [showPhotographerModal, setShowPhotographerModal] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);
const [isLinkCopied, setIsLinkCopied] = useState(false);
const [scale, setScale] = useState(1);
const [lastTap, setLastTap] = useState(0);
const [pinchStartDistance, setPinchStartDistance] = useState(null);
const [translate, setTranslate] = useState({ x: 0, y: 0 });
const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  // Cargar sesión
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions/${id}`);
        const data = await res.json();

        if (res.ok) {
          setSession(data);
        } else {
          router.push('/sesiones');
        }
      } catch (err) {
        console.error(err);
        router.push('/sesiones');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSession();
  }, [id, router]);


useEffect(() => {
  if (isLightboxOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isLightboxOpen]);

  const unitPrice = session?.pricing?.unitPriceCustomer || 8;

  const totalPhotos = cart.length;
  const subtotal = totalPhotos * unitPrice;
// Función para verificar si una foto ya está en el carrito
const isInCart = (imageId) => {
  return cart.some(item => item.id === imageId);
};
  let discount = 0;
  let packName = '';
  if (totalPhotos >= 10) {
    discount = subtotal * 0.40;
    packName = 'Pack 10 fotos (-40%)';
  } else if (totalPhotos >= 5) {
    discount = subtotal * 0.20;
    packName = 'Pack 5 fotos (-20%)';
  }
  const totalToPay = subtotal - discount;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };
  useEffect(() => {
  setScale(1);
  setTranslate({ x: 0, y: 0 });
}, [currentIndex, isLightboxOpen]);
const getDistance = (touches) => {
  const [t1, t2] = touches;
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
};
  // ==================== NAVEGACIÓN CON TECLADO ====================
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!isLightboxOpen) return;

    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [isLightboxOpen, currentIndex, session?.images?.length]); // Dependencias importantes

  const closeLightbox = () => setIsLightboxOpen(false);
// Función para formatear precios 
const formatPrice = (price) => {
  if (price == null) return '0';

  const num = Number(price);
  if (isNaN(num)) return '0';

  // Si es número entero → sin decimales
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Si tiene decimales → mostrar hasta 2, pero quitar ceros innecesarios
  return num.toFixed(2).replace(/\.?0+$/, '');
};
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? session.images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === session.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl"><Image src='/icons/logo.webp' width={120} alt='logo' height={120} /></div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  const firstImage = session.images?.[0]?.publicUrl || '/banner-surf.png';

 // Dentro del componente
const minSwipeDistance = 50;

const onTouchStart = (e) => {
  if (e.touches.length === 2) {
    // Empieza pinch
    setPinchStartDistance(getDistance(e.touches));
    return;
  }

  // Doble tap para zoom
  const now = Date.now();
  if (now - lastTap < 300) {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
    setLastTap(0);
    return;
  }
  setLastTap(now);

  if (scale > 1) {
    // Si está con zoom, preparamos el pan
    setPanStart({
      x: e.targetTouches[0].clientX - translate.x,
      y: e.targetTouches[0].clientY - translate.y,
    });
  } else {
    // Si no hay zoom, preparamos el swipe normal
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  }
};

const onTouchMove = (e) => {
  if (e.touches.length === 2 && pinchStartDistance) {
    // Pinch to zoom
    const newDistance = getDistance(e.touches);
    const delta = newDistance / pinchStartDistance;
    const newScale = Math.min(Math.max(1, scale * delta), 4);
    setScale(newScale);
    return;
  }

  if (scale > 1 && e.touches.length === 1) {
    // Pan: mover la imagen con el dedo
    const newX = e.targetTouches[0].clientX - panStart.x;
    const newY = e.targetTouches[0].clientY - panStart.y;

    // Límite de movimiento para que no se vaya demasiado lejos
    const maxOffset = 150 * (scale - 1);
    const clampedX = Math.min(Math.max(newX, -maxOffset), maxOffset);
    const clampedY = Math.min(Math.max(newY, -maxOffset), maxOffset);

    setTranslate({ x: clampedX, y: clampedY });
    return;
  }

  // Swipe normal solo si no hay zoom
  if (scale === 1 && e.touches.length === 1) {
    setTouchEnd(e.targetTouches[0].clientX);
  }
};

const onTouchEnd = (e) => {
  if (e.touches.length === 0) {
    setPinchStartDistance(null);
  }

  if (scale < 1.1) {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }

  // Swipe solo si no está con zoom
  if (scale === 1) {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    else if (isRightSwipe) goToPrevious();
  }
};


    // ✅ Función para finalizar compra
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      imageIds: cart.map(item => item.id),
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
        // Opcional: guardar temporalmente en localStorage por si Stripe no pasa los params
        localStorage.setItem('lastOrder', JSON.stringify({
          orderId: data.orderId,
          email: buyerEmail,
          imageCount: cart.length
        }));

        window.location.href = data.checkoutUrl;
      }else {
        alert('No se recibió la URL de pago');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Banner grande */}
      <div className="relative h-125 w-full">
        <img src={firstImage} alt={session.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/70" />

        <div className="absolute top-6 left-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white/90 cursor-pointer hover:bg-white text-black px-5 py-2 rounded-full flex items-center gap-2 transition"
          >
            ← Volver
          </button>
        </div>

        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-5xl font-bold mb-2">{session.titleShort}</h1>
          <p className="text-xl opacity-90">{session.location || session.schoolName}</p>
          
          <p className="text-sm opacity-90 mt-1">{session.startTime} - {session.endTime}</p>
       <p className="text-sm opacity-90">
                    by{' '}
                    {session.photographer?.alias ||
                      (session.photographer?.firstName && session.photographer?.lastName
                        ? `${session.photographer.firstName} ${session.photographer.lastName}`
                        : 'Fotógrafo')}
                  </p>  </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Precio y Packs */}
        <div className="bg-[#F1F7FE] rounded-3xl p-8 mb-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-sm text-[#0D2744]">Precio por foto</p>
              <p className="text-5xl font-bold text-[#0D2744]">€{unitPrice}</p>
            </div>
             {/* Copiar Link - Solo mostrar si NO es borrador */}
            {session.status !== 'DRAFT' && (
              <button
                onClick={() => {
                  const shareUrl = `https://www.spotshot.app/sesiones/${id}`;
                  navigator.clipboard.writeText(shareUrl).then(() => {
                    setIsLinkCopied(true);
                    setTimeout(() => setIsLinkCopied(false), 2500);
                  });
                }}
                className={`flex items-center cursor-pointer gap-2 border px-5 py-2.5 rounded-xl transition-all duration-200 ${isLinkCopied
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 hover:bg-gray-50'
                  }`}
                disabled={isLinkCopied}
              >
                <img
                  src={isLinkCopied ? '/icons/check.svg' : '/icons/copiar.svg'}
                  alt="copiar"
                  className="w-5 h-5"
                />
                <span className="hidden md:inline font-medium">
                  {isLinkCopied ? '¡Copiado!' : 'Copiar link'}
                </span>
              </button>
            )}
          </div>

          {/* Packs */}
          {session.pricing?.packs?.filter(p => p.enabledByPhotographer).length > 0 && (
            <div>
              <p className="text-sm text-[#0D2744] mb-4 font-medium">Comprá más, paga menos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.pricing.packs
                  .filter(pack => pack.enabledByPhotographer)
                  .map((pack) => (
                    <div key={pack.packId} className="bg-white rounded-2xl p-6 border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{pack.label}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {pack.photoQuantity} fotos • Ahorras {pack.discountPercent}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">
                            €{pack.effectivePricePerPhoto?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

       {/* Galería */}
<div>
  <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
    <h2 className="text-3xl font-semibold">Selecciona tus fotos</h2>
    <p className="text-gray-500">{session.photoCount} fotos</p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {session.images.map((img, index) => {
      const inCart = isInCart(img.id);

      return (
        <div
          key={img.id}
          className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
        >
          {/* Imagen - Click para abrir lightbox */}
          <div onClick={() => openLightbox(index)} className="w-full h-full">
            <img 
              src={img.publicUrl} 
              alt={`Foto ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          </div>

          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* Número de foto */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {index + 1}
          </div>

          {/* BOTÓN AGREGAR AL CARRITO - Superior Derecho */}
          {/* BOTÓN CARRITO - Superior Derecho */}
<div className="absolute top-3 right-3 z-10">
  {inCart ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        removeFromCart(img.id);
      }}
      className="bg-emerald-600 cursor-pointer hover:bg-red-600 text-white w-9 h-9 flex items-center justify-center rounded-2xl shadow-lg transition hover:scale-110 active:scale-95"
      title="Quitar del carrito"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  ) : (
    <button
  onClick={(e) => {
    e.stopPropagation();
    
    // Verificar si ya hay fotos de otro fotógrafo
    if (cart.length > 0 && cart[0].photographerId !== session.photographer?.id) {
      setShowPhotographerModal(true);
      return;
    }

    addToCart(img, session);
  }}
  className="bg-white/95 hover:bg-white text-[#1F2937] w-9 h-9 flex items-center justify-center rounded-2xl shadow-lg transition hover:scale-110 active:scale-95"
  title="Agregar al carrito"
>
  <ShoppingCart size={18} />
</button>
  )}
</div>
        </div>
      );
    })}
  </div>
</div>
      </div>

      {/* CARRITO FLOTANTE */}
      {cart.length > 0 && (
        <div
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-[#1F2937] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-black transition z-50"
        >
          <ShoppingCart size={24} />
          <div>
            <p className="font-medium">Carrito • €{totalToPay.toFixed(0)}</p>
            <p className="text-sm opacity-75">{totalPhotos} fotos</p>
          </div>
          <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalPhotos}
          </div>
        </div>
      )}

      {/* DRAWER DEL CARRITO */}
      {/* DRAWER DEL CARRITO */}
<div
  className={`fixed inset-0 z-200 flex justify-end transition-opacity duration-300 ${
    isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}
>
  {/* Overlay oscuro */}
  <div
    className="absolute inset-0 bg-black/70"
    onClick={() => setIsCartOpen(false)}
  />

  {/* Panel del carrito */}
  <div
    className={`relative bg-white w-full max-w-md h-full overflow-auto transition-transform duration-300 ease-out ${
      isCartOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
  >
    <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
      <h3 className="text-2xl font-semibold">Tu selección ({totalPhotos})</h3>
      <button className='cursor-pointer ' onClick={() => setIsCartOpen(false)}>
        <X size={28} />
      </button>
    </div>

    <div className="p-6 space-y-4">
      {cart.map((img, idx) => (
        <div key={img.id} className="flex gap-4 bg-gray-50 rounded-2xl p-3">
          <img src={img.publicUrl} className="w-20 h-20 object-cover rounded-xl" alt="" />
          <div className="flex-1">
            <p className="font-medium">Foto {idx + 1}</p>
            <p className="text-sm text-gray-500">{img.sessionTitle}</p>
            <p className="text-xs text-gray-400">{img.location}</p>
          </div>
          <button onClick={() => removeFromCart(img.id)} className="text-red-500 cursor-pointer">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>

    <div className="p-6 border-t bg-gray-50">
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
        onClick={() => setIsCheckoutModalOpen(true)}
        className="w-full cursor-pointer transition-all active:scale-95 bg-[#1F2937] hover:bg-black text-white py-4 rounded-2xl mt-6 font-medium text-lg transition"
      >
        Finalizar compra
      </button>
    </div>
  </div>
</div>

{/* LIGHTBOX */}
{isLightboxOpen && session && (
  <div 
    className="fixed inset-0 bg-black/90 z-100 flex items-center justify-center"
    onClick={closeLightbox}           // ← Cierra al tocar fuera
  >
    <div 
      className="relative w-full max-w-5xl px-4"
      onClick={(e) => e.stopPropagation()}   // ← Evita que se cierre al tocar adentro
    >
      {/* Contenedor de la foto */}
     <div 
  className="rounded-3xl overflow-hidden shadow-2xl relative touch-none"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
      <img
  src={session.images[currentIndex].publicUrl}
  alt={`Foto ${currentIndex + 1}`}
  className="rounded-3xl max-h-[75vh] object-cover md:object-contain mx-auto select-none"
  style={{
    transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
    transition: scale === 1 ? 'transform 0.15s ease-out' : 'none',
  }}
  draggable={false}
/>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className=" font-bold -rotate-12 tracking-widest"><Image src='/icons/logo.webp' width={60} height={60} alt='logo'/></div>
        </div>

        {/* Flechas (solo visibles en desktop) */}
        {/* Flechas - visibles en mobile y desktop */}
{/* Flechas - visibles en mobile y desktop */}
<button 
  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
  onTouchStart={(e) => e.stopPropagation()}
  onTouchEnd={(e) => e.stopPropagation()}
  className="flex items-center justify-center absolute cursor-pointer left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:p-4 rounded-full hover:bg-white transition z-30"
>
  <ChevronLeft className="w-6 h-6 md:w-9 md:h-9" />
</button>
<button 
  onClick={(e) => { e.stopPropagation(); goToNext(); }}
  onTouchStart={(e) => e.stopPropagation()}
  onTouchEnd={(e) => e.stopPropagation()}
  className="flex items-center justify-center absolute cursor-pointer right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:p-4 rounded-full hover:bg-white transition z-30"
>
  <ChevronRight className="w-6 h-6 md:w-9 md:h-9" />
</button>

        {/* Botón Agregar al carrito */}
        {/* Botón Agregar al carrito - Versión optimizada para mobile */}
{/* Botón Agregar al carrito - Versión optimizada */}
<div className="absolute bottom-4 md:bottom-1 left-[340px] md:left-1/2 -translate-x-1/2 z-10">
  {isInCart(session.images[currentIndex].id) ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        removeFromCart(session.images[currentIndex].id);
      }}
      className="bg-emerald-600 hover:bg-red-600 text-white px-5 md:px-10 py-3 md:py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl transition active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
      <span className="hidden md:inline cursor-pointer">Quitar del carrito</span>
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(session.images[currentIndex], session);
      }}
      className="bg-[#1F2937] hover:bg-black text-white px-5 md:px-10 py-3 md:py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl transition active:scale-95"
    >
      <ShoppingCart size={26} />
      <span className="hidden md:inline cursor-pointer">Agregar al carrito</span>
    </button>
  )}
</div>
      </div>

      {/* Indicador de foto */}
      <div className="text-center text-white mt-4 text-sm pointer-events-none">
        {currentIndex + 1} / {session.images.length}
      </div>
    </div>
  </div>
)}
      {/* MODAL DE EMAIL + CHECKOUT */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-300 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
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
              <h2 className="text-2xl font-semibold mb-2">Ingresa tu correo electrónico</h2>
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
                className="w-full transition-all active:scale-95 cursor-pointer bg-[#1F2937] hover:bg-black disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-medium transition"
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
      {/* MODAL - RESTRICCIÓN DE FOTÓGRAFO */}
{showPhotographerModal && (
  <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
      <div className="p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">⚠️</span>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-gray-900">
          Atención
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          En esta versión solo podés comprar fotos de un mismo fotógrafo en un solo pago.
        </p>
        
        <p className="text-sm text-gray-500 mt-4">
          Para comprar fotos de otro fotógrafo, primero finalizá esta compra.
        </p>
      </div>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => setShowPhotographerModal(false)}
          className="w-full py-4 bg-[#1F2937] text-white rounded-2xl font-medium hover:bg-black transition"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}