'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MisSesionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar detalle de la sesión
  useEffect(() => {
    if (!id || !token) return;

    const fetchSession = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me/photo-sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setSession(data);
        } else {
          router.push('/shot/misSesiones');
        }
      } catch (err) {
        console.error(err);
        router.push('/shot/misSesiones');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, token, router]);

  // Eliminar sesión
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photo-sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setShowDeleteModal(false);
        setShowSuccess(true);

        setTimeout(() => {
          router.push('/shot/misSesiones');
        }, 1800);
      } else {
        alert('No se pudo eliminar la sesión');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la sesión');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/shot/misSesiones" className="hover:text-gray-900">Mis sesiones</Link>
          <span>›</span>
          <span className="text-gray-900">{session.title}</span>
        </div>

        {/* Banner grande */}
        <div className="relative h-[420px] rounded-3xl overflow-hidden mb-10">
          <img
            src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
            alt={session.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl font-bold mb-2">{session.title}</h1>
            <p className="text-2xl opacity-90">{session.location || session.schoolName}</p>
            <p className="text-sm opacity-75 mt-1">by {photographerName}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mb-8">
          <button className="flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50">
            Copiar link
          </button>
          
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700"
          >
            Eliminar
          </button>

          <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black">
            Editar
          </button>
        </div>

        {/* Info publicación y expiración */}
        <div className="flex gap-8 mb-10 text-sm">
          <p className="text-gray-600">Publicado hace 12 días</p>
          <div className="flex items-center gap-2 text-amber-600">
            <span>⏰</span>
            <span>Expira en 17 días</span>
          </div>
        </div>

        {/* Precio y Packs */}
        <div className="bg-white rounded-3xl p-8 mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-gray-500">Precio por foto</p>
              <p className="text-5xl font-bold">€{session.pricing?.unitPriceCustomer || 8}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-4">Packs activos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.pricing?.packs?.map(pack => (
                <div key={pack.packId} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{pack.label}</p>
                      <p className="text-sm text-gray-500">{pack.photoQuantity} fotos</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-medium">-{pack.discountPercent}% OFF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Galería de fotos */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">{session.photoCount} fotos en esta sesión</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {session.images.map((img, index) => (
              <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={img.publicUrl}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== MODAL DE CONFIRMACIÓN ==================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-semibold mb-4">¿Eliminar esta sesión?</h3>
            <p className="text-gray-600 mb-8">
              Esta acción no se puede deshacer.<br />
              Se eliminarán todas las fotos y la sesión dejará de estar disponible.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar sesión'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MENSAJE DE ÉXITO ==================== */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50">
          <span className="text-2xl">✅</span>
          <span className="font-medium">Sesión eliminada correctamente</span>
        </div>
      )}
    </div>
  );
}