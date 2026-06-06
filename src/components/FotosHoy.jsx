import React from 'react';
import Link from 'next/link';
const FotosHoy = () => {
  return (
    <div className="w-[90%]  mx-auto px-4  py-8">
      <div className="relative rounded-3xl overflow-hidden h-122 shadow-2xl">
        
        <img
          src="/fotosHoy/somo2.webp"
          alt="Surfista en ola grande"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradiente más suave */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-white text-3xl   leading-tight max-w-2xl mb-8 drop-shadow-md">
            ¿Todavía no tenés tus fotos de hoy?
          </h2>

         <Link
  href="/sesiones"
  className="bg-[#C8A24D] hover:bg-[#b38f3f] active:scale-95 transition-all flex justify-center items-center text-white font-medium px-12 h-12 w-55 py-4 rounded-2xl text-lg shadow-lg"
>
  Buscar sesión
</Link>
        </div>
      </div>
    </div>
  );
};

export default FotosHoy;