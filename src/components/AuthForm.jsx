'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        endpoint = '/api/v1/photographers/auth/login';
        body = { email, password };
      } else if (isRegister) {
        endpoint = '/api/v1/photographers/auth/register';
        body = { alias, email, password };
      } else if (isForgot) {
        // ← NUEVO ENDPOINT
        endpoint = '/api/v1/photographers/auth/forgot-password';
        body = { email };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setSuccess(data.message || 'Cuenta creada. Revisa tu email para activarla.');
          setAlias(''); setEmail(''); setPassword('');
        } 
        else if (isLogin) {
          if (data.access_token) {
            login(data.access_token, data.photographer);
          }
          setSuccess(data.message || 'Inicio de sesión exitoso');
          
          setTimeout(() => {
            router.push('/shot');
          }, 1000);
        } 
        else if (isForgot) {
          // Mensaje genérico (el backend siempre devuelve 200)
          setSuccess(data.message || 'Si el email está registrado, te enviamos instrucciones para restablecer tu contraseña.');
          setEmail(''); // Limpiar campo
        }
      } else {
        setError(data.message || 'Ocurrió un error');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
        {isLogin && 'Inicia sesión en Spotshot'}
        {isRegister && 'Crea tu cuenta de fotógrafo'}
        {isForgot && '¿Olvidaste tu contraseña?'}
      </h2>

      <p className="text-gray-600 text-center mb-8">
        {isLogin && 'Bienvenido de nuevo'}
        {isRegister && 'Ingresa tus datos para crear tu cuenta de fotógrafo'}
        {isForgot && 'Ingresa tu correo electrónico y te enviaremos un enlace'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alias */}
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
            <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900" placeholder="Tu alias único" required />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900" placeholder="m@ejemplo.com" required />
        </div>

        {/* Contraseña */}
        {(isLogin || isRegister) && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 pr-12"
              required
              minLength={8}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-11 text-gray-400 hover:text-gray-600">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        )}

        {/* Link "¿Olvidaste tu contraseña?" - Mejorado */}
        {isLogin && (
          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        {error && <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-green-600 text-center bg-green-50 py-3 rounded-xl">{success}</p>}

        <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70">
          {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : isForgot ? 'Enviar enlace' : 'Iniciar sesión'}
        </button>
      </form>

      {/* Links inferiores */}
      <p className="text-center mt-8 text-gray-600">
        {isLogin && <>¿No tienes cuenta? <a href="/register" className="text-blue-600 font-medium hover:underline">Creá una cuenta</a></>}
        {isRegister && <>¿Ya tienes una cuenta? <a href="/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</a></>}
        {isForgot && <>¿Recordaste tu contraseña? <a href="/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</a></>}
      </p>
    </>
  );
}