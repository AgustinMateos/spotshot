'use client';

import Image from 'next/image';

export default function AuthLayout({
  title,
  subtitle,
  children
}) {
  return (
    <div className="min-h-screen  flex-col p-5 md:p-0 md:flex-row bg-white flex">
      {/* LADO IZQUIERDO - Marketing (igual en ambas pantallas) */}
      <div className="w-full lg:w-[60%] flex-col flex justify-between   ">
        <div className="w-full md:pl-20 md:pt-20 ">
          <h1 className="text-5xl w-full font-bold text-gray-900 leading-tight">
            Convierte tus fotos de surf en ingresos reales.
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
        <div className=" w-full flex gap-5 ">
          <img
            src="/fondo.svg"
            alt="surf"
            className="w-full   object-cover -mt-4"
          />
         
        </div>
      </div>

      {/* LADO DERECHO - Formulario (cambia según login o register) */}
      <div className="w-full lg:w-[40%] flex h-full items-center justify-center p-6 pt-20 lg:p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}