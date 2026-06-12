import PageLoader from '@/components/PageLoader';
import Image from 'next/image';
import SesionesRecientes from '@/components/SesionesRecientes';
import Marquesina from '@/components/Marquesina';
import Encontrar from '@/components/Encontrar';
import Fotografo from '@/components/Fotografo';
import FotosHoy from '@/components/FotosHoy';

export default function Home() {
  return (
    <PageLoader>
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src="/inicio/somo1.webp"
          alt="Surf en la playa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="max-w-4xl">
            <h1 className="text-white font-manrope text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
              ¿Surfeaste hoy?
            </h1>
            <p className="text-white font-manrope text-4xl md:text-5xl lg:text-6xl mt-4 font-bold">
              Encuentra tus fotos <br/> <span className="font-bold">en segundos</span>
            </p>
          </div>
        </div>
      </div>
      <SesionesRecientes />
      <Marquesina />
      <Encontrar />
      <Fotografo />
      <FotosHoy />
    </PageLoader>
  );
}