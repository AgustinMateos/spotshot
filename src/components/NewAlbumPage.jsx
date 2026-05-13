'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NewAlbumPage = () => {
  const router = useRouter();
  const { token, logout, loading } = useAuth();

  const [step, setStep] = useState(1); // ← Cambiado a 1 para que empiece en Detalles
const [uploadedImages, setUploadedImages] = useState([]); // ← Para saber si ya se subieron
  const [formData, setFormData] = useState({
    type: 'free-surfers',
    school: '',
    location: '',
    date: '',
    startTime: '10:30',
    endTime: '11:30',
    basePrice: 5,
  selectedPacks: [],
  });
const [packsCatalog, setPacksCatalog] = useState([]);
const [isLoadingPacks, setIsLoadingPacks] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
const [uploading, setUploading] = useState(false);
const [sessionId, setSessionId] = useState(null);
const [creatingSession, setCreatingSession] = useState(false);

const [publishing, setPublishing] = useState(false);
// Cargar catálogo de packs
useEffect(() => {
  const loadPacks = async () => {
    if (!token) return;
    setIsLoadingPacks(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photo-sessions/packs/catalog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPacksCatalog(data);
    } catch (err) {
      console.error("Error cargando packs:", err);
    } finally {
      setIsLoadingPacks(false);
    }
  };

  loadPacks();
}, [token]);
// ====================== PUBLICAR SESIÓN ======================
const handlePublishSession = async () => {
  console.log("📊 === VALIDACIÓN FINAL ===");
  console.log("→ basePrice actual:", formData.basePrice);
  console.log("→ Tipo de dato:", typeof formData.basePrice);

  if (!sessionId) {
    alert("No se encontró el ID de la sesión");
    return;
  }
  if (formData.basePrice <= 0) {
    alert(`Configurá un precio por foto mayor a cero\n\nPrecio actual: €${formData.basePrice}`);
    setStep(3);
    return;
  }
  if (uploadedImages.length === 0) {
    alert("Debes subir al menos una foto");
    setStep(2);
    return;
  }

  setPublishing(true);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}/publish`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      alert('🎉 ¡Sesión publicada con éxito!');
      router.push('/shot/mis-sesiones');
    } else {
      alert(data.message || 'Error al publicar la sesión');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión');
  } finally {
    setPublishing(false);
  }
};
// ====================== CREAR SESIÓN ======================
const handleCreateSession = async () => {
  if (!formData.date || !formData.startTime || !formData.endTime) {
    alert("Por favor completa la fecha y horarios");
    return;
  }

  // === DEBUG TOKEN ===
  console.log("🔑 DEBUG TOKEN EN CREATE SESSION:");
  console.log("→ Token actual:", token ? token.substring(0, 60) + "..." : "NULL / UNDEFINED");
  console.log("→ Longitud del token:", token?.length || 0);

  if (!token) {
    alert("No tienes sesión activa. Inicia sesión nuevamente.");
    router.push('/login');
    return;
  }

  setCreatingSession(true);

  const audience = formData.type === 'free-surfers' ? 'FREE_SURFERS' : 'SCHOOLS';

  const payload = {
    audience,
    location: formData.type === 'free-surfers' ? formData.location : null,
    schoolName: formData.type === 'escuelas' ? formData.school : null,
    sessionDate: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
  };

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("→ Respuesta del servidor:", data);

    if (res.ok) {
      setSessionId(data.id);
      alert('✅ Sesión creada correctamente');
      setStep(2);
    } else {
      alert(data.message || 'Error al crear la sesión');
      if (data.message?.toLowerCase().includes("token") || res.status === 401) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        logout();
        router.push('/login');
      }
    }
  } catch (err) {
    console.error("Error creando sesión:", err);
    alert('Error de conexión con el servidor');
  } finally {
    setCreatingSession(false);
  }
};


useEffect(() => {
    if (loading) return;
    if (!token) {
      logout();
      router.replace('/login');
    }
  }, [token, logout, router, loading]);

const updateForm = (field, value) => {
  setFormData(prev => {
    let newValue = value;

    if (field === 'basePrice') {
      newValue = parseFloat(value) || 0;
    }

    console.log(`🔄 updateForm → ${field} = ${newValue}`); // ← debug importante

    return { ...prev, [field]: newValue };
  });
};

  // ==================== MANEJO DE FOTOS ====================
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

const handleUploadPhotos = async () => {
  if (!sessionId) {
    alert("Primero crea la sesión en el Paso 1");
    return;
  }
  if (photos.length === 0) {
    alert("Selecciona al menos una foto");
    return;
  }

  setUploading(true);

  const formData = new FormData();
  photos.forEach((photo, i) => {
    formData.append('files', photo);
  });

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_URL}/api/v1/photo-sessions/${sessionId}/images`;

    console.log("🔍 DEBUG UPLOAD:");
    console.log("→ API_URL:", API_URL);
    console.log("→ URL completa:", url);
    console.log("→ Token existe:", !!token);
    console.log("→ Cantidad de fotos:", photos.length);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("→ Status:", res.status, res.statusText);

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: await res.text() || "No se pudo leer la respuesta" };
    }

    console.log("→ Respuesta del servidor:", data);

   if (res.ok) {
  alert('✅ Fotos subidas correctamente');
  setUploadedImages(data.images || []);
  setPhotos([]);           // Limpiamos las pendientes
} else {
  alert(data.message || 'Error al subir las fotos');
}
  } catch (err) {
    console.error("❌ Error completo:", err);
    alert(`Error de conexión.\n\nRevisa la consola (F12) y dime qué ves.`);
  } finally {
    setUploading(false);
  }
};
// ====================== ACTUALIZAR PACKS ======================
// ====================== ACTUALIZAR PACKS ======================
// ====================== ACTUALIZAR PACKS ======================
const handleUpdatePacks = async () => {
  if (!sessionId) {
    alert("Primero crea la sesión");
    return;
  }

  if (formData.selectedPacks.length === 0) {
    alert("Selecciona al menos un pack");
    return;
  }

  const packsPayload = formData.selectedPacks.map(id => ({
    packId: id,
    enabled: true
  }));

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_URL}/api/v1/photo-sessions/${sessionId}`;

    console.log("🔄 Enviando packs a:", url);
    console.log("📦 Payload:", { packs: packsPayload });

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ packs: packsPayload }),
    });

    console.log("→ Status:", res.status, res.statusText);

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: await res.text() || "Sin mensaje del servidor" };
    }

    console.log("→ Respuesta completa:", data);

    if (res.ok) {
      alert('✅ Packs guardados correctamente');
    } else {
      alert(data.message || `Error ${res.status} - Revisa la consola`);
    }
  } catch (err) {
    console.error("❌ Error en handleUpdatePacks:", err);
    alert("Error de conexión. Revisa la consola (F12).");
  }
};
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => handleFiles(e.target.files);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
const togglePack = (packId) => {
  setFormData(prev => ({
    ...prev,
    selectedPacks: prev.selectedPacks.includes(packId)
      ? prev.selectedPacks.filter(id => id !== packId)
      : [...prev.selectedPacks, packId]
  }));
};

const commissionRate = 0.25;
const finalPrice = (formData.basePrice * (1 - commissionRate)).toFixed(2);
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Mis sesiones</span>
          <span>›</span>
          <span className="font-medium text-gray-900">Nueva sesión</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo álbum</h1>

        {/* Stepper Mejorado - Con tick azul */}
<div className="flex justify-center mb-10">
  <div className="flex items-center">
    {[
      { label: 'Detalles', icon: '/icons/details.svg', activeIcon: '/icons/details-active.svg' },
      { label: 'Fotos',    icon: '/icons/photos.svg',    activeIcon: '/icons/photos-active.svg' },
      { label: 'Precios',  icon: '/icons/prices.svg',  activeIcon: '/icons/prices-active.svg' },
      { label: 'Confirmación', icon: '/icons/confirm.svg', activeIcon: '/icons/confirm-active.svg' },
    ].map((stepInfo, index) => {
      const isCompleted = step > index + 1;
      const isCurrent = step === index + 1;

      return (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? 'bg-blue-600 border-blue-600'     // Círculo azul completo
                  : isCurrent
                  ? 'border-blue-600 bg-white'        // Paso actual
                  : 'border-gray-300 bg-white'        // Paso futuro
              }`}
            >
             {isCompleted ? (
                <img
                  src="/icons/tic.svg"          // ← Aquí pon tu imagen del tick
                  alt="Completado"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={isCurrent ? stepInfo.activeIcon : stepInfo.icon}
                  alt={stepInfo.label}
                  className="w-5 h-5 object-contain"
                />
              )}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              isCurrent ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {stepInfo.label}
            </span>
          </div>

          {/* Línea conectora */}
          {index < 3 && (
            <div className={`w-20 h-0.5 mt-5 transition-all ${
              step > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
</div>

        {/* ====================== PASO 1: DETALLES ====================== */}
        {/* ====================== PASO 1: DETALLES ====================== */}
{step === 1 && (
  <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm">
    <h2 className="text-2xl font-semibold mb-6">Completa los detalles de tu sesión</h2>

    {/* Tipo de sesión */}
    <div className="flex gap-2 mb-8">
  <button
    onClick={() => updateForm('type', 'free-surfers')}
    className={`px-6 py-3 rounded-2xl font-medium transition flex-1 ${
      formData.type === 'free-surfers' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    Free Surfers
  </button>
  <button
    onClick={() => updateForm('type', 'escuelas')}
    className={`px-6 py-3 rounded-2xl font-medium transition flex-1 ${
      formData.type === 'escuelas' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    Escuelas
  </button>
</div>

    {/* Escuela o Ubicación */}
    {formData.type === 'escuelas' ? (
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">🏫 Nombre de la Escuela</label>
        <input
          type="text"
          value={formData.school}
          onChange={(e) => updateForm('school', e.target.value)}
          className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          placeholder="Ej: Surf School Barcelona"
        />
      </div>
    ) : (
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">📍 Playa / Ubicación</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateForm('location', e.target.value)}
          className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          placeholder="Ej: Playa de la Barceloneta"
        />
      </div>
    )}

    {/* Fecha y Hora */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <label className="block text-gray-700 mb-2 font-medium">📅 Fecha</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => updateForm('date', e.target.value)}
          className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2 font-medium">🕒 Hora Inicio</label>
        <input
          type="time"
          value={formData.startTime}
          onChange={(e) => updateForm('startTime', e.target.value)}
          className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2 font-medium">🕒 Hora Fin</label>
        <input
          type="time"
          value={formData.endTime}
          onChange={(e) => updateForm('endTime', e.target.value)}
          className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    {/* Botón Crear Sesión */}
    <button
      onClick={handleCreateSession}
      disabled={creatingSession}
      className="mt-10 w-full bg-gray-900 text-white py-4 rounded-2xl font-medium hover:bg-black transition disabled:opacity-70"
    >
      {creatingSession ? 'Creando sesión...' : 'Crear Sesión y Continuar'}
    </button>
  </div>
)}

{/* ====================== PASO 2: FOTOS ====================== */}
{step === 2 && (
  <div className="space-y-6">
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
      <span className="text-amber-600 text-2xl mt-0.5">🔒</span>
      <div>
        <p className="font-medium text-amber-800">Protección activada</p>
        <p className="text-sm text-amber-700">
          Todas las fotos se subirán con marca de agua hasta que el cliente pague.
        </p>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <h2 className="text-2xl font-semibold mb-6">Carga tus fotos</h2>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
          isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input 
          id="fileInput" 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-4xl">📸</span>
        </div>
        <p className="font-medium text-lg">Arrastra tus fotos aquí o haz clic</p>
        <p className="text-gray-500 text-sm mt-1">JPG, PNG, WEBP • Máx 15MB por foto</p>
      </div>

      {/* Previsualización + Botón Subir */}
      {photos.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4 font-medium">
            {photos.length} foto{photos.length !== 1 ? 's' : ''} lista{photos.length !== 1 ? 's' : ''} para subir
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`preview-${index}`} 
                  className="w-full aspect-square object-cover" 
                />

                {/* MARCA DE AGUA */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-white/90 text-[26px] font-bold tracking-[4px] opacity-75 select-none">
                      SPOTSHOT
                    </p>
                    <p className="text-white/60 text-xs tracking-widest -mt-1">
                      PREVIEW • NO VENDER
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* ==================== BOTÓN SUBIR FOTOS ==================== */}
          <button
            onClick={handleUploadPhotos}
            disabled={uploading || photos.length === 0}
            className="mt-8 w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-medium transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>Subiendo fotos... <span className="animate-spin">⟳</span></>
            ) : (
              `Subir ${photos.length} foto${photos.length !== 1 ? 's' : ''} al servidor`
            )}
          </button>
        </div>
      )}

      {/* Fotos ya subidas */}
      {uploadedImages.length > 0 && (
        <div className="mt-10">
          <p className="text-sm text-green-600 font-medium mb-4">✅ Fotos ya subidas ({uploadedImages.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden border border-green-300">
                <img 
                  src={img.publicUrl} 
                  alt={`uploaded-${index}`} 
                  className="w-full aspect-square object-cover" 
                />
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">Subida</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}
{/* ====================== PASO 3: PRECIOS ====================== */}
{step === 3 && (
  <div className="bg-white border border-gray-200 rounded-3xl p-8">
    <h2 className="text-2xl font-semibold mb-1">Establece tu precio</h2>
    <p className="text-gray-600 mb-6">Elige un precio por foto y activa promociones</p>

    {/* Precio base */}
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={formData.basePrice}
          onChange={(e) => updateForm('basePrice', parseFloat(e.target.value) || 0)}
          className="w-32 text-5xl font-semibold border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
          min="1"
          step="0.5"
        />
        <span className="text-5xl text-gray-400">€</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Precio recomendado: 3€ - 8€ por foto</p>
    </div>

    {/* Comisión Spotshot */}
    <div className="bg-blue-50 rounded-2xl p-5 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Comisión Spotshot (25%)</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Precio final para el cliente</p>
          <p className="text-2xl font-semibold text-emerald-600">€{finalPrice}</p>
        </div>
      </div>
    </div>

    {/* Packs por volumen */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold text-lg">Packs por volumen (opcional)</h3>
        <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">Recomendado</span>
      </div>
      <p className="text-sm text-gray-600 mb-6">Ofrece descuentos cuando los clientes compren múltiples fotos.</p>

      {isLoadingPacks ? (
        <p className="text-center py-8 text-gray-500">Cargando packs disponibles...</p>
      ) : (
        <div className="space-y-3">
          {packsCatalog.map((pack) => (
            <div key={pack.id} className="flex items-center justify-between bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="font-semibold text-lg">{pack.label}</p>
                  <p className="text-sm text-gray-500">
                    {pack.discountPercent}% OFF • {pack.photoQuantity} fotos
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.selectedPacks.includes(pack.id)}
                  onChange={() => togglePack(pack.id)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Botón Guardar Packs */}
      <button
        onClick={handleUpdatePacks}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium transition"
      >
        Guardar Packs Seleccionados
      </button>
    </div>
  </div>
)}
      {/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
{/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
{step === 4 && (
  <div className="space-y-8">
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[
          { label: 'Detalles' },
          { label: 'Fotos' },
          { label: 'Precios' },
          { label: 'Confirmación' },
        ].map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <span className="text-xs mt-2 text-blue-600 font-medium">{s.label}</span>
            </div>
            {i < 3 && <div className="w-12 h-0.5 bg-blue-600 mt-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Banner */}
    <div className="relative rounded-3xl overflow-hidden h-80">
      <img src="/banner-surf.jpg" alt="Sesión" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-4xl font-bold">Domingo 01 de Febrero del 2024</p>
        <p className="text-2xl mt-1">{formData.location || formData.school}</p>
      </div>
    </div>

    {/* Precio y Packs */}
    <div className="bg-white border border-gray-100 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold mb-2">Precio por foto</h3>
      <p className="text-5xl font-bold text-gray-900">€{formData.basePrice}</p>

      <div className="mt-8">
        <p className="font-medium mb-4">Packs activos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.selectedPacks.length > 0 ? (
            formData.selectedPacks.map((packId) => {
              const pack = packsCatalog.find(p => p.id === packId);
              return pack ? (
                <div key={pack.id} className="border border-gray-200 rounded-2xl p-5 bg-green-50">
                  <p className="font-semibold">{pack.label}</p>
                  <p className="text-sm text-green-700">
                    {pack.discountPercent}% OFF • {pack.photoQuantity} fotos
                  </p>
                </div>
              ) : null;
            })
          ) : (
            <p className="text-gray-500 italic">No se seleccionaron packs</p>
          )}
        </div>
      </div>
    </div>

    {/* Fotos subidas */}
    <div>
      <p className="text-sm text-gray-600 mb-4 font-medium">
        {uploadedImages.length} foto{uploadedImages.length !== 1 ? 's' : ''} subidas
      </p>
      {uploadedImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((img, index) => (
            <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-green-200">
              <img src={img.publicUrl} alt={`foto-${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600 text-center py-8 bg-red-50 rounded-2xl">
          ⚠️ Debes subir al menos una foto antes de publicar
        </p>
      )}
    </div>

    {/* Botones finales */}
    <div className="flex justify-between items-center pt-6 border-t">
      <button 
        onClick={() => setStep(3)}
        className="px-8 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium flex items-center gap-2"
      >
        ← Atrás
      </button>

      <div className="flex gap-4">
        <button className="px-8 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium">
          Guardar borrador
        </button>

        <button
          onClick={handlePublishSession}
          disabled={publishing || uploadedImages.length === 0}
          className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {publishing ? 'Publicando...' : '✓ Finalizar y Publicar'}
        </button>
      </div>
    </div>
  </div>
)}

        {/* Botones */}
        <div className="flex justify-between items-center mt-8">
          <button className="px-6 py-3 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium text-gray-700">
            Guardar borrador
          </button>

          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium flex items-center gap-2"
              >
                ← Atrás
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white hover:bg-black flex items-center gap-2 font-medium"
            >
              {step === 4 ? 'Crear Sesión' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAlbumPage;