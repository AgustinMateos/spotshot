'use client';

import React, { useState } from 'react';

export default function ImageWithLoader({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "aspect-square" 
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      
      {/* Loader */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Cargando...</span>
          </div>
        </div>
      )}

      {/* Imagen */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-sm font-medium">
          No se pudo cargar
        </div>
      )}
    </div>
  );
}