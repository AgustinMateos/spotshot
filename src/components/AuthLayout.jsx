'use client';

import Image from 'next/image';

export default function AuthLayout({ 
  title, 
  subtitle, 
  children 
}) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* LADO IZQUIERDO - Marketing (igual en ambas pantallas) */}
      <div className="hidden w-[70%] lg:flex top-[-65px]   flex-col justify-center p-12 relative">
        <div className="max-w-[800px]">
          <h1 className="text-5xl w-full font-bold text-gray-900 leading-tight">
            Convierte tus fotos de surf en <br />ingresos reales.
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Únete a una plataforma curada diseñada para fotógrafos de surf que desean monetizar su trabajo.
          </p>

          <ul className="mt-10 space-y-5">
  <li className="flex items-start gap-4 text-gray-700">
    <img 
      src="/icons/check.svg" 
      alt="check" 
      className="w-6 h-6 mt-1 flex-shrink-0" 
    />
    <span>Mantené el control de tus precios</span>
  </li>

  <li className="flex items-start gap-4 text-gray-700">
    <img 
      src="/icons/check.svg" 
      alt="check" 
      className="w-6 h-6 mt-1 flex-shrink-0" 
    />
    <span>Llegá a surfistas que buscan activamente tus fotos</span>
  </li>

  <li className="flex items-start gap-4 text-gray-700">
    <img 
      src="/icons/check.svg" 
      alt="check" 
      className="w-6 h-6 mt-1 flex-shrink-0" 
    />
    <span>Sin costos iniciales</span>
  </li>
</ul>
        </div>

        {/* Imágenes decorativas */}
       <div className="absolute bottom-[-110px] left-0 flex gap-5 opacity-35">
   <img 
    src="/loginbg.svg" 
    alt="surf" 
    className="w-[240px] h-[265px] rounded-t-[17px] shadow-xl object-cover -mt-4" 
  />
  <img 
    src="/loginbg.svg" 
    alt="surf" 
    className="w-[240px] h-[210px] rounded-t-[17px] shadow-xl object-cover mt-14" 
  />
 
 <img 
    src="/loginbg.svg" 
    alt="surf" 
    className="w-[240px] h-[265px] rounded-t-[17px] shadow-xl object-cover -mt-4" 
  />
  <img 
    src="/loginbg.svg" 
    alt="surf" 
    className="w-[240px] h-[240px] rounded-t-[17px] shadow-xl object-cover mt-4" 
  />
</div>
      </div>

      {/* LADO DERECHO - Formulario (cambia según login o register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}