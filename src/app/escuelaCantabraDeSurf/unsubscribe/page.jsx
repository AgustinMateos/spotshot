import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Baja de avisos | Escuela Cántabra de Surf',
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-[#B4121B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center">
          <Link href="/escuelaCantabraDeSurf" className="flex items-center gap-4">
            <div className="w-60 h-20 flex items-center justify-center">
              <Image
                src="/escuelaLogo.png"
                alt="Escuela Cántabra de Surf"
                width={400}
                height={220}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 pt-14">
        <div className="bg-white rounded-3xl shadow-xl px-8 py-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#B4121B] flex items-center justify-center">
            <ShieldCheck className="text-white" size={40} />
          </div>

          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold uppercase leading-tight text-[#0D0D0D]">
            Te has dado <span className="text-[#B4121B]">de baja</span>
          </h1>

          <p className="mt-5 text-gray-700 text-lg">
            Hemos eliminado tus datos biométricos y ya no recibirás más avisos de nuevas fotos.
          </p>
          <p className="mt-2 text-gray-500">
            Gracias por haber surfeado con nosotros. ¡Te esperamos en otra ocasión!
          </p>

          <Link
            href="/escuelaCantabraDeSurf"
            className="mt-8 inline-flex items-center gap-2 bg-[#B4121B] hover:bg-[#8f0e15] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition"
          >
            VOLVER A LA ESCUELA
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
