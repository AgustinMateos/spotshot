'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SesionDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  const firstImage = session.images?.[0]?.publicUrl || '/banner-surf.png';

  return (
    <div className="min-h-screen bg-white">
      {/* Banner grande */}
      <div className="relative h-[500px] w-full">
        <img
          src={firstImage}
          alt={session.title}
          className="w-full h-full object-cover"
        />
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
        {/* Precio y Packs Mejorado */}
<div className="bg-[#F1F7FE] rounded-3xl p-8 mb-12">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
    <div>
      <p className="text-sm text-[#0D2744]">Precio por foto</p>
      <p className="text-5xl font-bold text-[#0D2744]">
        €{session.pricing?.unitPriceCustomer || '8'}
      </p>
    </div>

    {/* <div className="text-right">
      <p className="text-sm text-gray-500">Commission SpotShot (25%)</p>
      <p className="text-sm text-gray-600">
        Tú recibes €{session.pricing?.unitPricePhotographerEur || '5'}
      </p>
    </div> */}
  </div>

  {/* Packs */}
  {session.pricing?.packs && session.pricing.packs.length > 0 && (
    <div>
      <p className="text-sm text-[#0D2744] mb-4 font-medium">Comprá más, paga menos</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {session.pricing.packs
          .filter(pack => pack.enabledByPhotographer === true)  // Solo packs activados
          .map((pack) => (
            <div 
              key={pack.packId} 
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{pack.label}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {pack.photoQuantity} fotos • Ahorras {pack.discountPercent}%
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    €{pack.effectivePricePerPhoto?.toFixed(2) || 
                       (pack.totalAfterDiscount / pack.photoQuantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por foto</p>
                </div>
              </div>

              {pack.totalAfterDiscount && (
                <p className="text-sm text-emerald-600 mt-3">
                  Total pack: €{pack.totalAfterDiscount}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  )}

  {/* Mensaje si no hay packs activos */}
  {session.pricing?.packs?.filter(p => p.enabledByPhotographer).length === 0 && (
    <p className="text-gray-500 italic text-center py-6">
      Este fotógrafo aún no ha activado packs promocionales.
    </p>
  )}
</div>

        {/* Galería Protegida */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Selecciona tus fotos</h2>
            <p className="text-gray-500">{session.photoCount} fotos</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {session.images.map((img, index) => (
              <div 
                key={img.id}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-sm select-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                <img
                  src={img.publicUrl}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable="false"
                />

                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Marca de agua */}
                <div className="absolute flex-col inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/30 text-5xl md:text-4xl font-bold rotate-[-12deg] tracking-widest select-none">
                    SPOTSHOT
                    
                     
                  </span> <img alt='logo' width={40} height={40} src='/icons/logo.svg'/>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}