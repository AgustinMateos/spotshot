'use client';

import React, { useState, useEffect } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkoutSessionId = searchParams.get('session_id'); // ← Stripe suele enviarlo como session_id

  // Limpiar carrito
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Obtener datos de la orden usando el checkoutSessionId
  useEffect(() => {
    const fetchOrder = async () => {
      if (!checkoutSessionId) {
        setError("No se encontró el ID de sesión de Stripe");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://spotshot-api-six.vercel.app/api/v1/purchases/orders/by-checkout/${checkoutSessionId}`,
          { method: 'GET' }
        );

        if (!res.ok) {
          throw new Error("No se pudo obtener la información de tu compra");
        }

        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [checkoutSessionId]);

  const handleGoToDownloads = () => {
    if (orderData?.accessCode) {
      router.push(`/purchase/downloads?code=${orderData.accessCode}`);
    } else {
      alert("No se encontró código de acceso");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Cargando tu orden...
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        {error || "Hubo un problema al cargar tu orden"}
      </div>
    );
  }

  const maskedEmail = orderData.email 
    ? orderData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') 
    : 'tu@email.com';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-10 flex justify-center">
          <img src="/success-illustration.svg" alt="Felicitaciones" className="w-80 h-auto" />
        </div>

        <h1 className="text-4xl font-bold text-[#0D2744] mb-4 leading-tight">
          ¡Felicitaciones! Tu compra fue exitosa
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Te enviamos un email a <strong>{maskedEmail}</strong> con tus imágenes.<br />
          También puedes descargarlas aquí:
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGoToDownloads}
            className="w-full bg-[#1F2937] hover:bg-black text-white py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3 transition"
          >
            <Download size={24} />
            Descargar Imágenes ({orderData.images?.length || 0})
          </button>

          <button
            onClick={() => router.push('/sesiones')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-2"
          >
            Explorar más sesiones
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Mini galería de previews */}
        {orderData.images && orderData.images.length > 0 && (
          <div className="mt-10">
            <p className="text-sm text-gray-500 mb-4">Vista previa de tus imágenes:</p>
            <div className="grid grid-cols-3 gap-3">
              {orderData.images.slice(0, 6).map((img) => (
                <img
                  key={img.id}
                  src={img.previewUrl}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          Orden: <span className="font-mono break-all">{orderData.orderId}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessContent;