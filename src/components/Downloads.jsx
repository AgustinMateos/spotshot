'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Downloads = () => {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get('code'); // Obtiene el código de la URL

  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDownloads = async (imageIds = []) => {
    if (!accessCode) {
      setError("No se encontró el código de acceso en la URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://spotshot-api-six.vercel.app/api/v1/purchases/access/${accessCode}/downloads`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageIds: imageIds, // array vacío = todas las imágenes
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 410) {
          throw new Error("Las imágenes originales ya no están disponibles (410).");
        }
        throw new Error(`Error ${response.status}: No se pudieron obtener las descargas`);
      }

      const data = await response.json();
      setDownloads(data.downloads || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las descargas automáticamente al montar el componente
  useEffect(() => {
    if (accessCode) {
      fetchDownloads();
    }
  }, [accessCode]);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Downloads</h1>

      {accessCode && (
        <p><strong>Código de acceso:</strong> {accessCode}</p>
      )}

      <button 
        onClick={() => fetchDownloads()} 
        disabled={loading || !accessCode}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Cargando...' : 'Obtener Todas las Descargas'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {downloads.length === 0 && !loading && !error && (
          <p>No hay descargas disponibles.</p>
        )}

        {downloads.map((item) => (
          <div key={item.imageId} style={{ marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
            <p><strong>Image ID:</strong> {item.imageId}</p>
            
            <a 
              href={item.signedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                background: '#0070f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                marginRight: '10px'
              }}
            >
              📥 Descargar Original
            </a>

            <small>
              Expira: {new Date(item.expiresAt).toLocaleString('es-AR')}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;