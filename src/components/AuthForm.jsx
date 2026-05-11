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
  const [showPassword, setShowPassword] = useState(false);   // ← Nuevo estado

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
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-5 py-4 border text-[#71717A] border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
              placeholder="Tu alias único"
              required
              minLength={3}
              maxLength={30}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 border text-[#71717A] border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            placeholder="spotshot@ejemplo.com"
            required
          />
        </div>

        {(isLogin || isRegister) && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 text-[#71717A] rounded-2xl focus:outline-none focus:border-gray-900 pr-12"
              required
              minLength={8}
            />
            
            {/* Ojo Profesional */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-11 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908l3.42 3.42M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>
        )}

        {error && <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-green-600 text-center bg-green-50 py-3 rounded-xl">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70"
        >
          {loading ? 'Procesando...' 
            : isRegister ? 'Crear cuenta' 
            : isForgot ? 'Enviar enlace' 
            : 'Iniciar sesión'}
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
    </>
  );
}