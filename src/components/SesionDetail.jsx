'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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

  const unitPrice = session?.pricing?.unitPriceCustomer || 8;

  const totalPhotos = cart.length;
  const subtotal = totalPhotos * unitPrice;

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

  const closeLightbox = () => setIsLightboxOpen(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? session.images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === session.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  const firstImage = session.images?.[0]?.publicUrl || '/banner-surf.png';

 
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
      <div className="relative h-[500px] w-full">
        <img src={firstImage} alt={session.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Selecciona tus fotos</h2>
            <p className="text-gray-500">{session.photoCount} fotos</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {session.images.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img src={img.publicUrl} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/30 text-5xl font-bold rotate-[-12deg] tracking-widest">SPOTSHOT</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-end">
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
                  <span>€{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{packName}</span>
                    <span>-€{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-4 border-t">
                  <span>Total a pagar</span>
                  <span>€{totalToPay.toFixed(0)}</span>
                </div>
              </div>

                            {/* Botón que abre el modal */}
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
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center">
          <div className="relative w-full max-w-5xl px-4">
            <button onClick={closeLightbox} className="absolute -top-4 -right-4 bg-white text-black rounded-full p-3 shadow-lg z-10">
              <X size={28} />
            </button>

            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src={session.images[currentIndex].publicUrl}
                alt={`Foto ${currentIndex + 1}`}
                className="w-full max-h-[75vh] object-contain mx-auto"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/30 text-5xl font-bold rotate-[-12deg] tracking-widest">SPOTSHOT</span>
              </div>

              <button onClick={goToPrevious} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full">
                <ChevronLeft size={36} />
              </button>
              <button onClick={goToNext} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full">
                <ChevronRight size={36} />
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => addToCart(session.images[currentIndex], session)}
                  className="bg-[#1F2937] hover:bg-black text-white px-10 py-4 rounded-2xl text-lg flex items-center gap-3 shadow-xl transition"
                >
                  <ShoppingCart size={24} />
                  Agregar al carrito
                </button>
              </div>
            </div>
      
            <div className="text-center text-white mt-4 text-sm">
              {currentIndex + 1} / {session.images.length}
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE EMAIL + CHECKOUT */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4">
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