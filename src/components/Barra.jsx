import React from 'react'

const Barra = () => {
  return (
    <div className='md:h-[128px] p-6 flex-col flex justify-center items-center  bg-[#DEEBFB]'> {/* Barra superior con beneficios */}
        <div className="flex flex-col  md:flex-row justify-center items-center gap-8 md:gap-16  text-center">
          <div className="flex md:flex-col items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex md:items-center justify-center shadow p-2">
              <img src="/fotografo/100.svg" alt="Pago seguro" className="w-full h-full object-contain" />
            </div>
                <p className="font-normal  text-[#13273F]">Pago 100% seguro</p>
          </div>

          <div className="flex md:flex-col items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow p-2">
              <img src="/fotografo/timer.svg" alt="Encuentra en segundos" className="w-full h-full object-contain" />
            </div>
            <p className="font-normal  text-[#13273F]">Encuentra tu foto en segundos</p>
          </div>

          <div className="flex md:flex-col items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow p-2">
              <img src="/fotografo/descarga.svg" alt="Descarga al instante" className="w-full h-full object-contain" />
            </div>
            <p className="  text-[#13273F] font-manrope font-normal text-base leading-6 tracking-normal">Descarga al instante</p>
          </div>
        </div></div>
  )
}

export default Barra