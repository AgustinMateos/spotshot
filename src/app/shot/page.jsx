import Link from 'next/link';

export default function ShotPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header de bienvenida */}
        <div className="bg-[#F1F7FE] rounded-2xl shadow-sm p-8 mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                Hola Nick! Comencemos
              </h2>
              <p className="text-[#71717A]">
                Completa estos dos pasos para comenzar a vender tus fotos
              </p>
            </div>

            {/* Pasos visuales */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                📸
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                📊
              </div>
            </div>
          </div>

          {/* Dos pasos */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            
            {/* Paso 1 */}
            <div className="border border-gray-200 bg-white rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 1</div>
              <h3 className="text-xl  font-semibold mb-2">Conecta tu cuenta de cobro</h3>
              <p className="text-gray-600 mb-6">
                Vinculá Stripe para poder publicar tus sesiones y recibir pagos automáticamente.
              </p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition">
                Conectar stripe
              </button>
            </div>

            {/* Paso 2 */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 2</div>
              <h3 className="text-xl font-semibold mb-2">Crea tu primera sesión</h3>
              <p className="text-gray-600 mb-6">
                Sube tus fotos, configurá precios y publica para que los surfistas te encuentren.
              </p>
              <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition">
                Crear sesión
              </button>
            </div>
          </div>
        </div>

        {/* Sección Mis Sesiones */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Mis sesiones</h3>
          
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mb-6">
              <img 
                src="/images/empty-state.svg" 
                alt="Sin sesiones" 
                className="w-24 h-24 opacity-75"
              />
            </div>
            <h4 className="text-xl font-medium text-gray-800 mb-2">Aún no tienes sesiones</h4>
            <p className="text-gray-500 text-center max-w-sm mb-8">
              Sube tu primera sesión para empezar a vender tus mejores capturas
            </p>
            <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 hover:bg-black transition">
              <span className="text-xl">+</span>
              Crear sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}