'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula la barra de progreso
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-[#0D2744] flex flex-col items-center justify-center z-[9999]">
      
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <Image
          src="/icons/logo.svg"
          alt="SpotShot"
          width={64}
          height={64}
          priority
        />
        <span className="text-white text-3xl font-semibold tracking-tighter">
          SpotShot
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-48 h-[3px] bg-white/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#DEB656] rounded-full transition-all duration-150 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

    </div>
  );
}