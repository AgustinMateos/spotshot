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
  const [downloading, setDownloading] = useState(false);

  // Soporta ambos nombres de parámetro (Stripe a veces usa uno u otro)
  const checkoutSessionId = searchParams.get('checkout_session_id') || 
                           searchParams.get('session_id');

  // Limpiar carrito al cargar
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Obtener datos de la orden
  useEffect(() => {
    const fetchOrder = async () => {
      if (!checkoutSessionId) {
        setError("No se encontró el ID de sesión de Stripe");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Buscando orden con ID:", checkoutSessionId);

        const res = await fetch(
          `https://spotshot-api-six.vercel.app/api/v1/purchases/orders/by-checkout/${checkoutSessionId}`,
          { 
            method: 'GET',
            headers: { 'accept': 'application/json' }
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        console.log("✅ Orden obtenida:", data);
        setOrderData(data);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [checkoutSessionId]);

  // Descargar todas las imágenes
  const handleDownloadAllAsZip = async () => {
  if (!checkoutSessionId || downloading) return;

  setDownloading(true);

  try {
    // 1. Obtener las URLs firmadas
    const res = await fetch(
      `https://spotshot-api-six.vercel.app/api/v1/purchases/orders/by-checkout/${checkoutSessionId}/downloads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // todas las imágenes
      }
    );

    if (!res.ok) throw new Error("Error al generar enlaces de descarga");

    const { downloads } = await res.json();

    if (!downloads || downloads.length === 0) {
      alert("No hay imágenes para descargar");
      return;
    }

    // 2. Crear ZIP
    const JSZip = (await import('jszip')).default;
    const FileSaver = (await import('file-saver')).default;
    
    const zip = new JSZip();
    const folder = zip.folder("Mis-Imágenes-SpotShot");

    // Descargar las imágenes y agregarlas al ZIP
    const promises = downloads.map(async (item, index) => {
      const response = await fetch(item.signedUrl);
      const blob = await response.blob();
      
      const fileName = `imagen-${String(index + 1).padStart(3, '0')}-${item.imageId.slice(0, 8)}.jpg`;
      
      folder.file(fileName, blob);
    });

    await Promise.all(promises);

    // 3. Generar y descargar el ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    FileSaver.saveAs(zipBlob, `SpotShot-Orden-${orderData.orderId.slice(0, 8)}.zip`);

    alert("¡Descarga completada! 🎉");

  } catch (err) {
    console.error(err);
    alert("Hubo un error al crear el archivo ZIP");
  } finally {
    setDownloading(false);
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
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600 p-6 text-center">
        {error || "Hubo un problema al cargar tu orden"}
        <br />
        <small className="text-gray-500 mt-2 block">ID recibido: {checkoutSessionId || 'ninguno'}</small>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 mt-20 bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-10 flex justify-center">
          <img src="/success-illustration.svg" alt="Felicitaciones" className="w-80 h-auto" />
        </div>

        <h1 className="text-4xl font-bold text-[#0D2744] mb-4 leading-tight">
          ¡Felicitaciones! Tu compra fue exitosa
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Tus imágenes están listas para descargar.
        </p>

        <div className="space-y-4">
         <button
  onClick={handleDownloadAllAsZip}
  disabled={downloading}
  className="w-full bg-[#1F2937] hover:bg-black disabled:bg-gray-400 text-white py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-3 transition"
>
  <Download size={24} />
  {downloading 
    ? 'Creando archivo ZIP...' 
    : `Descargar Todo como ZIP (${orderData.images?.length || 0} imágenes)`
  }
</button>

          <button
            onClick={() => router.push('/sesiones')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl text-lg font-medium flex items-center justify-center gap-2"
          >
            Explorar más sesiones
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Previews */}
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