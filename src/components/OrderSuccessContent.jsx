'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkoutSessionId = searchParams.get('checkout_session_id');
    const orderIdParam = searchParams.get('orderId');
    const emailParam = searchParams.get('email');
    const countParam = searchParams.get('count');

    // Prioridad 1: Parámetros directos en la URL
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setEmail(emailParam || '');
      setImageCount(parseInt(countParam || '0'));
      setLoading(false);
      return;
    }

    // Prioridad 2: Recuperar desde localStorage (backup)
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      const data = JSON.parse(lastOrder);
      setOrderId(data.orderId);
      setEmail(data.email);
      setImageCount(data.imageCount);
      localStorage.removeItem('lastOrder'); // limpiar
      setLoading(false);
      return;
    }

    // Fallback (solo para pruebas)
    setOrderId('312dab89-09ff-4713-84c1-f1fa219ce13a');
    setEmail('agustinxx@gmail.com');
    setImageCount(8);
    setLoading(false);
  }, [searchParams]);

  const maskedEmail = email 
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') 
    : 'tu@email.com';

  const handleDownload = () => {
    alert(`Descargando ${imageCount} imágenes de la orden ${orderId}...`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando tu orden...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-10 flex justify-center">
          <img src="/success-illustration.svg" alt="Felicitaciones" className="w-80 h-auto" />
        </div>

        <h1 className="text-4xl font-bold text-[#0D2744] mb-4 leading-tight">
          ¡Felicitaciones! Tus imágenes ya están disponibles
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          Te enviamos tus imágenes a <strong>{maskedEmail}</strong>,<br />
          o descárgalas aquí mismo
        </p>

        <div className="space-y-4">
          <button
            onClick={handleDownload}
            className="w-full bg-[#1F2937] hover:bg-black text-white py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3"
          >
            <Download size={24} />
            Descargar imágenes ({imageCount})
          </button>

          <button
            onClick={() => router.push('/sesiones')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl text-lg font-medium"
          >
            Buscar otra sesión
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Orden: <span className="font-mono break-all">{orderId}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessContent;