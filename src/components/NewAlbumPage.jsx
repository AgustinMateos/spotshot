'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NewAlbumPage = () => {
  const router = useRouter();
  const { token, logout, loading } = useAuth();

  const [step, setStep] = useState(1); // ← Cambiado a 1 para que empiece en Detalles

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

  // Verificar autenticación
  useEffect(() => {
    if (loading) return;
    if (!token) {
      logout();
      router.replace('/login');
    }
  }, [token, logout, router, loading]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        {step === 1 && (
          <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Completa los detalles de tu sesión</h2>

            {/* Tipo de sesión */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => updateForm('type', 'free-surfers')}
                className={`px-6 py-3 rounded-2xl font-medium transition ${
                  formData.type === 'free-surfers' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Free surfers
              </button>
              <button
                onClick={() => updateForm('type', 'escuelas')}
                className={`px-6 py-3 rounded-2xl font-medium transition ${
                  formData.type === 'escuelas' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Escuelas
              </button>
            </div>

            {/* Escuela (solo si es escuelas) */}
            {formData.type === 'escuelas' && (
              <div className="mb-6">
                <label className="flex items-center gap-2 text-gray-700 mb-2">🏫 Escuela</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar escuela"
                    value={formData.school}
                    onChange={(e) => updateForm('school', e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute left-4 top-3.5 text-gray-400">🔎</span>
                </div>
              </div>
            )}

            {/* Ubicación (solo si es free surfers) */}
            {formData.type === 'free-surfers' && (
              <div className="mb-6">
                <label className="flex items-center gap-2 text-gray-700 mb-2">📍 Ubicación</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Seleccionar playa..."
                    value={formData.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute left-4 top-3.5 text-gray-400">🔎</span>
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">📅 Fecha de la sesión</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">⏰ Hora de la sesión</label>
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateForm('startTime', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                  />
                  <span className="self-center text-gray-400">—</span>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateForm('endTime', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================== PASO 2: FOTOS ====================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <span className="text-blue-600 text-xl">ℹ️</span>
              <p className="text-sm text-blue-800">
                Los álbumes permanecen disponibles durante 30 días después de su publicación
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Carga tus fotos</h2>

              {/* Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input id="fileInput" type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-4xl">↑</span>
                </div>
                <p className="font-medium text-lg">Arrastra tu(s) archivo(s) o explora</p>
                <p className="text-gray-500 text-sm mt-1">Formatos permitidos: .jpg, .png</p>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">{photos.length} fotos cargadas</p>
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={URL.createObjectURL(photo)} alt={`preview-${index}`} className="w-full h-40 object-cover rounded-2xl border" />
                        <button
                          onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

       {/* ====================== PASO 3: PRECIOS ====================== */}
{step === 3 && (
  <div className="bg-white border border-gray-200 rounded-3xl p-8">
    <h2 className="text-2xl font-semibold mb-1">Establece tu precio</h2>
    <p className="text-gray-600 mb-6">Elige un precio por foto y activa promociones</p>

    {/* Precio base */}
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={formData.basePrice}
          onChange={(e) => updateForm('basePrice', parseFloat(e.target.value) || 0)}
          className="w-32 text-4xl font-semibold border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500"
          min="1"
          step="0.5"
        />
        <span className="text-4xl text-gray-400">€</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Se recomienda un precio de 3€ a 5€ por foto</p>
    </div>

    {/* Comisión Spotshot */}
    <div className="bg-blue-50 rounded-2xl p-5 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Comisión Spotshot</p>
          <p className="text-sm text-gray-600">25%</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Valor final por foto</p>
          <p className="text-xl font-semibold text-emerald-600">€{finalPrice}</p>
        </div>
      </div>
    </div>

    {/* Packs por volumen */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold">Ventas personalizadas con packs por volumen</h3>
        <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">Recomendado</span>
      </div>
      <p className="text-sm text-gray-600 mb-6">Ofrece descuentos cuando los clientes compren múltiples fotos.</p>

      {isLoadingPacks ? (
        <p className="text-center py-8">Cargando packs...</p>
      ) : (
        packsCatalog.map((pack) => (
          <div key={pack.id} className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-4">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-medium">{pack.label}</p>
                <p className="text-sm text-gray-500">
                  {pack.discountPercent}% Off • Total pack {pack.photoQuantity} fotos
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
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        ))
      )}
    </div>
  </div>
)}
        {step === 4 && <div className="bg-white rounded-3xl p-8 text-center py-20">Paso 4 - Confirmación (próximamente)</div>}

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