import React from 'react';
import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white py-12 z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Contenido principal del footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo */}
           <div className="flex items-center">
                             <a href="/"  className="flex items-center gap-2">
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

          {/* Links de navegación */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:text-base">
            <a href="#" className="hover:text-[#D4A373] transition-colors">
              Buscar sesión
            </a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">
              Para fotógrafos
            </a>
            <a href="/faqs" className="hover:text-[#D4A373] transition-colors">
              FAQs
            </a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">
              Contacto
            </a>
          </div>
        </div>

        {/* Línea divisoria */}
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