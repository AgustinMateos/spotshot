'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const OrderErrorContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkoutSessionId = searchParams.get('checkout_session_id');
    const orderIdParam = searchParams.get('orderId');
    const errorParam = searchParams.get('error');

    // Prioridad 1: Parámetros de la URL
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    // Mensaje de error personalizado
    if (errorParam) {
      switch (errorParam) {
        case 'payment_failed':
          setErrorMessage('El pago fue rechazado. Verifica los datos de tu tarjeta e inténtalo nuevamente.');
          break;
        case 'canceled':
          setErrorMessage('El proceso de pago fue cancelado.');
          break;
        case 'session_expired':
          setErrorMessage('La sesión de pago expiró. Por favor, inicia el proceso nuevamente.');
          break;
        default:
          setErrorMessage('Hubo un problema al procesar tu pago.');
      }
    } else {
      setErrorMessage('Hubo un problema al procesar tu pago.');
    }

    setLoading(false);
  }, [searchParams]);

  const handleTryAgain = () => {
    // Redirigir a la página de pago o la última sesión
    router.push('/sesiones'); // o la ruta que uses para volver a intentar
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Ilustración de error */}
        <div className="mb-10 flex justify-center">
          <div className="w-80 h-80 flex items-center justify-center">
            <AlertCircle size={180} className="text-red-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#0D2744] mb-4 leading-tight">
          Hubo un problema con tu pago
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          {errorMessage}
        </p>

        {orderId && (
          <div className="mb-8 text-sm text-gray-500">
            Orden: <span className="font-mono break-all">{orderId}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleTryAgain}
            className="w-full bg-[#1F2937] hover:bg-black text-white py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3"
          >
            <RefreshCw size={24} />
            Intentar de nuevo
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3"
          >
            <Home size={24} />
            Volver al inicio
          </button>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          ¿Necesitas ayuda? Escríbenos a <strong>support@tudominio.com</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderErrorContent;