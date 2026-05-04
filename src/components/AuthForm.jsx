'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm({ mode = 'login' }) {   // 'login' | 'register' | 'forgot'
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      let endpoint = '';
      let body = {};

      if (isLogin) {
        endpoint = '/auth/login';
        body = { email, password };
      } else if (isRegister) {
        endpoint = '/auth/register';
        body = { alias, email, password };
      } else if (isForgot) {
        endpoint = '/auth/forgot-password';
        body = { email };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isForgot) {
          setSuccess('Te enviamos un enlace para restablecer tu contraseña');
        } else {
          if (data.token) localStorage.setItem('token', data.token);
          router.push('/');
        }
      } else {
        setError(data.message || 'Ocurrió un error');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
        {isLogin && 'Inicia sesión en Spotshot'}
        {isRegister && 'Crea una cuenta'}
        {isForgot && '¿Olvidaste tu contraseña?'}
      </h2>

      <p className="text-gray-600 text-center mb-8">
        {isLogin && 'Bienvenido de nuevo'}
        {isRegister && 'Ingresa tu correo electrónico a continuación para crear tu cuenta'}
        {isForgot && 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
              placeholder="Introduce un alias"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            placeholder="m@ejemplo.com"
            required
          />
        </div>

               {(isLogin || isRegister) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
              required
            />

            {/* ←←← LINK "Olvidaste tu contraseña?" ←←← */}
            {isLogin && (
              <p className="text-right mt-2">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </p>
            )}
          </div>
        )}

        {error && <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-green-600 text-center bg-green-50 py-3 rounded-xl">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70"
        >
          {loading 
            ? 'Procesando...' 
            : isForgot ? 'Enviar enlace' : 'Continuar'}
        </button>
      </form>

      {/* Links inferiores */}
      <p className="text-center mt-8 text-gray-600">
        {isLogin && (
          <>¿No tienes cuenta? <a href="/register" className="text-blue-600 font-medium hover:underline">Creá una cuenta</a></>
        )}
        {isRegister && (
          <>¿Ya tienes una cuenta? <a href="/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</a></>
        )}
        {isForgot && (
          <>¿Recordaste tu contraseña? <a href="/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</a></>
        )}
      </p>

      <p className="text-center text-xs text-gray-500 mt-8">
        Al continuar aceptas los Términos y Condiciones
      </p>
    </>
  );
}