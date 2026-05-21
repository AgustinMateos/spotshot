'use client';

import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
  const router = useRouter();

  // Datos de ejemplo (después los vas a recibir por props o URL)
  const orderId = "ORD-987654";
  const email = "agustinxx@gmail.com";
  const imageCount = 8;

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  const handleDownload = () => {
    alert('✅ Descargando tus imágenes en alta calidad...');
    // Aquí vas a poner la lógica real de descarga más adelante
    // Ej: window.location.href = `/api/orders/${orderId}/download`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* Ilustración */}
        <div className="mb-10 flex justify-center">
          <img 
            src="/success-illustration.svg" 
            alt="Felicitaciones" 
            className="w-80 h-auto"
          />
        </div>

        {/* Título y mensaje */}
        <h1 className="text-4xl font-bold text-[#0D2744] mb-4 leading-tight">
          ¡Felicitaciones! Tus imágenes ya están disponibles
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          Te enviamos tus imágenes a <strong>{maskedEmail}</strong>,<br />
          o descárgalas aquí mismo
        </p>

        {/* Botones */}
        <div className="space-y-4">
          <button
            onClick={handleDownload}
            className="w-full bg-[#1F2937] hover:bg-black text-white py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Download size={24} />
            Descargar imágenes ({imageCount})
          </button>

          <button
            onClick={() => router.push('/sesiones')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl text-lg font-medium transition-all active:scale-95"
          >
            Buscar otra sesión
          </button>
        </div>

        {/* Orden ID */}
        <div className="mt-8 text-sm text-gray-500">
          Orden: <span className="font-mono text-gray-400">{orderId}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;