'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ShieldQuestion, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

export default function EscuelaUnsubscribe() {
  // 'confirm' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('loading');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get('token');

    // Sin token: el backend ya procesó la baja y redirigió aquí
    if (!tokenParam) {
      setStatus('success');
      return;
    }

    // Quita el token de la URL de forma visible, pero lo guardamos para usarlo al confirmar
    url.searchParams.delete('token');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);

    setToken(tokenParam);
    setStatus('confirm');
  }, []);

  const handleConfirm = async () => {
    if (!token) return;

    setStatus('loading');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(
        `${API_URL}/api/v1/public/face-alerts/unsubscribe?token=${encodeURIComponent(token)}`
      );
      setStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-[#B4121B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center">
          <Link href="/escuelaCantabraDeSurf" className="flex items-center gap-4">
            <div className="w-60 h-20 flex items-center justify-center">
              <Image
                src="/escuelaLogo.png"
                alt="Escuela Cántabra de Surf"
                width={400}
                height={220}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 pt-14">
        <div className="bg-white rounded-3xl shadow-xl px-8 py-12 flex flex-col items-center text-center">
          {status === 'confirm' && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldQuestion className="text-[#B4121B]" size={40} />
              </div>

              <h1 className="mt-6 text-2xl md:text-3xl font-extrabold uppercase leading-tight text-[#0D0D0D]">
                ¿Confirmas la baja?
              </h1>

              <p className="mt-5 text-gray-700 text-lg">
                Vamos a eliminar tus datos biométricos y dejarás de recibir avisos de nuevas
                fotos.
              </p>

              <button
                type="button"
                onClick={handleConfirm}
                className="mt-8 inline-flex items-center gap-2 bg-[#B4121B] hover:bg-[#8f0e15] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition"
              >
                CONFIRMAR BAJA
              </button>
            </>
          )}

          {status === 'loading' && (
            <>
              <Loader2 className="text-[#B4121B] animate-spin" size={48} />
              <p className="mt-6 text-gray-700 text-lg">Procesando tu baja…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full bg-[#B4121B] flex items-center justify-center">
                <ShieldCheck className="text-white" size={40} />
              </div>

              <h1 className="mt-6 text-3xl md:text-4xl font-extrabold uppercase leading-tight text-[#0D0D0D]">
                Te has dado <span className="text-[#B4121B]">de baja</span>
              </h1>

              <p className="mt-5 text-gray-700 text-lg">
                Hemos eliminado tus datos biométricos y ya no recibirás más avisos de nuevas
                fotos.
              </p>
              <p className="mt-2 text-gray-500">
                Gracias por haber surfeado con nosotros. ¡Te esperamos en otra ocasión!
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="text-amber-600" size={40} />
              </div>

              <h1 className="mt-6 text-2xl md:text-3xl font-extrabold uppercase leading-tight text-[#0D0D0D]">
                No pudimos procesar tu baja
              </h1>

              <p className="mt-5 text-gray-700 text-lg">
                Hubo un problema al procesar la solicitud. Vuelve a abrir el enlace del email o
                inténtalo de nuevo en unos minutos.
              </p>
            </>
          )}

          {(status === 'success' || status === 'error') && (
            <Link
              href="/escuelaCantabraDeSurf"
              className="mt-8 inline-flex items-center gap-2 bg-[#B4121B] hover:bg-[#8f0e15] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition"
            >
              VOLVER A LA ESCUELA
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
