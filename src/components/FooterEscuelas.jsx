import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScanFace, ArrowRight } from 'lucide-react';

const FooterEscuelas = () => {
  return (
    <footer>
      <section className="bg-[#B4121B] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <h2 className="font-extrabold uppercase text-2xl md:text-3xl tracking-wide">
            Vive la experiencia del surf
          </h2>
          <p className="text-white/70 text-sm tracking-widest mt-1">DESDE 1991</p>

          <Link
            href="https://spotshot.app"
            target="_blank"
            className="mt-6 inline-flex items-center justify-center gap-3 text-sm md:text-base"
          >
          <Image
            src="/icons/logo.webp"
            alt=""
            width={18}
            height={18}
            className="w-[18px] h-[18px] object-contain"
          />
            <span>
              Surfeaste fuera de la escuela? Encuentra tus fotos en{' '}
              <strong>SpotShot.app</strong>
            </span>
            <ArrowRight size={18} className="shrink-0" />
          </Link>
        </div>
      </section>

      <div className="bg-[#B4121B]">
        <div className="flex items-center justify-center gap-2 text-white/75 text-sm">
          <span>Powered by</span>
          <span className="font-semibold text-white">SpotShot</span>
          <Image
            src="/icons/logo.webp"
            alt=""
            width={18}
            height={18}
            className="w-[18px] h-[18px] object-contain"
          />
        </div>
      </div>
    </footer>
  );
};

export default FooterEscuelas;