'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Validar que venga el token
  useEffect(() => {
    if (!token) {
      setError('Token inválido o faltante. Por favor usa el link del email.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${API_URL}/api/v1/photographers/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || '¡Contraseña restablecida correctamente!');
        
        // Redirigir al login después de éxito
        setTimeout(() => {
          router.push('/login');
        }, 2500);
      } else {
        setError(data.message || 'Error al restablecer la contraseña.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nueva Contraseña</h2>
          <p className="text-gray-600 mt-2">Ingresa tu nueva contraseña</p>
        </div>

        {message ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-semibold text-green-600 mb-4">{message}</h3>
            <p className="text-gray-600">Serás redirigido al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
                placeholder="Repite la nueva contraseña"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70"
            >
              {loading ? 'Procesando...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}