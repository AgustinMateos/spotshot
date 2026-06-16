'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function NavbarComponent() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const isHome = pathname === '/';
  const isLoggedIn = !!token && !!user && !authLoading;

  const alias = user?.alias || 'Usuario';
  const avatarUrl = user?.avatarUrl;
  const initials = alias
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const hasBackground = !isHome || scrolled;

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
      console.error('Error logout:', err);
    } finally {
      logout();
      setIsOpen(false);
      setIsDropdownOpen(false);
      setLoadingLogout(false);
      router.push('/login');
    }
  };

  // Mientras carga la autenticación mostramos un navbar neutro (evita flash)
  if (authLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#103457] h-20 shadow-md" />
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      hasBackground 
        ? 'bg-[#103457] backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-full px-6 py-5 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <Image 
                src="/icons/logo.svg"
                alt="SpotShot"
                width={400}
                height={220}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-2xl font-semibold tracking-tighter">
              SpotShot
            </span>
          </Link>
        </div>
 
        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-8 text-white">
          {isLoggedIn && (
            <>
              <a href="/shot" className="hover:text-white/80 transition-colors font-medium">
                Inicio
              </a>
             
            </>
          )}
          <a href="/sesiones" className="hover:text-white/80 transition-colors font-medium">
            Explorar sesiones
          </a>

          {isLoggedIn && (
            <>
              <a href="/shot/misSesiones" className="hover:text-white/80 transition-colors font-medium">
                Mis sesiones
              </a>
              <a href="/shot/misVentas" className="hover:text-white/80 transition-colors font-medium">
                Mis ventas
              </a>
            </>
          )}

          {!isLoggedIn && (
            <a href="/register" className="hover:text-white/80 transition-colors font-medium">
              Vender fotos
            </a>
          )}

          {isLoggedIn ? (
            <div className="relative ml-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
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

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{alias}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <a href="/shot/perfil" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
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
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-white h-9 flex items-center text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-all active:scale-95"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Hamburguesa */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
        >
          <div className={`w-7 h-7 relative transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
            <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`} />
            <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
          </div>
        </button>
      </div>

      {/* Menú Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#103457] border-t border-white/10">
          <div className="px-6 py-8 flex flex-col gap-6 text-white text-lg">
            {isLoggedIn ? (
              <>
                {/* Info del usuario */}
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
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
                    <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-800 border-2 border-white">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{alias}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <a href="/shot" onClick={() => setIsOpen(false)}>Inicio</a>
                <a href="/sesiones" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
                <a href="/shot/misSesiones" onClick={() => setIsOpen(false)}>Mis sesiones</a>
                <a href="/shot/misVentas" onClick={() => setIsOpen(false)}>Mis ventas</a>
                <a href="/shot/perfil" onClick={() => setIsOpen(false)}>Mi cuenta</a>

                <hr className="border-white/10 my-2" />

                <button
                  onClick={handleLogout}
                  disabled={loadingLogout}
                  className="flex items-center gap-3 text-red-400 text-lg mt-2"
                >
                  <img src="/icons/logout.svg" alt="" className="w-6 h-6" />
                  {loadingLogout ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
              </>
            ) : (
              <>
                <a href="/sesiones" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
                <a href="/register" onClick={() => setIsOpen(false)}>Vender fotos</a>
                
                <div className="pt-4">
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="block bg-white text-black text-center py-4 rounded-2xl font-medium hover:bg-white/90"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function NavbarComponent() {
//   const { user, token, logout, loading: authLoading } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();

//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [loadingLogout, setLoadingLogout] = useState(false);

//   const isHome = pathname === '/';
//   const isLoggedIn = !!token && !!user && !authLoading;

//   const alias = user?.alias || 'Usuario';
//   const avatarUrl = user?.avatarUrl;
//   const initials = alias
//     .trim()
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     handleScroll(); // ← lee el scroll actual al montar
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsOpen(false);
//     setIsDropdownOpen(false);
//   }, [pathname]);

//   const hasBackground = !isHome || scrolled;

//   const handleLogout = async () => {
//     setLoadingLogout(true);
//     try {
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
//       await fetch(`${API_URL}/api/v1/photographers/auth/logout`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//     } catch (err) {
//       console.error('Error logout:', err);
//     } finally {
//       logout();
//       setIsOpen(false);
//       setIsDropdownOpen(false);
//       setLoadingLogout(false);
//       router.push('/login');
//     }
//   };

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       hasBackground
//         ? 'bg-[#103457] backdrop-blur-md shadow-md'
//         : 'bg-transparent'
//     }`}>
//       <div className="max-w-full px-6 py-5 flex items-center justify-between">

//         {/* Logo */}
//         <div className="flex items-center">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-7 h-7 flex items-center justify-center">
//               <Image
//                 src="/icons/logo.svg"
//                 alt="SpotShot"
//                 width={400}
//                 height={220}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <span className="text-white text-2xl font-semibold tracking-tighter">SpotShot</span>
//           </Link>
//         </div>

//         {/* Menú Desktop */}
//         <div className="hidden md:flex items-center gap-8 text-white">
//           <a href="/sesiones" className="hover:text-white/80 transition-colors font-medium">
//             Explorar sesiones
//           </a>

//           {/* opacity-0 mientras carga — sin remount, sin flash */}
//           <div className={`flex items-center gap-8 transition-opacity duration-150 ${authLoading ? 'opacity-0' : 'opacity-100'}`}>
//             {isLoggedIn ? (
//               <>
//                 <a href="/shot/misSesiones" className="hover:text-white/80 transition-colors font-medium">
//                   Mis sesiones
//                 </a>
//                 <a href="/shot/misVentas" className="hover:text-white/80 transition-colors font-medium">
//                   Mis ventas
//                 </a>

//                 <div className="relative ml-6">
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
//                   >
//                     <span className="text-sm font-medium text-gray-200">{alias}</span>
//                     {avatarUrl ? (
//                       <Image
//                         src={avatarUrl}
//                         alt={alias}
//                         width={36}
//                         height={36}
//                         className="w-9 h-9 rounded-full object-cover border border-white shadow"
//                         unoptimized
//                       />
//                     ) : (
//                       <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800 border border-white shadow">
//                         {initials}
//                       </div>
//                     )}
//                   </button>

//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="font-medium text-gray-900">{alias}</p>
//                         <p className="text-sm text-gray-500 truncate">{user?.email}</p>
//                       </div>
                      
//                        <a href="/shot/perfil"
//                         className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         <img src="/icons/miCuenta.svg" alt="" className="w-5 h-5" />
//                         Mi cuenta
//                       </a>
//                       <button
//                         onClick={handleLogout}
//                         disabled={loadingLogout}
//                         className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-gray-50 text-left"
//                       >
//                         <img src="/icons/exit.svg" alt="" className="w-5 h-5" />
//                         {loadingLogout ? 'Cerrando...' : 'Cerrar sesión'}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <a href="/register" className="hover:text-white/80 transition-colors font-medium">
//                   Vender fotos
//                 </a>
//                 <Link
//                   href="/login"
//                   className="bg-white h-9 flex items-center text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-all active:scale-95"
//                 >
//                   Sign in
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Hamburguesa */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="md:hidden text-white p-2 focus:outline-none"
//         >
//           <div className={`w-7 h-7 relative transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}>
//             <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
//             <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`} />
//             <span className={`absolute h-[2.5px] w-7 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
//           </div>
//         </button>
//       </div>

//       {/* Menú Mobile */}
//       {isOpen && (
//         <div className="md:hidden bg-[#103457] border-t border-white/10">
//           <div className={`px-6 py-8 flex flex-col gap-6 text-white text-lg transition-opacity duration-150 ${authLoading ? 'opacity-0' : 'opacity-100'}`}>
//             {isLoggedIn ? (
//               <>
//                 <div className="flex items-center gap-4 pb-4 border-b border-white/10">
//                   {avatarUrl ? (
//                     <Image
//                       src={avatarUrl}
//                       alt={alias}
//                       width={56}
//                       height={56}
//                       className="w-14 h-14 rounded-full object-cover border-2 border-white"
//                       unoptimized
//                     />
//                   ) : (
//                     <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-800 border-2 border-white">
//                       {initials}
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold text-lg">{alias}</p>
//                     <p className="text-sm text-gray-400">{user?.email}</p>
//                   </div>
//                 </div>
//                 <a href="/sesiones" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
//                 <a href="/shot/misSesiones" onClick={() => setIsOpen(false)}>Mis sesiones</a>
//                 <a href="/shot/misVentas" onClick={() => setIsOpen(false)}>Mis ventas</a>
//                 <a href="/shot/perfil" onClick={() => setIsOpen(false)}>Mi cuenta</a>
//                 <hr className="border-white/10 my-2" />
//                 <button
//                   onClick={handleLogout}
//                   disabled={loadingLogout}
//                   className="flex items-center gap-3 text-red-400 text-lg mt-2"
//                 >
//                   <img src="/icons/exit.svg" alt="" className="w-6 h-6" />
//                   {loadingLogout ? 'Cerrando sesión...' : 'Cerrar sesión'}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <a href="/sesiones" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
//                 <a href="/register" onClick={() => setIsOpen(false)}>Vender fotos</a>
//                 <div className="pt-4">
//                   <Link
//                     href="/login"
//                     onClick={() => setIsOpen(false)}
//                     className="block bg-white text-black text-center py-4 rounded-2xl font-medium hover:bg-white/90"
//                   >
//                     Sign in
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }