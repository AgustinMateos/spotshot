import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Contenido principal del footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight">SPOTSHOT</h2>
          </div>

          {/* Links de navegación */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:text-base">
            <a href="#" className="hover:text-[#D4A373] transition-colors">
              Buscar sesión
            </a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">
              Para fotógrafos
            </a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">
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
            <a href="#" className="hover:text-white transition-colors">
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