'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SesionDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions/${id}`);
        const data = await res.json();

        if (res.ok) {
          setSession(data);
        } else {
          router.push('/sesiones'); // Redirigir si no existe
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

  const togglePhoto = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen grande */}
      <div className="relative h-[500px] w-full">
        <img
          src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
          alt={session.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white/90 text-black px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Galería de fotos */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Selecciona tus fotos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {session.images.map((img, index) => (
                <div 
                  key={img.id}
                  onClick={() => togglePhoto(img.id)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                    selectedPhotos.has(img.id) ? 'border-blue-600 scale-95' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.publicUrl}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {selectedPhotos.has(img.id) && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                      <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Precios y Packs */}
          <div>
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-8">
              <div className="mb-6">
                <p className="text-sm text-gray-500">Precio por foto</p>
                <p className="text-4xl font-bold">€{session.pricing?.unitPriceCustomer || '8'}</p>
              </div>

              <div className="space-y-4">
                {session.pricing?.packs?.map((pack) => (
                  <div key={pack.packId} className="bg-white p-4 rounded-2xl border">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{pack.label}</p>
                        <p className="text-sm text-gray-500">{pack.photoQuantity} fotos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">-{pack.discountPercent}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">Seleccionadas: <span className="font-semibold text-black">{selectedPhotos.size}</span> fotos</p>
                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium hover:bg-black transition">
                  Añadir al carrito • €{(selectedPhotos.size * (session.pricing?.unitPriceCustomer || 8)).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}