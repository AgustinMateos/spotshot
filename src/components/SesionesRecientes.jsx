'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Buscador from './Buscador';

export default function SesionesRecientes() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions?page=1`);
        const data = await res.json();

        if (res.ok) {
          setSessions(data.items?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  // Función para calcular días restantes
  const getDaysRemaining = (activeUntil) => {
    if (!activeUntil) return null;
    const today = new Date();
    const expiryDate = new Date(activeUntil);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) return "Expira hoy";
    if (diffDays === 1) return "Expira mañana";
    return `Expira en ${diffDays} días`;
  };

  if (loading) {
    return (
      <div className="py-16 pt-40 bg-[#F1F7FE] text-center">
        Cargando sesiones recientes...
      </div>
    );
  }

  return (
    <div className="py-16  pt-40" style={{ background: "#F1F7FE" }}>
      <Buscador />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nuevas sesiones todos los días</p>
            <h2 className="text-4xl font-semibold text-gray-900">Sesiones recientes</h2>
          </div>
          <Link href="/sesiones" className="flex items-center gap-2 text-gray-700 hover:text-black font-medium">
            Ver todas <span className="text-xl">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => {
            const daysLeft = getDaysRemaining(session.activeUntil);

            return (
              <Link 
                href={`/sesiones/${session.id}`} 
                key={session.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-[420px]"
              >
                <img
                  src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
                  alt={session.title || 'Sesión de surf'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge de fotos + días restantes */}
                <div className="absolute top-4 right-4 flex  gap-2 z-10">
                  

                  {daysLeft && (
                    <div className="bg-[#0F172A] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                     <Image src={'/icons/hour.svg'} width={16} height={16} alt='hora'/>
                      {daysLeft}
                    </div>
                  )}
                  <div className="bg-[#0F172A] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Image src={'/icons/camara.svg'} width={16} height={16} alt='hora'/> {session.photoCount} fotos
                  </div>
                </div>

                {/* Información inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                  <p className="text-sm opacity-90">
  by {session.photographer?.firstName && session.photographer?.lastName 
    ? `${session.photographer.firstName} ${session.photographer.lastName}` 
    : session.photographer?.alias || 'Fotógrafo'}
</p>
                  <h3 className="text-2xl font-semibold mt-1 tracking-tight">
                    {session.title}
                  </h3>
                  <p className="text-sm mt-2 opacity-90">
                    {session.location || session.schoolName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}