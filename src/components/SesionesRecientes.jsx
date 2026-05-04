import Image from "next/image";

const sesiones = [
  {
    id: 1,
    image: "/inicio/sesion.png",     // ← Cambia por tus imágenes
    photos: 42,
    author: "WavesHunter",
    date: "Dom 01/02",
    location: "Somo, España",
  },
  {
    id: 2,
   image: "/inicio/surf.png",
    photos: 42,
    author: "WavesHunter",
    date: "Dom 01/02",
    location: "Somo, España",
  },
  {
    id: 3,
   image: "/inicio/sesion.png",
    photos: 42,
    author: "WavesHunter",
    date: "Dom 01/02",
    location: "Somo, España",
  },
];

export default function SesionesRecientes() {
  return (
    <div className=" py-16 pt-40" style={{ background: "var(--Background-Primary-light, #F1F7FE)" }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nuevas sesiones todos los días</p>
            <h2 className="text-4xl font-semibold text-gray-900">Sesiones recientes</h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-black font-medium">
            Ver todas <span className="text-xl">→</span>
          </a>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sesiones.map((sesion) => (
            <div 
              key={sesion.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 aspect-[4/3.3] h-115 w-[384px]"
            >
              {/* Imagen que ocupa TODA la card */}
              <Image
                src={sesion.image}
                alt="Sesión de surf"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay degradado en la parte inferior para que se lea el texto */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Badge de fotos (arriba a la derecha) */}
              <div className="absolute top-4 right-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10">
                📸 <span>{sesion.photos} fotos</span>
              </div>

              {/* Texto superpuesto en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <p className="text-sm opacity-90">by {sesion.author}</p>
                <h3 className="text-3xl font-semibold mt-1 tracking-tight">
                  {sesion.date}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <span>📍</span>
                  <span>{sesion.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}