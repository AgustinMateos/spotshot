'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Lado izquierdo - Marketing */}
      <div className="hidden lg:flex w-1/2 bg-[#f8fafc] flex-col justify-center p-12 relative overflow-hidden">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Convierte tus fotos de surf<br />en ingresos reales.
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Únete a una plataforma curada diseñada para fotógrafos de surf que desean monetizar su trabajo.
          </p>

          <ul className="mt-10 space-y-4">
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              Mantén el control de tus precios
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              Llega a surfistas que buscan activamente tus fotos
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              Sin costos iniciales
            </li>
          </ul>
        </div>

        {/* Imágenes de fondo (podes agregar más) */}
        <div className="absolute bottom-12 left-12 flex gap-4 opacity-80">
          <img src="/images/surf1.jpg" alt="surf" className="w-40 rounded-2xl shadow-lg" />
          <img src="/images/surf2.jpg" alt="surf" className="w-40 rounded-2xl shadow-lg mt-8" />
          <img src="/images/surf3.jpg" alt="surf" className="w-40 rounded-2xl shadow-lg" />
        </div>
      </div>

      {/* Lado derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900">Iniciá sesión</h2>
            <p className="text-gray-600 mt-3">Bienvenido de nuevo a SpotShot</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 text-lg"
                placeholder="m@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 text-lg"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm bg-red-50 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              ¿No tenés cuenta?{' '}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Crea una cuenta
              </a>
            </p>
          </div>

          <div className="text-center text-xs text-gray-500 mt-10">
            Al iniciar sesión aceptás los Términos y Condiciones
          </div>
        </div>
      </div>
    </div>
  );
}