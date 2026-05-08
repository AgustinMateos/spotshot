'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function NavbarFotografo() {
  const { user } = useAuth();

  // Si no hay usuario, mostramos valores por defecto
  const alias = user?.alias || 'Fotógrafo';
  const initials = alias
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Máximo 2 letras

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
          <a href="/shot" className="hover:text-white transition-colors">
            Explorar sesiones
          </a>
          <a href="/shot/mis-sesiones" className="hover:text-white transition-colors">
            Mis sesiones
          </a>
          <a href="/shot/mis-ventas" className="hover:text-white transition-colors">
            Mis ventas
          </a>
        </div>

        {/* Perfil dinámico */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-200">
            {alias}
          </span>
          
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800 border border-white shadow">
            {initials}
          </div>
        </div>

      </div>
    </nav>
  );
}