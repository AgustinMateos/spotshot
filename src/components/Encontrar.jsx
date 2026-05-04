import React from 'react';

const Encontrar = () => {
  return (
    <div className="w-full mx-auto py-16 px-6 bg-[#FAFBFF] relative overflow-hidden h-[596px] flex items-center justify-center">
      
      {/* Imagen de fondo CENTRADA en el medio */}
      <img
        src="/encontrar/curva.svg"
        alt=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[114px] 
                   w-[833px] h-auto max-w-[90%] md:max-w-none 
                   opacity-30 pointer-events-none z-0"
      />

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Título principal */}
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
          Encontrar tus fotos es fácil.
        </h2>

        {/* Contenedor de las 3 cards */}
        <div className="relative flex flex-col md:flex-row justify-center items-start gap-10 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-[376px] h-[245px] p-8 flex flex-col  z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/lupa.svg" 
                alt="Buscar sesión" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Busca tu sesión
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Encuentra las sesiones disponibles por lugar y fecha.
            </p>
          </div>

          {/* Card 2 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-[376px] h-[245px] p-8 flex flex-col z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/elige.svg" 
                alt="Descargar fotos" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Descarga al instante
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compra segura y acceso inmediato a tus fotos.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col w-[376px] h-[245px] z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/descargar.svg" 
                alt="Descargar fotos" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Descarga al instante
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compra segura y acceso inmediato a tus fotos.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Encontrar;