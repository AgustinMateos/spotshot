import React from 'react';
import Link from 'next/link';
const Fotografo = () => {
  return (
    <div className="w-full bg-[#F1F7FE] py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Barra superior con beneficios */}
        <div className="flex flex-col  md:flex-row justify-center items-center gap-8 md:gap-16 mb-16 text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex md:items-center justify-center shadow p-2">
              <img src="/fotografo/100.svg" alt="Pago seguro" className="w-full h-full object-contain" />
            </div>
            <p className="font-medium text-gray-800">Pago 100% seguro</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow p-2">
              <img src="/fotografo/timer.svg" alt="Encuentra en segundos" className="w-full h-full object-contain" />
            </div>
            <p className="font-medium text-gray-800">Encuentra tu foto en segundos</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow p-2">
              <img src="/fotografo/descarga.svg" alt="Descarga al instante" className="w-full h-full object-contain" />
            </div>
            <p className="font-medium text-gray-800">Descarga al instante</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Columna izquierda - Texto */}
          <div>
            <h1 className="text-[40px] md:text-5xl  text-[#1E3A5F] leading-tight mb-3">
              ¿Eres fotógrafo?
            </h1>
            <p className="text-[20px] md:text-xl text-[#1E3A5F] mb-10">
              Vendé tus fotos sin complicaciones.
            </p>

            <div className="space-y-8 mb-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E7F0FC] rounded-2xl flex items-center justify-center shrink-0 shadow-sm p-2">
                  <img src="/fotografo/publica.svg" alt="Publicar sesión" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#1E3A5F]">Publica tu sesión en minutos</h3>
                  <p className="text-[#1E3A5F]">Sube tu material y empieza a vender hoy mismo.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E7F0FC] rounded-2xl flex items-center justify-center shrink-0 shadow-sm p-2">
                  <img src="/fotografo/monetiza.svg" alt="Monetizar" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#1E3A5F]">Monetiza cada sesión sin esfuerzo</h3>
                  <p className="text-[#1E3A5F]">Convierte tus fotos en ventas automáticas.</p>
                </div>
              </div>
            </div>

            <Link href='/login' className="bg-[#C8A24D] hover:bg-[#c8a14dc8] transition-colors w-full text-white font-medium px-8 py-3.5 rounded-2xl text-lg">
              Comenzar a vender
            </Link>
          </div>

          {/* Columna derecha - Imagen completa del upload */}
          <div className="relative  flex justify-center">
            <img 
              src="/fotografo/upload-panel.svg"   // ← Cambia esta ruta por tu imagen real
              alt="Panel de subida de archivos"
              className="w-103 h-97.75 "
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Fotografo;