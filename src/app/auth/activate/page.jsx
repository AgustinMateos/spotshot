'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token inválido o faltante.');
      return;
    }

    const activateAccount = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        const res = await fetch(`${API_URL}/api/v1/photographers/auth/activate?token=${token}`, {
          method: 'POST',
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('¡Cuenta activada con éxito!');
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Error al activar la cuenta.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión con el servidor.');
      }
    };

    activateAccount();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold">Activando tu cuenta...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-3">{message}</h2>
            <p className="text-gray-600 mb-8">Ya puedes iniciar sesión.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-black"
            >
              Ir a Iniciar Sesión
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-3xl font-bold text-red-600 mb-3">Algo salió mal</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-black"
            >
              Volver al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}