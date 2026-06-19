'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import ImageWithLoader from '@/components/ImageWithLoader';
import { escuelas, playas } from '@/lib/constants/surfData';

const NewAlbumPage = () => {
  const router = useRouter();
  const { token, logout, loading, handleAuthError } = useAuth();   // ← Agrega handleAuthError
  const [showDateModal, setShowDateModal] = useState(false);
  const [step, setStep] = useState(1);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // ← se mantiene
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [formData, setFormData] = useState({
    type: 'free-surfers',
    school: '',
    location: '',
    date: '',
    startTime: '10:30',
    endTime: '11:00',        // ← Cambiado a 30 min por defecto
    duration: '0.5',         // ← Nuevo campo
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
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // ← ESTADOS IMPORTANTES
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [publishing, setPublishing] = useState(false);
  // Lista de escuelas oficiales
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showBeachDropdown, setShowBeachDropdown] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

    if (await handleAuthError(res)) return;   // ← Agregado

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
  const updateForm = (field, value) => {
    setFormData(prev => {
      let newValue = value;

      if (field === 'basePrice') {
        if (value === '' || value === null || value === undefined) {
          newValue = '';                    // Permitir vacío temporalmente
        } else {
          const parsed = parseFloat(value);
          newValue = isNaN(parsed) ? 0 : parsed;
        }
      }

      console.log(`🔄 updateForm - ${field}:`, value, '→', newValue); // ← Debug

      return { ...prev, [field]: newValue };
    });
  };
  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';

    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours;
    let endMinutes = minutes + parseFloat(duration) * 60;

    endHours += Math.floor(endMinutes / 60);
    endMinutes %= 60;

    // Si pasa de medianoche, lo dejamos igual (o podés manejar +1 día si querés)
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      const newEndTime = calculateEndTime(formData.startTime, formData.duration);

      if (newEndTime !== formData.endTime) {
        updateForm('endTime', newEndTime);
      }
    }
  }, [formData.startTime, formData.duration]);
  // ====================== PUBLICAR SESIÓN ======================
  const handlePublishSession = async () => {
    console.log("=== DEBUG HANDLE PUBLISH SESSION ===");
    console.log("Session ID:", sessionId);
    console.log("basePrice en formData:", formData.basePrice);
    console.log("Tipo de basePrice:", typeof formData.basePrice);
    console.log("uploadedImages.length:", uploadedImages.length);
    console.log("Token existe?", !!token);

    if (!sessionId) {
      alert("No se encontró el ID de la sesión");
      return;
    }

    if (formData.basePrice <= 0) {
      console.error("❌ PRECIO INVÁLIDO DETECTADO");
      alert("Configurá un precio por foto mayor a cero");
      setStep(3);
      return;
    }

    if (uploadedImages.length === 0) {
      alert("Debes subir al menos una foto");
      setStep(2);
      return;
    }

    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    setShowPublishModal(false);
    setPublishing(true);

    console.log("=== INTENTANDO PUBLICAR ===");
    console.log("Session ID:", sessionId);
    console.log("Token:", token ? token.substring(0, 50) + "..." : "NO TOKEN");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = `${API_URL}/api/v1/photo-sessions/${sessionId}/publish`;
      console.log("Llamando a:", url);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'   // ← Agregar esto también
        },
      });

      console.log("Status de publish:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = await res.text();
      }

      console.log("Respuesta completa del publish:", data);

      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        alert(data.message || data || `Error ${res.status} al publicar`);
      }
    } catch (err) {
      console.error("Error en confirmPublish:", err);
      alert('Error de conexión');
    } finally {
      setPublishing(false);
    }
  };
  // ====================== CREAR SESIÓN ======================
  // ====================== CREAR SESIÓN ======================
  const handleCreateSession = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      setShowDateModal(true);
      return;
    }

    // Validación basada en el campo duration (más confiable)
    const durationHours = parseFloat(formData.duration);
    const allowedDurations = [0.5, 1, 1.5, 2];

    if (!allowedDurations.includes(durationHours)) {
      alert("La duración de la sesión debe ser de 30 minutos, 1 hora, 1.5 horas o 2 horas.");
      return;
    }

    // Opcional: Validar que endTime coincida con duration (seguridad extra)
    const start = new Date(`2025-01-01 ${formData.startTime}`);
    const expectedEnd = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    const expectedEndStr = expectedEnd.toTimeString().slice(0, 5); // HH:MM

    if (formData.endTime !== expectedEndStr) {
      // Actualizamos endTime automáticamente si no coincide
      updateForm('endTime', expectedEndStr);
    }

    setCreatingSession(true);

    const audience = formData.type === 'free-surfers' ? 'FREE_SURFERS' : 'SCHOOLS';

    const payload = {
      audience,
      title: formatSessionTitle(formData.date),   // ← Si ya tienes esta función
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
if (await handleAuthError(res)) return;
      const data = await res.json();

      if (res.ok) {
        setSessionId(data.id);
        setStep(2);
      } else {
        alert(data.message || 'Error al crear la sesión');
      }
    } catch (err) {
      console.error("Error creando sesión:", err);
      alert('Error de conexión con el servidor');
    } finally {
      setCreatingSession(false);
    }
  };
  // ====================== FORMATEADOR DE TÍTULO ======================
  const formatSessionTitle = (dateString) => {
    if (!dateString) return 'Nueva Sesión';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Nueva Sesión';

    const diasAbrev = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const diaSemana = diasAbrev[date.getDay()];
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${diaSemana} ${dia}/${mes}`;
  };

  useEffect(() => {
    if (loading) return;
    if (!token) {
      logout();
      router.replace('/login');
    }
  }, [token, logout, router, loading]);



  // ==================== MANEJO DE FOTOS ====================
  const handleFiles = (files) => {
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (allowedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(
        `Formato no permitido:\n\n${invalidFiles.join('\n')}\n\nSolo se permiten: JPG, PNG y WEBP`
      );
      setShowErrorModal(true);
    }

    if (validFiles.length > 0) {
      setPhotos(prev => [...prev, ...validFiles]);
    }
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

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // ==================== 1. PREPARE UPLOADS ====================
      const filesMetadata = photos.map(file => ({
        mimeType: file.type,
        sizeBytes: file.size,
        originalName: file.name,
      }));

      const prepareRes = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}/prepare-uploads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ files: filesMetadata }),
      });

      const prepareData = await prepareRes.json();

      if (!prepareRes.ok) {
        throw new Error(prepareData.message || 'Error al preparar las subidas');
      }

      // ==================== 2. SUBIDA DIRECTA (PUT) ====================
      const uploadPromises = prepareData.uploads.map(async (upload, index) => {
        const file = photos[index];
        const response = await fetch(upload.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!response.ok) {
          console.error(`Fallo al subir ${file.name}`);
          return null; // Falló
        }

        return upload.imageId;
      });

      const imageIdsResults = await Promise.all(uploadPromises);
      const successfulImageIds = imageIdsResults.filter(id => id !== null);

      if (successfulImageIds.length === 0) {
        throw new Error("Ninguna foto se pudo subir correctamente");
      }

      // ==================== 3. CONFIRM UPLOADS ====================
      const confirmRes = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}/confirm-uploads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageIds: successfulImageIds }),
      });

      const confirmData = await confirmRes.json();

      if (!confirmRes.ok) {
        throw new Error(confirmData.message || 'Error al confirmar las subidas');
      }

      // === NUEVA LÓGICA: Combinar preview local + datos del servidor ===
      // === COMBINAR PREVIEW LOCAL + DATOS DEL SERVIDOR ===
      const newUploadedImages = photos.map((file, index) => {
        const serverImage = confirmData.images?.[index] || {};
        return {
          ...serverImage,
          localPreview: URL.createObjectURL(file),   // ← Preview inmediato
          name: file.name
        };
      });

      setUploadedImages(prev => [...prev, ...newUploadedImages]);
      setPhotos([]); // Limpiar fotos pendientes
    } catch (err) {
      console.error("❌ Error en subida directa:", err);

      let message = err.message || 'Error durante la subida de fotos.';

      if (message.includes('mimeType') || message.includes('image/jpeg')) {
        setErrorMessage("Formato de imagen no permitido por el servidor.\n\nSolo JPG, PNG y WEBP son aceptados.");
        setShowErrorModal(true);
      } else {
        alert(message); // Solo alert para otros errores
      }
    } finally {
      setUploading(false);
    }
  };
  // ====================== ACTUALIZAR PRECIO + PACKS ======================
  const handleUpdatePricing = async () => {
    console.log("=== INICIANDO handleUpdatePricing ===");
    console.log("Session ID:", sessionId);
    console.log("Precio que quiere el fotógrafo:", formData.basePrice);

    if (!sessionId) {
      alert("Sesión no encontrada");
      return;
    }

    if (formData.basePrice < 1) {
      alert("El precio debe ser mayor a 1 €");
      return;
    }

    setUpdatingPrice(true);

    const packsPayload = formData.selectedPacks.map(id => ({
      packId: id,
      enabled: true
    }));

    // ← CAMBIO IMPORTANTE
    const payload = {
      unitPriceCustomerEur: Number(formData.basePrice),   // ← Campo que espera el backend
      packs: packsPayload
    };

    console.log("📤 Payload enviado:", payload);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Respuesta PATCH:", { status: res.status, data });

      const serverCustomerPrice = data?.pricing?.unitPriceCustomerEur;

if (serverCustomerPrice && serverCustomerPrice > 0) {
  setFormData(prev => ({ ...prev, basePrice: Number(serverCustomerPrice) }));
  setStep(4);
} else {
  // si el backend no devuelve unitPriceCustomerEur, no toques basePrice
  setStep(4);
}
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setUpdatingPrice(false);
    }
  };
  // Función para cerrar éxito e ir a mis sesiones
  const handleGoToMySessions = () => {
    setShowSuccessModal(false);
    router.push('/shot/misSesiones');
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

  const handleNext = async () => {
    console.log(`→ Avanzando del paso ${step} al siguiente`);

    if (step === 1) {
      await handleCreateSession();
    }
    else if (step === 2) {
      if (uploadedImages.length === 0 && photos.length === 0) {
        alert("Debes subir al menos una foto válida para continuar.");
        return;
      }

      if (photos.length > 0) {
        await handleUploadPhotos();
      }

      // Solo avanzamos si hay fotos subidas
      if (uploadedImages.length > 0) {
        setStep(3);
      }
    }
    else if (step === 3) {
      await handleUpdatePricing();
    }
    else if (step === 4) {
      await handlePublishSession();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      // Mostrar modal de confirmación antes de volver al paso 1
      setShowBackConfirmModal(true);
      return;
    }

    // Para otros pasos (3 → 2 o 4 → 3) volvemos normalmente
    if (step > 1) {
      setStep(step - 1);
    }
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

  const commissionRate = 0.20; 
  const finalPrice = formData.basePrice > 0
    ? (formData.basePrice * (1 - commissionRate)).toFixed(2)
    : '—';
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-12">
      {/* Header */}


      <div className="mx-auto px-6 pt-8">
        <div>
          <div className="w-full mx-auto pb-8  flex items-center gap-2 text-sm text-gray-600">
            <span>Mis sesiones</span>
            <span>›</span>
            <span className="font-medium text-[#103457">Nueva sesión</span>
          </div>
        </div>
        <h1 className="text-[24px] font-medium text-[#10487C] pb-5 md:pb-0 mb-8">Nuevo álbum</h1>

        {/* Stepper Mejorado - Con tick azul */}
        <div className="flex justify-center w-full mb-10">
          <div className="flex items-center justify-center  w-[85%] md:w-full">
            {[
              { label: 'Detalles', icon: '/icons/details.svg', activeIcon: '/icons/details-active.svg' },
              { label: 'Fotos', icon: '/icons/photos.svg', activeIcon: '/icons/photos-active.svg' },
              { label: 'Precios', icon: '/icons/prices.svg', activeIcon: '/icons/prices-active.svg' },
              { label: 'Confirmación', icon: '/icons/confirm.svg', activeIcon: '/icons/confirm-active.svg' },
            ].map((stepInfo, index) => {
              const isCompleted = step > index + 1;
              const isCurrent = step === index + 1;

              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                        ? 'bg-[#106BB9] border-[#106BB9]'     // Círculo azul completo
                        : isCurrent
                          ? 'border-[#106BB9] bg-white'        // Paso actual
                          : 'border-gray-300 bg-white'        // Paso futuro
                        }`}
                    >
                      {isCompleted ? (
                        <img
                          src="/icons/tic.svg"          // ← Aquí pon tu imagen del tick
                          alt="Completado"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <img
                          src={isCurrent ? stepInfo.activeIcon : stepInfo.icon}
                          alt={stepInfo.label}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-[#103457]' : 'text-gray-500'
                      }`}>
                      {stepInfo.label}
                    </span>
                  </div>

                  {/* Línea conectora */}
                  {index < 3 && (
                    <div className={`w-20 h-0.5 mt-5 transition-all ${step > index + 1 ? 'bg-[#103457]' : 'bg-gray-200'
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
          <div className="bg-white border border-gray-200 rounded-lg p-8 ">
            <h2 className="text-[18px]  text-[#0D2744] font-semibold mb-6">Completa los detalles de tu sesión</h2>

            {/* Tipo de sesión */}
            <div className="flex bg-[#F1F7FE] p-1 rounded-lg w-73 h-12.25 mb-8">
              <button
                onClick={() => updateForm('type', 'free-surfers')}
                className={`px-8 cursor-pointer rounded-lg font-medium transition-all ${formData.type === 'free-surfers'
                  ? 'bg-white text-[#1E3A5F] shadow-sm'
                  : 'bg-transparent text-[#71717A] hover:text-gray-700'
                  }`}
              >
                Free surfers
              </button>
              <button
                onClick={() => updateForm('type', 'escuelas')}
                className={`px-8 cursor-pointer rounded-lg font-medium transition-all ${formData.type === 'escuelas'
                  ? 'bg-white text-[#1E3A5F] shadow-sm'
                  : 'bg-transparent text-[#71717A] hover:text-gray-700'
                  }`}
              >
                Escuelas
              </button>
            </div>

            {/* Escuela o Ubicación */}
            {formData.type === 'escuelas' ? (
              <div className="mb-6 relative">
                <div className='flex mb-2'> <Image width={16} height={16} alt='school' src={'/icons/school.svg'} /><label className="block pl-2 text-gray-700  font-medium  items-center gap-2">

                  Nombre de la Escuela
                </label></div>

              <input
  type="text"
  value={formData.school || ''}
  onChange={(e) => {
    updateForm('school', e.target.value);
    setShowSchoolDropdown(true);
  }}
  onFocus={() => setShowSchoolDropdown(true)}
  onBlur={() => setTimeout(() => setShowSchoolDropdown(false), 180)}
  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#103457] bg-white"
  placeholder="Busca escuela (ej: Somo's, Sunset...)"
/>

              {/* Dropdown Escuelas */}
{showSchoolDropdown && (formData.school || '').length > 0 && (
  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto">
    {escuelas
      .filter(item => {
        const search = (formData.school || '').toLowerCase().trim();
        if (!search) return false;

        return (
          item.label?.toLowerCase().includes(search) ||
          item.name?.toLowerCase().includes(search) ||   // ← más importante
          item.region?.toLowerCase().includes(search)
        );
      })
      .slice(0, 15)
      .map((item, index) => (
        <div
          key={index}
          onMouseDown={(e) => {
            e.preventDefault();
            updateForm('school', item.name); // ← Usamos `name` (el valor real para el backend)
            setShowSchoolDropdown(false);
          }}
          className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
        >
          {item.label}
        </div>
      ))}
  </div>
)}
              </div>
            ) : (
              <div className="mb-6 relative">
                <div className='flex mb-2'><Image width={16} height={16} alt='playa' src={'/icons/playa.svg'} /> <label className="block text-gray-700 pl-2  font-medium  items-center gap-2">

                  Playa
                </label></div>

                <input
  type="text"
  value={formData.location || ''}
  onChange={(e) => {
    updateForm('location', e.target.value);
    setShowBeachDropdown(true);
  }}
  onFocus={() => setShowBeachDropdown(true)}
  onBlur={() => setTimeout(() => setShowBeachDropdown(false), 150)}
  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#103457] bg-white"
  placeholder="Busca playa (ej: Somo, Zurriola, Langre...)"
/>

                {/* Dropdown de playas */}
                {showBeachDropdown && formData.location.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto">
                    {playas
                      .filter(item =>
                        item.label.toLowerCase().includes(formData.location.toLowerCase()) ||
                        item.value.toLowerCase().includes(formData.location.toLowerCase())
                      )
                      .slice(0, 15)
                      .map((item, index) => (

                        <div
                          key={index}
                          onMouseDown={(e) => {           // ← Cambiar a onMouseDown
                            e.preventDefault();           // Muy importante
                            updateForm('location', item.value);  // o 'location'
                            setShowBeachDropdown(false);
                          }}
                          className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
                        >
                          {item.label}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}


            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex mb-2"><Image width={16} height={16} alt='fecha' src={'/icons/fecha.svg'} /> <label className="block pl-2 text-gray-700 font-medium  items-center gap-2">

                  Fecha
                </label></div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Hora Inicio - Dropdown Personalizado (6:00 a 23:00) */}
<div className="relative">
  <div className="flex mb-2"> 
    <Image width={16} height={16} alt='hora' src={'/icons/hora.svg'} />
    <label className="block text-gray-700 pl-2 font-medium items-center gap-2">
      Hora Inicio
    </label>
  </div>

  <div
    onClick={() => setShowStartTimeDropdown(!showStartTimeDropdown)}
    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 bg-white cursor-pointer flex justify-between items-center"
  >
    <span className="text-lg">{formData.startTime || "Seleccionar hora"}</span>
    <span className="text-gray-400">▼</span>
  </div>

  {showStartTimeDropdown && (
    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto py-2">
      {Array.from({ length: 18 }, (_, i) => {   // 18 horas → de 6 a 23
        const hour = (6 + i).toString().padStart(2, '0');
        return (
          <React.Fragment key={hour}>
            {/* Hora en punto */}
            <div
              onClick={() => {
                updateForm('startTime', `${hour}:00`);
                setShowStartTimeDropdown(false);
              }}
              className={`px-5 py-3 hover:bg-blue-50 cursor-pointer text-lg ${formData.startTime === `${hour}:00` ? 'bg-blue-50 font-medium text-blue-600' : ''}`}
            >
              {`${hour}:00`}
            </div>

            {/* Media hora (excepto si es 23:30) */}
            {hour !== '23' && (
              <div
                onClick={() => {
                  updateForm('startTime', `${hour}:30`);
                  setShowStartTimeDropdown(false);
                }}
                className={`px-5 py-3 hover:bg-blue-50 cursor-pointer text-lg ${formData.startTime === `${hour}:30` ? 'bg-blue-50 font-medium text-blue-600' : ''}`}
              >
                {`${hour}:30`}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  )}
</div>

              {/* Duración - Dropdown Personalizado */}
              <div className="relative">
                <div className='flex mb-2 items-center '>
                  <Image width={16} height={16} alt='hora' src={'/icons/hora.svg'} />
                  <label className="block text-gray-700 pl-2 font-medium text-center">Duración de la sesión</label>
                </div>
                <div
                  onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 bg-white cursor-pointer flex justify-between items-center"
                >
                  <span className="text-lg">
                    {formData.duration
                      ? `${formData.duration === '0.5' ? '30 minutos' :
                        formData.duration === '1' ? '1 hora' :
                          formData.duration === '1.5' ? '1 hora y media' : '2 horas'}`
                      : "Seleccionar duración"}
                  </span>
                  <span className="text-gray-400">▼</span>
                </div>

                {showDurationDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto py-2">
                    {[
                      { value: '0.5', label: '30 minutos' },
                      { value: '1', label: '1 hora' },
                      { value: '1.5', label: '1 hora y media' },
                      { value: '2', label: '2 horas' },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          const newDuration = option.value;
                          updateForm('duration', newDuration);
                          setShowDurationDropdown(false);

                          // Calcular automáticamente la hora de fin
                          if (formData.startTime) {
                            const [hours, minutes] = formData.startTime.split(':').map(Number);
                            let endHours = hours;
                            let endMinutes = minutes + parseFloat(option.value) * 60;

                            endHours += Math.floor(endMinutes / 60);
                            endMinutes %= 60;

                            const newEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                            updateForm('endTime', newEndTime);
                          }
                        }}
                        className={`px-5 py-3 hover:bg-blue-50 cursor-pointer text-lg ${formData.duration === option.value ? 'bg-blue-50 font-medium text-blue-600' : ''}`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>



          </div>
        )}

        {/* ====================== PASO 2: FOTOS ====================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-blue-800 text-sm">
                Los álbumes permanecen disponibles durante <strong>30 días</strong> después de su publicación.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Carga tus fotos</h2>
              <p className="text-gray-600 mb-6">La <strong>primera foto</strong> que selecciones será la portada del álbum.</p>

              {/* Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all bg-[#F1F7FE] ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
                <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-4xl"><img src='/icons/descargar.svg' alt='img descargar' width={24} height={24} /></span>
                </div>
                <p className="font-medium text-lg">Arrastra tus fotos aquí o haz clic</p>
                <p className="text-gray-500 text-sm mt-1">JPG, PNG, WEBP • Máx 15MB por foto</p>
              </div>

              {/* Previsualización */}
              {photos.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    {photos.length} foto{photos.length !== 1 ? 's' : ''} lista{photos.length !== 1 ? 's' : ''} para subir
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        <ImageWithLoader
                          src={URL.createObjectURL(photo)}
                          alt={`preview-${index}`}
                          aspectRatio="aspect-square"
                        />

                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded font-medium">
                            Portada
                          </div>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fotos ya subidas */}
              {uploadedImages.length > 0 && (
                <div className="mt-10">
                  <p className="text-sm text-green-600 font-medium mb-4">
                    ✅ Fotos ya subidas ({uploadedImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                    {uploadedImages.map((img, index) => {
                      const displayUrl = img.localPreview || img.publicUrl || img.url;

                      return (
                        <div key={index} className="relative rounded-2xl overflow-hidden border border-green-300 aspect-square bg-gray-100">
                          <ImageWithLoader
                            src={displayUrl}
                            alt={`uploaded-${index}`}
                            aspectRatio="aspect-square"
                          />
                          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                            Subida
                          </div>
                          {img.localPreview && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                              Preview
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ====================== PASO 3: PRECIOS ====================== */}
        {/* ====================== PASO 3: PRECIOS ====================== */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-1">Establece tu precio</h2>
            <p className="text-gray-600 mb-6">Elige un precio por foto y activa promociones</p>

            {/* Precio base */}
            {/* Precio base */}
            <div className="mb-8">
              <label className="block text-gray-700 mb-2 font-medium">Precio por foto (€)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => updateForm('basePrice', e.target.value)}
                  className="w-32 text-5xl font-semibold border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
                  min="0.5"
                  step="0.5"
                  placeholder="5"
                />
                <span className="text-5xl text-gray-400">€</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Precio recomendado: 3€ - 8€ por foto</p>
            </div>

            {/* Comisión */}
            <div className="bg-blue-50 rounded-2xl p-5 mb-8">
              <div className="flex justify-between items-center">
                <p className="font-medium">Comisión Spotshot (20%)</p>
                <div className="text-right">
                  <p className="font-medium">Precio final por foto</p>
                  <p className="text-2xl font-semibold text-emerald-600">€{finalPrice}</p>
                </div>
              </div>
            </div>

            {/* Packs por volumen */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Packs por volumen</h3>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                  {uploadedImages.length} fotos subidas
                </span>
              </div>

              {uploadedImages.length < 5 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                  <p className="text-amber-800 font-medium">
                    Necesitas al menos <strong>5 fotos</strong> para activar packs
                  </p>
                  <p className="text-amber-700 text-sm mt-2">
                    Actualmente tienes {uploadedImages.length} foto{uploadedImages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packsCatalog
                    .filter(pack => pack.photoQuantity <= uploadedImages.length)
                    .map((pack) => (
                      <div key={pack.id} className="flex items-center justify-between bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl"><img src='/icons/packs.svg' width={20} height={20} alt='foto' /></span>
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
                          <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0D2744] transition"></div>
                          <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>


          </div>
        )}
        {/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
        {/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
        {/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
        {step === 4 && (
          <div className="space-y-8">

            {/* Banner de confirmación */}
            <div className="relative rounded-3xl overflow-hidden h-80">
              <img src="/banner-surf.png" alt="Sesión" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-4xl font-bold">
                  {formData.date ? new Intl.DateTimeFormat('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }).format(new Date(formData.date)) : 'Tu Sesión'}
                </p>
                <p className="text-2xl mt-1">
                  {formData.location || formData.school || 'Ubicación'}
                </p>
              </div>
            </div>

            {/* Precio y Packs */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold mb-2">Precio final para el fotógrafo por foto</h3>
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
              <p className="text-xs text-gray-400 mt-1">*No hace falta esperar a que termine el proceso de carga.</p>

              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {uploadedImages.map((img, index) => {
                    const displayUrl = img.localPreview || img.publicUrl || img.url;

                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-green-200 bg-gray-100"
                      >
                        <ImageWithLoader
                          src={displayUrl}
                          alt={`foto-${index}`}
                          aspectRatio="aspect-square"
                        />
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                          Subida
                        </div>
                        {img.localPreview && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Preview
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-red-600 text-center py-8 bg-red-50 rounded-2xl">
                  ⚠️ Debes subir al menos una foto antes de publicar
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botones */}
        {/* ====================== BOTONES INFERIORES ====================== */}
        <div className="flex justify-end items-center mt-8">


          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-3.5 cursor-pointer rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium flex items-center gap-2"
              >
                ← Atrás
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={
                (step === 1 && creatingSession) ||
                (step === 2 && (uploading || showErrorModal || (uploadedImages.length === 0 && photos.length === 0))) ||
                (step === 3 && updatingPrice) ||
                (step === 4 && publishing)
              }
              className="px-8 py-3.5 rounded-2xl cursor-pointer  bg-gray-900 text-white hover:bg-black flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {step === 1 && creatingSession ? 'Creando sesión...' :
                step === 2 && uploading ? 'Subiendo fotos...' :
                  step === 3 && updatingPrice ? 'Guardando precio...' :
                    step === 4 && publishing ? 'Publicando...' :
                      step === 4 ? 'Publicar Sesión' : 'Siguiente →'}
            </button>
          </div>
        </div>
        {/* ==================== MODAL PUBLICAR ==================== */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
              <h3 className="text-2xl font-semibold mb-4">¿Publicar la sesión?</h3>
              <p className="text-gray-600 mb-8">
                Una vez publicada, será visible para todos los usuarios<br />
                y estará disponible durante 30 días. ¿Deseas continuar?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-3.5 border cursor-pointer border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={publishing}
                  className="flex-1 py-3.5 bg-[#103457] cursor-pointer text-white rounded-2xl font-medium hover:bg-[#103457] disabled:opacity-70"
                >
                  {publishing ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full mx-4 text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-5xl">🎉</span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                ¡Sesión publicada con éxito!
              </h2>

              <p className="text-gray-600 mb-8">
                Tu álbum ya está visible para todos los usuarios.<br />
                ¡Muchas gracias por compartir tu arte!
              </p>

              <button
                onClick={handleGoToMySessions}
                className="w-full py-4 cursor-pointer bg-[#103457] hover:bg-[#103457] text-white font-semibold rounded-2xl transition"
              >
                Ver mis sesiones
              </button>
            </div>
          </div>
        )}
        {/* ==================== MODAL FECHA Y HORARIOS ==================== */}
        {showDateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🕒</span>
              </div>

              <h3 className="text-2xl font-semibold mb-3">Faltan datos importantes</h3>
              <p className="text-gray-600 mb-8">
                Por favor completa la <strong>fecha</strong> y los <strong> horarios </strong>
                de la sesión para continuar.
              </p>

              <button
                onClick={() => setShowDateModal(false)}
                className="w-full py-3.5 bg-[#103457] text-white rounded-2xl cursor-pointer font-medium hover:bg-[#103457] transition"
              >
                Completar ahora
              </button>
            </div>
          </div>
        )}
        {/* ==================== MODAL ERROR DE FORMATO ==================== */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">⚠️</span>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-red-600">Formato no permitido</h3>
              <p className="text-gray-600 mb-8 whitespace-pre-line">
                {errorMessage}
              </p>

              <button
                onClick={() => {
                  setShowErrorModal(false);
                  setErrorMessage('');
                }}
                className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
        {/* ==================== MODAL CONFIRMAR VOLVER AL PASO 1 ==================== */}
        {/* ==================== MODAL CONFIRMAR VOLVER AL PASO 1 ==================== */}
        {showBackConfirmModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">⚠️</span>
              </div>

              <h3 className="text-2xl font-semibold mb-3">¿Volver al paso 1?</h3>
              <p className="text-gray-600 mb-8">
                Se borrarán todas las fotos subidas, el precio y los packs.<br />
                ¿Estás seguro de que quieres empezar de nuevo?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowBackConfirmModal(false)}
                  className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Primero cerramos el modal
                    setShowBackConfirmModal(false);

                    // Hacemos el reset completo
                    setUploadedImages([]);
                    setPhotos([]);
                    setSessionId(null);
                    setSessionCreated(false);

                    setFormData({
                      type: formData.type,
                      school: '',
                      location: '',
                      date: '',
                      startTime: '10:30',
                      endTime: '11:00',
                      duration: '0.5',
                      basePrice: 5,
                      selectedPacks: [],
                    });

                    // Forzamos el cambio de paso
                    setTimeout(() => {
                      console.log("Cambiando a paso 1...");
                      setStep(1);
                    }, 50); // Pequeño delay para que React procese los otros estados
                  }}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium"
                >
                  Sí, volver al paso 1
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAlbumPage;