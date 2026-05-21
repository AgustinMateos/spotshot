'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#103457] shadow-sm sticky top-0 z-50">
      <div className="max-w-full px-6 py-5 flex items-center justify-between">
        
        {/* Logo SpotShot */}
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

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <a 
            href="/sesiones" 
            className="hover:text-white/80 transition-colors font-medium"
          >
            Explorar sesiones
          </a>
          <a 
            href="/register" 
            className="hover:text-white/80 transition-colors font-medium"
          >
            Vender fotos
          </a>
          
          <Link 
            href="/login" 
            className="bg-white h-9 flex items-center text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-all active:scale-95"
          >
            Sign in
          </Link>
        </div>

        {/* Hamburguesa Animada (igual que en NavbarFotografo) */}
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
          <div className="px-6 py-8 flex flex-col gap-6 text-white text-lg">
            <a href="/shot" onClick={() => setIsOpen(false)}>Explorar sesiones</a>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;