'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MisVentasPage = () => {
  const { token, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  // Redirección solo después de que el contexto termine de cargar
  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace('/login');
    }
  }, [token, authLoading, router]);

  // Cargar movimientos de Stripe
  useEffect(() => {
    if (authLoading || !token) return;

    const fetchMovements = async () => {
      setLoading(true);
      setError('');

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me/stripe/movements?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          setError("Tu sesión expiró. Inicia sesión nuevamente.");
          logout();
          router.replace('/login');
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setMovements(data.movements || []);
        } else if (res.status === 409) {
          setError("Tu cuenta de Stripe no está conectada todavía. Completa el onboarding.");
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

    fetchMovements();
  }, [token, authLoading, logout, router]);

  // Paginación
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const ventasPaginaActual = movements.slice(indiceInicial, indiceInicial + itemsPorPagina);
  const totalPaginas = Math.ceil(movements.length / itemsPorPagina);

  const formatAmount = (amount, currency = 'GBP') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format((amount || 0) / 100);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando tus ventas...</p>
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
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis ventas</h1>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Ventas totales</p>
            <p className="text-5xl font-semibold text-gray-900 mt-2">
              {movements.length > 0 
                ? formatAmount(movements.reduce((sum, m) => sum + (m.net || m.amount), 0))
                : "£0"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Movimientos</p>
            <p className="text-5xl font-semibold text-gray-900 mt-2">{movements.length}</p>
          </div>
        </div>

        {movements.length === 0 ? (
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
                    <th className="text-left py-5 px-8 font-medium text-gray-600">Descripción</th>
                    <th className="text-right py-5 px-8 font-medium text-gray-600">Monto Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPaginaActual.map((mov) => (
                    <tr key={mov.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-6 px-8">{new Date(mov.created).toLocaleDateString('es-ES')}</td>
                      <td className="py-6 px-8">
                        <p className="font-medium">{mov.description || mov.type}</p>
                        <p className="text-sm text-gray-500 capitalize">{mov.status}</p>
                      </td>
                      <td className="py-6 px-8 text-right font-semibold text-gray-900">
                        {formatAmount(mov.net || mov.amount, mov.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación - Diseño exacto */}
            <div className="flex items-center justify-between px-8 py-6 border-t">
              <p className="text-lg font-medium text-gray-900">
                Page {paginaActual} of {totalPaginas}
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setPaginaActual(1)} 
                  disabled={paginaActual === 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  «
                </button>
                <button 
                  onClick={() => setPaginaActual(paginaActual - 1)} 
                  disabled={paginaActual === 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  ‹
                </button>

                <button 
                  onClick={() => setPaginaActual(paginaActual + 1)} 
                  disabled={paginaActual === totalPaginas}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  ›
                </button>
                <button 
                  onClick={() => setPaginaActual(totalPaginas)} 
                  disabled={paginaActual === totalPaginas}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisVentasPage;