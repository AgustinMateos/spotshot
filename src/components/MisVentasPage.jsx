'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MisVentasPage = () => {
  const { token, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    total: 0,
  });

  const [summary, setSummary] = useState({
    totalSalesCount: 0,
    totalPayoutMinor: 0,
    totalPhotosSold: 0,
  });

  const [slider, setSlider] = useState(null);
  // slider = { photos: [], index: number, purchasedAt: string } | null

  useEffect(() => {
    if (authLoading) return;
    if (!token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (authLoading || !token) return;

    const fetchSales = async () => {
      setLoading(true);
      setError('');

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(
          `${API_URL}/api/v1/photographers/me/sales?page=${pagination.page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401) {
          setError('Tu sesión expiró. Inicia sesión nuevamente.');
          logout();
          router.replace('/login');
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setSales(data.items || []);
          setPagination({
            page: data.page || 1,
            totalPages: data.totalPages || 1,
            hasPreviousPage: data.hasPreviousPage || false,
            hasNextPage: data.hasNextPage || false,
            total: data.total || 0,
          });
          setSummary(
            data.summary || {
              totalSalesCount: 0,
              totalPayoutMinor: 0,
              totalPhotosSold: 0,
            }
          );
        } else if (res.status === 409) {
          setError('Tu cuenta de Stripe no está conectada todavía.');
        } else {
          setError(data.message || 'Error al cargar las ventas');
        }
      } catch (err) {
        console.error(err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [token, authLoading, logout, router, pagination.page]);

  const formatAmount = (amountMinor, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format((amountMinor || 0) / 100);
  };

  const goToPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getSalePhotos = (sale) => {
    const photos = [];
    (sale.sessions || []).forEach((session) => {
      const ordered = [...(session.photos || [])].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );
      ordered.forEach((photo) => {
        photos.push({
          ...photo,
          sessionTitle: session.title,
          sessionDescription: session.description,
        });
      });
    });
    return photos;
  };

  const openSlider = (sale, startIndex) => {
    const photos = getSalePhotos(sale);
    if (!photos.length) return;
    setSlider({
      photos,
      index: startIndex,
      purchasedAt: sale.purchasedAt,
    });
  };

  const closeSlider = () => setSlider(null);

  const goPrev = useCallback(() => {
    setSlider((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
      };
    });
  }, []);

  const goNext = useCallback(() => {
    setSlider((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        index: (prev.index + 1) % prev.photos.length,
      };
    });
  }, []);

  useEffect(() => {
    if (!slider) return;

    const onKey = (e) => {
      if (e.key === 'Escape') closeSlider();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [slider, goPrev, goNext]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto px-6 pt-8">
          <div className="h-9 w-48 bg-gray-200 rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white p-10 rounded-3xl shadow">
          <p className="text-red-600 text-xl mb-6">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl hover:bg-black transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const current = slider?.photos?.[slider.index];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 pt-8">
        <h1 className="text-[24px] font-medium text-[#10487C] mb-8">Mis ventas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Ventas totales</p>
            <p className="text-5xl font-semibold text-[#10487C] mt-2">
              {formatAmount(summary.totalPayoutMinor)}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Fotos vendidas</p>
            <p className="text-5xl font-semibold text-[#10487C] mt-2">
              {summary.totalPhotosSold}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Órdenes</p>
            <p className="text-5xl font-semibold text-[#10487C] mt-2">
              {summary.totalSalesCount}
            </p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center">
            <p className="text-3xl text-gray-300 mb-3">Aún no tienes ventas</p>
            <p className="text-gray-500">Cuando tus fotos se vendan aparecerán aquí</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Fotos vendidas</th>
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Fotos</th>
                    <th className="text-right py-5 px-8 font-medium text-gray-600">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => {
                    const salePhotos = getSalePhotos(sale);

                    return (
                      <tr
                        key={sale.orderId}
                        className="border-b border-gray-100 hover:bg-gray-50 align-top"
                      >
                        <td className="py-6 px-8 whitespace-nowrap">
                          {new Date(sale.purchasedAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-6 px-8">
                          <div className="space-y-4">
                            {sale.sessions.map((session) => {
                              const photos = [...(session.photos || [])].sort(
                                (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
                              );

                              return (
                                <div key={session.id}>
                                  <p className="text-sm font-medium text-gray-800 mb-2">
                                    {session.title}
                                  </p>
                                  {session.description && (
                                    <p className="text-xs text-gray-500 mb-2">
                                      {session.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-2">
                                    {photos.map((photo) => {
                                      const globalIndex = salePhotos.findIndex(
                                        (p) => p.lineItemId === photo.lineItemId
                                      );

                                      if (photo.previewUrl && photo.imageExists) {
                                        return (
                                          <button
                                            key={photo.lineItemId}
                                            type="button"
                                            onClick={() => openSlider(sale, globalIndex)}
                                            className="block"
                                          >
                                            <img
                                              src={photo.previewUrl}
                                              alt={session.title}
                                              className="h-16 w-16 rounded-xl object-cover border border-gray-100 hover:opacity-90 transition"
                                            />
                                          </button>
                                        );
                                      }

                                      return (
                                        <button
                                          key={photo.lineItemId}
                                          type="button"
                                          onClick={() => openSlider(sale, globalIndex)}
                                          className="h-16 w-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 text-center px-1"
                                        >
                                          Sin preview
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-6 px-8 text-sm font-medium whitespace-nowrap">
                          {sale.photoQuantity} {sale.photoQuantity === 1 ? 'foto' : 'fotos'}
                        </td>
                        <td className="py-6 px-8 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {formatAmount(sale.photographerPayoutMinor, sale.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-8 py-6">
                <p className="text-lg font-medium text-gray-900">
                  Página {pagination.page} de {pagination.totalPages}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={!pagination.hasPreviousPage}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    «
                  </button>
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={!pagination.hasNextPage}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {slider && current && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    onClick={closeSlider}
  >
    {/* luz / overlay de fondo */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

    {/* cruz */}
    <button
      type="button"
      onClick={closeSlider}
      className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white text-gray-900 text-3xl leading-none flex items-center justify-center shadow-lg hover:bg-gray-100"
      aria-label="Cerrar"
    >
      ×
    </button>

    {/* flechas solo si hay más de 1 foto en esa compra */}
    {slider.photos.length > 1 && (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 md:left-8 z-20 w-12 h-12 rounded-full bg-white text-gray-900 text-3xl leading-none flex items-center justify-center shadow-lg hover:bg-gray-100"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-3 md:right-8 z-20 w-12 h-12 rounded-full bg-white text-gray-900 text-3xl leading-none flex items-center justify-center shadow-lg hover:bg-gray-100"
          aria-label="Siguiente"
        >
          ›
        </button>
      </>
    )}

    <div
      className="relative z-10 max-w-5xl w-full text-center"
      onClick={(e) => e.stopPropagation()}
    >
      {current.previewUrl && current.imageExists ? (
        <img
          src={current.previewUrl}
          alt={current.sessionTitle || 'Foto vendida'}
          className="max-h-[75vh] w-auto mx-auto rounded-2xl object-contain shadow-2xl"
        />
      ) : (
        <div className="h-[50vh] rounded-2xl bg-white/10 flex items-center justify-center text-white/80">
          Preview no disponible
        </div>
      )}

      <div className="mt-4 text-white">
        <p className="font-medium">{current.sessionTitle}</p>
        {current.sessionDescription && (
          <p className="text-sm text-white/70">{current.sessionDescription}</p>
        )}
        <p className="text-sm text-white/60 mt-1">
          {slider.index + 1} / {slider.photos.length}
          {slider.purchasedAt
            ? ` · ${new Date(slider.purchasedAt).toLocaleDateString('es-ES')}`
            : ''}
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MisVentasPage;