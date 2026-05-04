'use client';

export default function NavbarFotografo() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            SpotShot
          </h1>
        </div>

        {/* Menú de navegación */}
        <div className="flex items-center gap-10 text-sm font-medium text-gray-600">
          <a href="/shot" className="hover:text-gray-900 transition-colors">
            Explorar sesiones
          </a>
          <a href="/shot/mis-sesiones" className="hover:text-gray-900 transition-colors">
            Mis sesiones
          </a>
          <a href="/shot/mis-ventas" className="hover:text-gray-900 transition-colors">
            Mis ventas
          </a>
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Nickname</span>
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-gray-800 border border-white shadow">
            AV
          </div>
        </div>

      </div>
    </nav>
  );
}