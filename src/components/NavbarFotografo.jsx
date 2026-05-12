'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NavbarFotografo() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const alias = user?.alias || 'Fotógrafo';
  
  // ✅ CORRECTO: Usamos avatarUrl del backend
  const avatarUrl = user?.avatarUrl;

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
    } catch (err) {
      console.error('Error logout backend:', err);
    } finally {
      logout();
      setIsOpen(false);
      setIsDropdownOpen(false);
      setLoadingLogout(false);
      router.push('/login');
    }
  };

  return (
    <nav className="bg-[#103457] shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-5 flex justify-between items-center">
        
        {/* Logo */}
         <div className="flex items-center">
                           <a href="/shot"  className="flex items-center gap-2">
                          <div className="w-7 h-7  flex items-center justify-center">
                            <Image 
                             src={'/icons/logo.svg'}
                                    alt="Surf"
                                    width={400}
                                    height={220}
                                    className="w-full h-full object-cover"
                                  />
                          </div>
                          <span className="text-white text-2xl font-semibold tracking-tighter">
                            SpotShot
                          </span>
                        </a>
                        </div>

        {/* Menú Desktop */}
        <div className='flex '><div className="hidden pr-[80px] md:flex items-center gap-10 text-sm font-medium text-gray-300">
          <a href="/shot" className="hover:text-white transition-colors">Explorar sesiones</a>
          <a href="/shot/mis-sesiones" className="hover:text-white transition-colors">Mis sesiones</a>
          <a href="/shot/mis-ventas" className="hover:text-white transition-colors">Mis ventas</a>
        </div>

        {/* Perfil Desktop + Dropdown */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <span className="text-sm font-medium text-gray-200">{alias}</span>
            
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={alias}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-white shadow"
                unoptimized
              />
            ) : (
              <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800 border border-white shadow">
                {initials}
              </div>
            )}
          </button>

          {/* Dropdown Desktop */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">{alias}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>

              <a
                href="/shot/perfil"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <img src="/icons/miCuenta.svg" alt="" className="w-5 h-5" />
                Mi cuenta
              </a>

              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-gray-50 text-left"
              >
                <img src="/icons/exit.svg" alt="" className="w-5 h-5" />
                {loadingLogout ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            </div>
          )}
        </div></div>

        {/* Botón Hamburguesa Mobile */}
        <button
  onClick={() => setIsOpen(!isOpen)}
  className="md:hidden text-white p-2 focus:outline-none"
>
  <div className={`w-7 h-7 relative transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}>
    {/* Línea superior */}
    <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
    {/* Línea media */}
    <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`} />
    {/* Línea inferior */}
    <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
  </div>
</button>
      </div>

      {/* Menú Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#103457] border-t border-white/10">
          <div className="px-6 py-8 flex flex-col gap-6 text-white">
             {/* Info del usuario en móvil */}
            <div className="flex items-center gap-4 pb-[20px]" >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={alias}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  unoptimized
                />
              ) : (
                <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-800">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{alias}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <a href="/shot" className="text-lg" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
            <a href="/shot/mis-sesiones" className="text-lg" onClick={() => setIsOpen(false)}>Mis sesiones</a>
            <a href="/shot/mis-ventas" className="text-lg" onClick={() => setIsOpen(false)}>Mis ventas</a>

            <hr className="border-white/10" />

           

            <a href="/shot/perfil" className="flex items-center gap-3 text-lg" onClick={() => setIsOpen(false)}>
              <img src="/icons/miCuenta.svg" alt="" className="w-6 h-6" />
              Mi cuenta
            </a>

            <button
              onClick={handleLogout}
              disabled={loadingLogout}
              className="flex items-center gap-3 text-red-400 text-lg"
            >
              <img src="/icons/exit.svg" alt="" className="w-6 h-6" />
              {loadingLogout ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}