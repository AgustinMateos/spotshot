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
      <div className="hidden lg:flex w-1/2 bg-[#f8fafc] flex-col justify-center p-12 relative">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Convierte tus fotos de surf<br />en ingresos reales.
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Únete a una plataforma curada diseñada para fotógrafos de surf que desean monetizar su trabajo.
          </p>

          <ul className="mt-10 space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-green-500 text-2xl">✓</span>
              Mantené el control de tus precios
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500 text-2xl">✓</span>
              Llegá a surfistas que buscan activamente tus fotos
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500 text-2xl">✓</span>
              Sin costos iniciales
            </li>
          </ul>
        </div>

        {/* Imágenes decorativas */}
        <div className="absolute bottom-12 left-12 flex gap-4 opacity-75">
          <img src="/surf1.jpg" alt="surf" className="w-36 rounded-2xl shadow-xl" />
          <img src="/surf2.jpg" alt="surf" className="w-36 rounded-2xl shadow-xl mt-10" />
          <img src="/surf3.jpg" alt="surf" className="w-36 rounded-2xl shadow-xl" />
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