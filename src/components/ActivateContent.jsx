'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ActivateContent() {
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

        // ✅ GET + token en query string
        const res = await fetch(`${API_URL}/api/v1/photographers/auth/activate?token=${token}`, {
          method: 'GET',
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('¡Cuenta activada correctamente! 🎉');
          
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'No se pudo activar la cuenta.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión con el servidor.');
      }
    };

    activateAccount();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        
        {status === 'loading' && (
          <>
            <div className="animate-spin w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold">Activando tu cuenta...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">{message}</h2>
            <p className="text-gray-600">Serás redirigido al login en unos segundos...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">No se pudo activar</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-black"
            >
              Ir al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}