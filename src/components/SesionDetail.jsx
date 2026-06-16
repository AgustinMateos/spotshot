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
// Función para formatear precios correctamente
// Función para formatear precios (mejorada)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl"><Image src='/icons/logo.svg' width={120} alt='logo' height={120} /></div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  const firstImage = session.images?.[0]?.publicUrl || '/banner-surf.png';

 // Dentro del componente
const minSwipeDistance = 50;

const onTouchStart = (e) => {
  setTouchEnd(0);
  setTouchStart(e.targetTouches[0].clientX);
};

const onTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > minSwipeDistance;
  const isRightSwipe = distance < -minSwipeDistance;

  if (isLeftSwipe) {
    goToNext();
  } else if (isRightSwipe) {
    goToPrevious();
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
            className="bg-white/90 hover:bg-white text-black px-5 py-2 rounded-full flex items-center gap-2 transition"
          >
            ← Volver
          </button>
        </div>

        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-5xl font-bold mb-2">{session.title}</h1>
          <p className="text-xl opacity-90">{session.location || session.schoolName}</p>
          <p className="text-sm opacity-75 mt-1">by {photographerName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Precio y Packs */}
        <div className="bg-[#F1F7FE] rounded-3xl p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-sm text-[#0D2744]">Precio por foto</p>
              <p className="text-5xl font-bold text-[#0D2744]">€{unitPrice}</p>
            </div>
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
          <div className="absolute top-3 right-3 z-10">
            {inCart ? (
              <button
                className="bg-emerald-600 text-white w-9 h-9 flex items-center justify-center rounded-2xl shadow-lg cursor-default"
                title="Ya está en el carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ← Importante: evita abrir el lightbox
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
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 z-200 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-semibold">Tu selección ({totalPhotos})</h3>
              <button onClick={() => setIsCartOpen(false)}>
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
                  <button onClick={() => removeFromCart(img.id)} className="text-red-500">
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
    className="w-full bg-[#1F2937] hover:bg-black text-white py-4 rounded-2xl mt-6 font-medium text-lg transition"
  >
    Finalizar compra
  </button>
</div>
          </div>
        </div>
      )}

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
        className="bg-white rounded-3xl overflow-hidden shadow-2xl relative touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={(e) => setTouchStart(e.clientX)}
        onMouseUp={(e) => {
          setTouchEnd(e.clientX);
          const distance = touchStart - e.clientX;
          if (distance > 50) goToNext();
          if (distance < -50) goToPrevious();
        }}
      >
        <img
          src={session.images[currentIndex].publicUrl}
          alt={`Foto ${currentIndex + 1}`}
          className="w-full max-h-[75vh] object-cover mx-auto select-none"
          draggable={false}
        />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/30 text-5xl font-bold -rotate-12 tracking-widest">SPOTSHOT</span>
        </div>

        {/* Flechas (solo visibles en desktop) */}
        <button 
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full hover:bg-white transition"
        >
          <ChevronLeft size={36} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full hover:bg-white transition"
        >
          <ChevronRight size={36} />
        </button>

        {/* Botón Agregar al carrito */}
        {/* Botón Agregar al carrito - Versión optimizada para mobile */}
<div className="absolute bottom-4 md:bottom-8 right-0 md:left-1/2 -translate-x-1/2 z-10">
  {isInCart(session.images[currentIndex].id) ? (
    <button
      className="bg-emerald-600 text-white px-5 md:px-10 py-3 md:py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
      <span className="hidden md:inline">Foto agregada</span>
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
      <span className="hidden md:inline">Agregar al carrito</span>
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
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                ← Volver a la selección de fotos
              </button>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)} 
                className="text-gray-400 hover:text-black"
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
                className="w-full bg-[#1F2937] hover:bg-black disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-medium transition"
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
    </div>
  );
}