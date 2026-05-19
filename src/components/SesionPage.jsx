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
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
  // Form data para editar
  const [formData, setFormData] = useState({
    audience: '',
    location: '',
    schoolName: '',
    startTime: '',
    endTime: '',
    unitPricePhotographerEur: 0,
  });

  // Cargar detalle
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
          // Inicializar form
          // Inicializar form (corregido)
setFormData({
  audience: data.audience || 'FREE_SURFERS',
  location: data.location || '',
  schoolName: data.schoolName || '',
  startTime: data.startTime ? data.startTime.slice(0, 5) : '',   // ← CORREGIDO
  endTime: data.endTime ? data.endTime.slice(0, 5) : '',         // ← CORREGIDO
  unitPricePhotographerEur: data.pricing?.unitPricePhotographerEur || 5,
});
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
  const handleUpdate = async () => {
  setUpdating(true);
  setErrorMessage('');   // si ya tienes errorMessage

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      audience: formData.audience,
      location: formData.location || null,
      schoolName: formData.schoolName || null,
      startTime: formData.startTime,           // ya está en HH:mm
      endTime: formData.endTime,               // ya está en HH:mm
      unitPricePhotographerEur: Number(formData.unitPricePhotographerEur),
    };

    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowEditModal(false);
      setShowSuccess(true);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const errorData = await res.json().catch(() => ({}));
      setErrorMessage(errorData.message || 'Error al actualizar la sesión');
    }
  } catch (err) {
    console.error(err);
    setErrorMessage('Error de conexión');
  } finally {
    setUpdating(false);
  }
};

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Sesión no encontrada</div>;

  const photographerName = session.photographer?.firstName && session.photographer?.lastName
    ? `${session.photographer.firstName} ${session.photographer.lastName}`
    : session.photographer?.alias || 'Fotógrafo';
    // Funciones para calcular días
const getDaysSincePublished = (publishedAt) => {
  if (!publishedAt) return 0;
  const published = new Date(publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now - published);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDaysUntil = (activeUntil) => {
  if (!activeUntil) return 0;
  const until = new Date(activeUntil);
  const now = new Date();
  const diffTime = until - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/shot/misSesiones" className="hover:text-gray-900">Mis sesiones</Link>
          <span>›</span>
          <span className="text-gray-900">{session.title}</span>
        </div>
<div className='w-full flex justify-between'> 
  <div><p className='text-center'>Detalle de la Sesión</p></div>
   {/* Botones de acción */}
        <div className="flex justify-end gap-3 mb-8">
          <button 
    onClick={() => {
      const shareUrl = `https://spotshot-rho.vercel.app/sesiones/${id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        
      });
    }}
    className="flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition"
  > <img src='/icons/copiar.svg'/>Copiar link
          </button>
          
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700"
          >
           <img src='/icons/eliminar.svg'/> Eliminar
          </button>

          <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black"
          >
            <img src='/icons/editar.svg'/>Editar
          </button>
        </div></div>
        {/* Banner grande */}
        <div className="relative h-[420px] rounded-3xl overflow-hidden mb-10">
          {/* <img
            src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
            alt={session.title}
            fill
            className="object-cover"
          /> */}
           <img
            src={'/banner-surf.png' || '/placeholder-surf.jpg'}
            alt={session.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl font-bold mb-2">{session.title}</h1>
            <p className="text-2xl opacity-90">{session.location || session.schoolName}</p>
            
          </div>
        </div>

      

        {/* Info publicación y expiración */}
       {/* Info publicación y expiración */}
<div className="flex justify-between gap-8 mb-10 text-sm w-full">
  <p className="text-gray-600">
    Publicado hace {getDaysSincePublished(session.publishedAt)} días
  </p>
  
  {session.activeUntil && (
    <div className="flex items-center gap-2">
      <span>
        <img height={16} width={16} alt='hour' src='/icons/timeout.svg' />
      </span>
      <span className="text-[#EF4444]">
        Expira en {getDaysUntil(session.activeUntil)} días
      </span>
    </div>
  )}
</div>

        {/* Precio y Packs */}
        <div className="bg-[#F1F7FE] rounded-3xl p-8 mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-gray-500">Precio por foto</p>
              <p className="text-5xl font-bold">€{session.pricing?.unitPriceCustomer || 8}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-4">Packs activos</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {session.pricing?.packs
    ?.filter(pack => pack.enabledByPhotographer === true) // Solo los que el fotógrafo activó
    .map(pack => (
      <div key={pack.packId} className="border border-gray-200 rounded-2xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">{pack.label}</p>
            <p className="text-sm text-gray-500">{pack.photoQuantity} fotos</p>
          </div>
          <div className="text-right">
            <span className="text-green-600 font-medium">-{pack.discountPercent}% OFF</span>
            <p className="text-xs text-gray-500 mt-1">
              €{pack.effectivePricePerPhoto || '—'} / foto
            </p>
          </div>
        </div>
      </div>
    ))}

  {/* Mensaje si no hay packs activos */}
  {(!session.pricing?.packs || 
    session.pricing.packs.filter(p => p.enabledByPhotographer).length === 0) && (
    <p className="text-gray-500 italic col-span-full py-4">
      No tienes packs activos en esta sesión
    </p>
  )}
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
{showEditModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4">
      <h3 className="text-2xl font-semibold mb-6">Editar Sesión</h3>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo</label>
          <select 
            value={formData.audience} 
            onChange={(e) => setFormData({...formData, audience: e.target.value})}
            className="w-full border border-gray-300 rounded-xl p-3"
          >
            <option value="FREE_SURFERS">Free Surfers</option>
            <option value="SCHOOLS">Escuelas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ubicación / Escuela</label>
          <input 
            type="text" 
            value={formData.location || formData.schoolName} 
            onChange={(e) => setFormData({...formData, location: e.target.value, schoolName: e.target.value})}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Ej: Bristol o Surf School"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hora Inicio</label>
            <input 
              type="time" 
              value={formData.startTime} 
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="w-full border border-gray-300 rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hora Fin</label>
            <input 
              type="time" 
              value={formData.endTime} 
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              className="w-full border border-gray-300 rounded-xl p-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Precio por foto (€)</label>
          <input 
            type="number" 
            step="0.5"
            min="1"
            value={formData.unitPricePhotographerEur} 
            onChange={(e) => setFormData({...formData, unitPricePhotographerEur: e.target.value})}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => { setShowEditModal(false); setErrorMessage(''); }}
          className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black disabled:opacity-70"
        >
          {updating ? 'Guardando...' : 'Guardar cambios'}
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