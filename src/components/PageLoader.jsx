'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExiting(true);
          setTimeout(() => setLoading(false), 650);
          return 100;
        }
        return Math.min(prev + Math.random() * 22, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Contenido real - siempre renderizado */}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div
          className={`fixed inset-0 bg-[#103457] flex flex-col items-center justify-center z-[9999] transition-all duration-700 ease-out
            ${exiting ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}
        >
          <div className={`flex flex-col items-center gap-4 mb-12 transition-all duration-700 ${exiting ? 'opacity-0 -translate-y-8' : ''}`}>
            <Image
              src="/icons/logo.svg"
              alt="SpotShot"
              width={72}
              height={72}
              priority
            />
            <span className="text-white text-4xl font-semibold tracking-tighter">
              SpotShot
            </span>
          </div>

          <div className="w-64 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#DEB656] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

         
        </div>
      )}
    </div>
  );
}