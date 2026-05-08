'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function NavbarFotografo() {
  const { user, token, logout } = useAuth();   // ← agregamos 'token'
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const alias = user?.alias || 'Fotógrafo';
  const initials = alias
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setLoadingLogout(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      await fetch(`${API_URL}/api/v1/photographers/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Aunque falle el backend, limpiamos el frontend
    } catch (err) {
      console.error('Error al cerrar sesión en backend:', err);
    } finally {
      logout();                    // Limpiamos el contexto y localStorage
      setIsOpen(false);
      setLoadingLogout(false);
      router.push('/login');
    }
  };

  return (
    <nav className="bg-[#103457] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SpotShot
          </h1>
        </div>

        {/* Menú de navegación */}
        <div className="flex items-center gap-10 text-sm font-medium text-gray-300">
          <a href="/shot" className="hover:text-white transition-colors">Explorar sesiones</a>
          <a href="/shot/mis-sesiones" className="hover:text-white transition-colors">Mis sesiones</a>
          <a href="/shot/mis-ventas" className="hover:text-white transition-colors">Mis ventas</a>
        </div>

        {/* Perfil con Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            <span className="text-sm font-medium text-gray-200">{alias}</span>
            <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800 border border-white shadow">
              {initials}
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
              
              {/* Info del usuario */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">{alias}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* Mi Cuenta */}
              <a
                href="/shot/perfil"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <img src="/icons/miCuenta.svg" alt="Mi cuenta" className="w-5 h-5" />
                Mi cuenta
              </a>

              {/* Cerrar Sesión */}
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <img src="/icons/exit.svg" alt="Cerrar sesión" className="w-5 h-5" />
                {loadingLogout ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}