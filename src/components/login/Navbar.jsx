import React from 'react';

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-[#103457]  ">
      <div className="max-w-full  px-6 py-5 flex items-center justify-between">
        
        {/* Logo SpotShot */}
        <a href="/"  className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <span className="text-white text-2xl font-semibold tracking-tighter">
            SpotShot
          </span>
        </a>

        {/* Links + Botón Sign in - Todo junto a la derecha */}
        <div className="flex items-center gap-8 text-[#FFFFFF]">
          <a 
            href="#" 
            className="hover:text-white/80 transition-colors font-medium text-[#FFFFFF]"
          >
            Explorar sesiones
          </a>
          <a 
            href="#" 
            className="hover:text-white/80 transition-colors font-medium"
          >
            Vender fotos
          </a>
          
          <a 
            href="/login" 
            className="bg-white h-9 flex items-center text-black px-6 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-all active:scale-95"
          >
            Sign in
          </a>
        </div>

      </div>
    </div>
  );
};

export default Navbar;