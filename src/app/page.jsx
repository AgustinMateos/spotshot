
import Image from "next/image";
import SesionesRecientes from "@/components/SesionesRecientes";   // ← Importamos el nuevo componente
import Marquesina from "@/components/Marquesina";
import Encontrar from "@/components/Encontrar";
import Fotografo from "@/components/Fotografo";
import FotosHoy from "@/components/FotosHoy";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Buscador from "@/components/Buscador";
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Navbar />
      <div className="relative w-full h-screen overflow-hidden">
       

        <Image
          src="/inicio/surf.png"
          alt="Surf en la playa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="max-w-4xl">
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
              ¿Surfeaste hoy?
            </h1>
            <p className="text-white text-4xl md:text-5xl lg:text-6xl mt-4 font-bold">
              Encuentra tus fotos <span className="font-bold">en segundos</span>
            </p>
          </div>
        </div>
      </div>
<Buscador />
      {/* Sesiones Recientes */}
      <SesionesRecientes />

      <Marquesina />
      <Encontrar/>
      <Fotografo/>
      <FotosHoy/>
      <Footer />
    </>
  );
}