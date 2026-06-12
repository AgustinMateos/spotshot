import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = ({ isShotSection = false }) => {
  const logoHref = isShotSection ? '/shot' : '/';

  return (
    <footer className="bg-[#103457] text-white py-12 z-10">
      <div className=" mx-auto px-6">
        
        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo Dinámico */}
          <div className="flex items-center">
            <Link 
              href={logoHref} 
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
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

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:text-base">
            <a href="/sesiones" className="hover:text-[#D4A373] transition-colors">
              Buscar sesión
            </a>
            <a href="/register" className="hover:text-[#D4A373] transition-colors">
              Para fotógrafos
            </a>
            <a href="/faqs" className="hover:text-[#D4A373] transition-colors">
              FAQs
            </a>
            <a href="/sesiones/contacto" className="hover:text-[#D4A373] transition-colors">
              Contacto
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 my-8"></div>

        {/* Parte inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <div>
            <a href="/terminos-y-condiciones" className="hover:text-white transition-colors">
              Términos y Condiciones
            </a>
          </div>
          <div>
            © 2026 SpotShot. Todos los derechos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;