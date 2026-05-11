'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function ShotPage() {
  const { user, token, loading: authLoading } = useAuth();
  
  const [stripeConnect, setStripeConnect] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Cargar información completa del perfil (incluyendo Stripe)
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setStripeConnect(data.stripeConnect);
        }
      } catch (err) {
        console.error("Error cargando estado de Stripe:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token]);

  const isStripeReady = stripeConnect?.isReady === true;
  const alias = user?.alias || 'Fotógrafo';

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto px-6 py-8">

        {/* Header de bienvenida */}
        <div className="bg-[#F1F7FE] rounded-2xl shadow-sm p-8 mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                Hola {alias}!  Empecemos
              </h2>
              <p className="text-[#71717A]">
                Completa estos dos pasos para comenzar a vender tus fotos
              </p>
            </div>

            
          </div>

          {/* Dos pasos */}
          <div className="grid md:grid-cols-3 gap-8 mt-10">

            {/* Paso 1 - Stripe */}
            <div className="border border-gray-200 bg-white rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 1</div>
              <h3 className="text-xl font-semibold mb-2">Conecta tu cuenta de cobro</h3>
              <p className="text-gray-600 mb-6">
                Vinculá Stripe para poder publicar tus sesiones y recibir pagos automáticamente.
              </p>

              <Link
                href="/shot/perfil"
                className={`px-6 py-3 rounded-xl font-medium transition inline-block ${
                  isStripeReady 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {isStripeReady ? ' Stripe Conectado' : 'Conectar Stripe'}
              </Link>
              
            </div>

            {/* Paso 2 - Crear Sesión */}
            <div className="border border-gray-200 bg-white rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 2</div>
              <h3 className="text-xl font-semibold mb-2">Crea tu primera sesión</h3>
              <p className="text-gray-600 mb-6">
                Sube tus fotos, configurá precios y publica para que los surfistas te encuentren.
              </p>

              <button 
                disabled={!isStripeReady}
                className={`px-8 py-3.5 rounded-2xl flex items-center gap-3 transition font-medium ${
                  isStripeReady 
                    ? 'bg-gray-900 text-white hover:bg-black' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">+</span>
                Crear sesión
              </button>

              {!isStripeReady && (
                <p className="text-xs text-amber-600 mt-3">
                  Conecta Stripe primero para habilitar esta opción
                </p>
              )}
            </div>
            <div><Image height={183} width={280} alt='img' src={'/icons/stripeSteps.svg'}/></div>
          </div>
        </div>

        {/* Sección Mis Sesiones */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Mis sesiones</h3>

          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mb-6">
              <img src="/crearPrimerAlbum.svg" alt="Sin sesiones" className="w-24 h-24 opacity-75" />
            </div>
            <h4 className="text-xl font-medium text-gray-800 mb-2">Aún no tienes sesiones</h4>
            <p className="text-gray-500 text-center max-w-sm mb-8">
              Sube tu primera sesión para empezar a vender tus mejores capturas
            </p>
            <button 
              disabled={!isStripeReady}
              className={`px-8 py-3.5 rounded-2xl flex items-center gap-3 transition font-medium ${
                isStripeReady 
                  ? 'bg-gray-900 text-white hover:bg-black' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-xl">+</span>
              Crear sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}