'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    alias: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Opcional: login automático después de registro
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'Error al crear la cuenta');
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
        Crea una cuenta
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Ingresa tu correo electrónico a continuación para crear tu cuenta
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
          <input
            type="text"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            placeholder="Introduce un alias"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            placeholder="m@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-center bg-red-50 py-2 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-70"
        >
          {loading ? 'Creando cuenta...' : 'Continuar'}
        </button>
      </form>

      <p className="text-center mt-8 text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Inicia sesión
        </a>
      </p>

      <p className="text-center text-xs text-gray-500 mt-8">
        Al hacer clic en "Continuar" aceptas los Términos y Condiciones
      </p>
    </>
  );
}