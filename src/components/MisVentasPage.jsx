'use client';

import React, { useState, useEffect } from 'react';
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

  // Redirección
  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace('/login');
    }
  }, [token, authLoading, router]);

  // Cargar ventas
  useEffect(() => {
    if (authLoading || !token) return;

    const fetchSales = async () => {
      setLoading(true);
      setError('');

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(
          `${API_URL}/api/v1/photographers/me/sales?page=${pagination.page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 401) {
          setError("Tu sesión expiró. Inicia sesión nuevamente.");
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
          setSummary(data.summary || {
            totalSalesCount: 0,
            totalPayoutMinor: 0,
            totalPhotosSold: 0,
          });
        } else if (res.status === 409) {
          setError("Tu cuenta de Stripe no está conectada todavía.");
        } else {
          setError(data.message || "Error al cargar las ventas");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
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
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className=" mx-auto px-6 pt-8">
          <div className="h-9 w-48 bg-gray-200 rounded-xl animate-pulse mb-8" />

          {/* Skeleton Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>

          {/* Skeleton Tabla */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-5 px-8"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="text-left py-5 px-8"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="text-left py-5 px-8"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="text-right py-5 px-8"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" /></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-6 px-8"><div className="h-5 w-28 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-6 px-8"><div className="h-5 w-64 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-6 px-8"><div className="h-5 w-16 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-6 px-8 text-right"><div className="h-5 w-24 bg-gray-200 rounded animate-pulse ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className=" mx-auto px-6 pt-8">
        <h1 className="text-[24px] font-medium text-[#10487C] mb-8">Mis ventas</h1>

        {/* Resumen */}
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
            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Sesiones</th>
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Fotos</th>
                    <th className="text-right py-5 px-8 font-medium text-gray-600">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-6 px-8">
                        {new Date(sale.purchasedAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-6 px-8">
                        {sale.sessions.map((s, i) => (
                          <div key={i} className="text-sm">
                            {s.title}
                          </div>
                        ))}
                      </td>
                      <td className="py-6 px-8 text-sm font-medium">
                        {sale.photoQuantity} fotos
                      </td>
                      <td className="py-6 px-8 text-right font-semibold text-gray-900">
                        {formatAmount(sale.photographerPayoutMinor, sale.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
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
    </div>
  );
};

export default MisVentasPage;