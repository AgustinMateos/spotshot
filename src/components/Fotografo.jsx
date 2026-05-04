import React from 'react';

const Fotografo = () => {
  return (
    <div className="w-full bg-[#F1F7FE] py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Barra superior con beneficios */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16 text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow p-2">
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
            <h1 className="text-5xl  text-gray-900 leading-tight mb-3">
              ¿Sos fotógrafo?
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Vendé tus sesiones sin complicaciones.
            </p>

            <div className="space-y-8 mb-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E7F0FC] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm p-2">
                  <img src="/fotografo/publica.svg" alt="Publicar sesión" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Publica tu sesión en minutos</h3>
                  <p className="text-gray-600">Sube tu material y empieza a vender hoy mismo.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E7F0FC] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm p-2">
                  <img src="/fotografo/monetiza.svg" alt="Monetizar" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Monetiza cada sesión sin esfuerzo</h3>
                  <p className="text-gray-600">Convierte tus fotos en ventas automáticas.</p>
                </div>
              </div>
            </div>

            <button className="bg-[#C8A24D] hover:bg-[#c8a14dc8] transition-colors text-white font-medium px-8 py-3.5 rounded-2xl text-lg">
              Comenzar a vender
            </button>
          </div>

          {/* Columna derecha - Imagen completa del upload */}
          <div className="relative flex justify-center">
            <img 
              src="/fotografo/upload-panel.svg"   // ← Cambia esta ruta por tu imagen real
              alt="Panel de subida de archivos"
              className="w-[412px] h-[391px] "
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Fotografo;