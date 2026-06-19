'use client';

import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const Downloads = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const accessCode = searchParams.get('code');

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://spotshot-api-six.vercel.app';

  // 1. Obtener información de la orden (previews)
  useEffect(() => {
    const fetchOrder = async () => {
      if (!accessCode) {
        setError("No se encontró código de acceso");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/v1/purchases/access/${accessCode}`,
          { method: 'GET' }
        );

        if (!res.ok) {
          if (res.status === 403) throw new Error("Código de acceso inválido o expirado");
          throw new Error("Error al cargar tu compra");
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
  }, [accessCode]);

  // 2. Descargar todo como ZIP
  const handleDownloadAllAsZip = async () => {
    if (!accessCode || downloading || !orderData?.downloadsAvailable) return;

    setDownloading(true);
    try {
      const imageIds = orderData.images?.map(img => img.id) || [];

      const res = await fetch(
        `${API_URL}/api/v1/purchases/access/${accessCode}/downloads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageIds })
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        console.error('Status:', res.status, 'Body:', errorBody);

        if (res.status === 410) throw new Error("Las imágenes ya no están disponibles");
        throw new Error(errorBody?.message || `Error al generar descargas (${res.status})`);
      }

      const { downloads: downloadLinks } = await res.json();

      // JSZip + file-saver
      const JSZip = (await import('jszip')).default;
      const FileSaver = (await import('file-saver')).default;

      const zip = new JSZip();
      const folder = zip.folder("SpotShot-Mis-Imágenes");

      const promises = downloadLinks.map(async (item, index) => {
        try {
          const response = await fetch(item.signedUrl);
          if (!response.ok) {
            console.error(`Fallo al descargar imagen ${item.imageId}:`, response.status);
            return;
          }
          const blob = await response.blob();
          const fileName = `imagen-${String(index + 1).padStart(3, '0')}-${item.imageId.slice(0, 8)}.jpg`;
          folder.file(fileName, blob);
        } catch (err) {
          console.error(`Error de red en imagen ${item.imageId}:`, err);
        }
      });

      await Promise.all(promises);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      FileSaver.saveAs(zipBlob, `SpotShot-Orden-${orderData.orderId.slice(0, 8)}.zip`);

    } catch (err) {
      console.error(err);
      alert(err.message || "Hubo un error al descargar el ZIP");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p>Cargando tus imágenes...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-red-600 text-xl mb-4">{error || "No se pudo cargar la orden"}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-800 text-white px-6 py-3 rounded-xl"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-black transition"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <h1 className="text-4xl font-bold text-[#0D2744] mb-2">Tus Imágenes</h1>
        <p className="text-gray-600 mb-8">Orden: <span className="font-mono">{orderData.orderId}</span></p>

        {/* Estado de la compra */}
        <div className="bg-white border rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <p className="font-semibold text-green-600">✅ {orderData.digitalDeliveryStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Válido hasta</p>
              <p className="font-medium">
                {new Date(orderData.accessExpiresAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        {/* Botón principal de descarga */}
        <button
          onClick={handleDownloadAllAsZip}
          disabled={downloading || !orderData.downloadsAvailable}
          className="w-full bg-[#1F2937] hover:bg-black disabled:bg-gray-400 text-white py-5 px-8 rounded-2xl text-xl font-medium flex items-center justify-center gap-4 transition mb-10"
        >
          {downloading ? (
            <>
              <Loader2 className="animate-spin" size={28} />
              Creando archivo ZIP...
            </>
          ) : (
            <>
              <Download size={28} />
              Descargar Todo como ZIP ({orderData.images?.length} imágenes)
            </>
          )}
        </button>

        {/* Galería de Previews */}
        <h2 className="text-2xl font-semibold mb-6">Vista Previa</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {orderData.images?.map((img) => (
            <div key={img.id} className="aspect-square rounded-2xl overflow-hidden shadow-md">
              <img
                src={img.previewUrl}
                alt="Preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>

        {orderData.imagesUnavailableMessage && (
          <p className="text-amber-600 mt-6 text-center">
            {orderData.imagesUnavailableMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Downloads;