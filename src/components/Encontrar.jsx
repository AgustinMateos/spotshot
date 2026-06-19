import React from 'react';

const Encontrar = () => {
  return (
    <div className="w-full mx-auto py-16 px-6 bg-[#FAFBFF] relative overflow-hidden h-full md:h-149 flex items-center justify-center">
      
      {/* Imagen de fondo CENTRADA en el medio */}
      <img
        src="/encontrar/curva.svg"
        alt="encontrar"
     // ✅ BIEN
className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-28.5 w-208 h-auto" />

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Título principal */}
        <h2 className="text-4xl font-normal text-center text-[#1E3A5F] mb-16">
          Encontrar tus fotos es <strong>fácil.</strong> 
        </h2>

        {/* Contenedor de las 3 cards */}
        <div className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-10 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-[90%] md:w-94 h-61.25 p-8 flex flex-col items-center md:items-start  z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/lupa.svg" 
                alt="Buscar sesión" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl font-normal text-center md:text-start text-[#1E3A5F] mb-3">
              Busca tu sesión
            </h3>
            <p className="text-[#1E3A5F] text-center md:text-start leading-relaxed">
              Encuentra las sesiones disponibles por lugar y fecha.
            </p>
          </div>

          {/* Card 2 */}
            <div className="bg-white rounded-3xl shadow-sm border items-center md:items-start border-gray-100 w-[90%] md:w-94 h-61.25 p-8 flex flex-col z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/elige.svg" 
                alt="Descargar fotos" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl font-normal text-center md:text-start text-[#1E3A5F] mb-3">
              Elige tus mejores momentos.
            </h3>
            <p className="text-[#1E3A5F] text-center md:text-start leading-relaxed">
              Selecciona las que más te gusten y añádelas al carrito.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl shadow-sm items-center md:items-start border border-gray-100 p-8 flex  flex-col w-[90%] md:w-94 h-61.25 z-10">
            <div className="w-12 h-12 flex justify-center items-center mb-6 border-transparent rounded-xl bg-[#DEEBFB]">
              <img 
                src="/encontrar/descargar.svg" 
                alt="Descargar fotos" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h3 className="text-xl text-center md:text-start font-normal text-[#1E3A5F] mb-3">
              Descarga al instante
            </h3>
            <p className="text-[#1E3A5F] text-center md:text-start leading-relaxed">
              Compra segura y acceso inmediato a tus fotos.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Encontrar;