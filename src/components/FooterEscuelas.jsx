import React from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  QrCode,
  Search,
  Images,
  ScanFace,
  ArrowRight,
} from 'lucide-react';
const FooterEscuelas = () => {
  return (
    <div>  <section className="bg-[#B4121B] text-white mt-4">
            <div className="mx-auto max-w-6xl px-6 py-8 text-center">
              <h2 className="font-extrabold uppercase text-2xl md:text-3xl tracking-wide">
                Vive la experiencia del surf
              </h2>
              <p className="text-white/70 text-sm tracking-widest mt-1">DESDE 1991</p>
    
              <Link
                href="https://spotshot.app"
                target="_blank"
                className="mt-6 inline-flex items-center gap-3 text-sm md:text-base"
              >
                <ScanFace size={20} className="text-white/80" />
                <span>
                  Surfeaste fuera de la escuela? Encuentra tus fotos en{' '}
                  <strong>SpotShot.app</strong>
                </span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </section></div>
  )
}

export default FooterEscuelas