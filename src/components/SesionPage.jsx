'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MisSesionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingImageId, setDeletingImageId] = useState(null);
const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
const [imageToDelete, setImageToDelete] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef(null);
  // Form data para editar
  const [formData, setFormData] = useState({
    audience: '',
    location: '',
    schoolName: '',
    startTime: '',
    endTime: '',
    unitPriceCustomerEur: 0,
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
          
    setFormData({
  audience: data.audience || 'FREE_SURFERS',
  location: data.location || '',
  schoolName: data.schoolName || '',
  startTime: data.startTime ? data.startTime.slice(0, 5) : '',
  endTime: data.endTime ? data.endTime.slice(0, 5) : '',
  unitPriceCustomerEur: data.pricing?.unitPriceCustomerEur || 
                       data.pricing?.unitPricePhotographerEur || 5,
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
const handlePublish = async () => {
  if (!session) return;

  setPublishing(true);
  setErrorMessage('');

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
  const updatedSession = await res.json();
  setSession(updatedSession);
  
  setSuccessMessage("¡Sesión publicada correctamente!");
  setShowSuccess(true);

  // Opcional: ocultar el mensaje después de 4 segundos
  setTimeout(() => setShowSuccess(false), 4000);
} else {
      const errorData = await res.json().catch(() => ({}));
      
      if (res.status === 409) {
        alert('Esta sesión ya fue publicada.');
      } else if (res.status === 400) {
        alert(errorData.message || 'Faltan requisitos: precio o fotos mínimas.');
      } else {
        alert(errorData.message || 'No se pudo publicar la sesión');
      }
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión al publicar');
  } finally {
    setPublishing(false);
  }
};
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
  setSuccessMessage("Sesión eliminada correctamente");
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
  const handleDeleteImage = async () => {
  if (!imageToDelete) return;

  setDeletingImageId(imageToDelete.id);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const res = await fetch(
      `${API_URL}/api/v1/photo-sessions/${id}/images/${imageToDelete.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      // Actualizar la sesión localmente (sin recargar toda la página)
      setSession(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageToDelete.id),
        photoCount: prev.photoCount - 1,
      }));

      setShowDeleteImageModal(false);
    } else {
      alert('No se pudo eliminar la foto');
    }
  } catch (err) {
    console.error(err);
    alert('Error al eliminar la foto');
  } finally {
    setDeletingImageId(null);
    setImageToDelete(null);
  }
};
const handleUploadImages = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  if (files.length > 20) {
    alert("Máximo 20 fotos por subida");
    return;
  }

  setUploading(true);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);   // ← Campo correcto según tu API
    });

    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const updatedSession = await res.json();
      
      setSession(updatedSession); // Actualizamos toda la sesión con la respuesta
      
      setSuccessMessage(`${files.length} foto(s) subidas correctamente`);
      setShowSuccess(true);
      
      // Ocultar mensaje después de 4 segundos
      setTimeout(() => setShowSuccess(false), 4000);

    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.message || "Error al subir las fotos");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión al subir las fotos");
  } finally {
    setUploading(false);
    e.target.value = ''; // Limpiar input
  }
};
 const handleUpdate = async () => {
  setUpdating(true);
  setErrorMessage('');

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      audience: formData.audience,
      location: formData.location || null,
      schoolName: formData.schoolName || null,
      startTime: formData.startTime,
      endTime: formData.endTime,
      unitPriceCustomerEur: Number(formData.unitPriceCustomerEur),   // ← Cambiado aquí
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
      setSuccessMessage("Sesión actualizada correctamente");
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
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <span className="text-gray-300">›</span>
          <div className="h-4 w-52 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Botones Skeleton */}
        <div className="flex justify-end gap-3 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Banner Grande Skeleton */}
        <div className="relative h-105 rounded-3xl overflow-hidden mb-10 bg-gray-200 animate-pulse">
          <div className="absolute bottom-10 left-10 space-y-3">
            <div className="h-12 w-96 bg-gray-300/80 rounded-lg animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-300/80 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Info publicación */}
        <div className="flex justify-between mb-10">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Precio y Packs Skeleton */}
        <div className="bg-[#F1F7FE] rounded-3xl p-8 mb-12">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="border border-gray-200 rounded-2xl p-5 bg-white">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Galería Skeleton */}
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
              >
                {/* Número falso */}
                <div className="absolute bottom-3 right-3 h-5 w-5 bg-gray-300/70 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
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
          <span className="text-gray-900">{session.titleShort}</span>
          <span>›</span>
          <span className="text-gray-900">{session.location || session.schoolName}</span>
        </div>
        <div className='w-full flex-col md:flex-row flex justify-between'>
          <div><p className='text-[24px] font-medium text-[#10487C] pb-5 md:pb-0'>Detalle de la Sesión</p></div>
{/* Botones de acción */}
<div className="flex justify-end gap-3 mb-8 flex-wrap">

  {/* Copiar Link - Solo mostrar si NO es borrador */}
  {session.status !== 'DRAFT' && (
    <button
      onClick={() => {
        const shareUrl = `https://spotshot-rho.vercel.app/sesiones/${id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          setIsLinkCopied(true);
          setTimeout(() => setIsLinkCopied(false), 2500);
        });
      }}
      className={`flex items-center cursor-pointer gap-2 border px-5 py-2.5 rounded-xl transition-all duration-200 ${
        isLinkCopied 
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

  {/* Eliminar */}
  <button
    onClick={() => setShowDeleteModal(true)}
    className="flex items-center cursor-pointer gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition"
  >
    <img src='/icons/trashwhite.svg' alt="eliminar" className="w-5 h-5" />
    <span className="hidden md:inline">Eliminar</span>
  </button>

  {/* Editar */}
  <button
    onClick={() => setShowEditModal(true)}
    className="flex items-center cursor-pointer gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition"
  >
    <img src='/icons/editar.svg' alt="editar" className="w-5 h-5" />
    <span className="hidden md:inline">Editar</span>
  </button>

  {/* Publicar - Solo en DRAFT */}
  {session.status === 'DRAFT' && (
    <button
      onClick={handlePublish}
      disabled={publishing}
      className="flex cursor-pointer items-center gap-2 bg-[#103457] hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl transition font-medium disabled:opacity-70"
    >
      {publishing ? (
        <>Publicando<span className="animate-pulse">...</span></>
      ) : (
        <>Publicar Sesión</>
      )}
    </button>
  )}

</div>
          </div>
        {/* Banner grande */}
       
          {/* <img
            src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
            alt={session.title}
            fill
            className="object-cover"
          /> */}
         \<div className="relative rounded-3xl overflow-hidden h-80 mb-10">
              <img src="/banner-surf.png" alt="Sesión" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-5xl font-bold mb-2">{session.titleShort}</h1>
            <p className="text-2xl opacity-90">{session.location || session.schoolName}</p>
<p className="text-sm opacity-90 mt-1">{session.startTime} - {session.endTime}</p>
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
           <p className="text-5xl font-bold">
  €{session.pricing?.unitPriceCustomerEur || session.pricing?.unitPriceCustomer || 0}
</p>  </div>
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
        {/* Galería de fotos */}
<div>
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl font-semibold">
      {session.photoCount} fotos en esta sesión
    </h3>

    {/* Botón Subir más fotos - Solo en DRAFT */}
    {session.status === 'DRAFT' && (
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex  items-center cursor-pointer gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition disabled:opacity-70"
      >
        {uploading ? (
          <>Subiendo fotos...</>
        ) : (
          <>
            <img src="/icons/trashwhite.svg" alt="subir" className="w-5 h-5" />
            Subir más fotos
          </>
        )}
      </button>
    )}

    {/* Input oculto */}
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/jpeg,image/png,image/webp"
      className="hidden"
      onChange={handleUploadImages}
    />
  </div>

  {/* Grid de imágenes */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {session.images.map((img, index) => (
      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
        <img
          src={img.publicUrl}
          alt={`Foto ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />

        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {index + 1}
        </div>

        <button
          onClick={() => {
            setImageToDelete(img);
            setShowDeleteImageModal(true);
          }}
          className="absolute top-3 cursor-pointer right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
        >
          <img src='/icons/trashwhite.svg' alt="eliminar" className="w-4 h-4" />
        </button>
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
                className="flex-1 py-3 border cursor-pointer border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 cursor-pointer text-white rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
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
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, location: e.target.value, schoolName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
    value={formData.unitPriceCustomerEur ?? ''}   // ← Corregido
    onChange={(e) => setFormData({ 
      ...formData, 
      unitPriceCustomerEur: e.target.value 
    })}
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
                className="flex-1 py-3 bg-gray-900 cursor-pointer text-white rounded-2xl font-medium hover:bg-black disabled:opacity-70"
              >
                {updating ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== MENSAJE DE ÉXITO ==================== */}
    {/* MENSAJE DE ÉXITO DINÁMICO */}
{showSuccess && (
  <div className="fixed bottom-8 right-8 bg-[#103457] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50">
    <span className="text-2xl">✅</span>
    <span className="font-medium">{successMessage}</span>
  </div>
)}
      {/* Modal Eliminar Foto Individual */}
{showDeleteImageModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
      <h3 className="text-2xl font-semibold mb-4">¿Eliminar esta foto?</h3>
      <p className="text-gray-600 mb-8">
        Esta acción no se puede deshacer.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowDeleteImageModal(false)}
          className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleDeleteImage}
          disabled={deletingImageId}
          className="flex-1 py-3 bg-red-600 cursor-pointer text-white rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
        >
          {deletingImageId ? 'Eliminando...' : 'Sí, eliminar foto'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}