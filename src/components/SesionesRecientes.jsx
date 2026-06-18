'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Buscador from './Buscador';

function CardSkeleton({ delay = 0 }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden h-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-[#dce8f5]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: `waveSweep 1.6s ease-in-out infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <div className="h-6 w-20 rounded-full bg-black/15" />
        <div className="h-6 w-20 rounded-full bg-black/15" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-2.5">
        <div className="h-3 w-2/5 rounded bg-white/30" />
        <div className="h-5 w-3/4 rounded bg-white/30" />
        <div className="h-3 w-1/2 rounded bg-white/30" />
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-105 bg-[#dee9f5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 opacity-30">
        <Image
          src="/icons/logo.svg"   // ← tu logo, ajustá la ruta si es distinta
          width={72}
          height={66}
          alt="SpotShot"
        />

      </div>
    </div>
  );
}

export default function SesionesRecientes() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/public/photo-sessions?page=1`);
        const data = await res.json();
        if (res.ok) setSessions(data.items?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const getDaysRemaining = (activeUntil) => {
    if (!activeUntil) return null;
    const today = new Date();
    const diffDays = Math.ceil((new Date(activeUntil) - today) / (1000 * 3600 * 24));
    if (diffDays <= 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    return `Expira en ${diffDays} días`;
  };

  // ── LOADING ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-16 pt-40" style={{ background: '#F1F7FE' }}>
        <Buscador />
        <div className="md:max-w-7xl mx-auto px-6">
          <div className="flex w-full md:items-center flex-col md:flex-row justify-between mb-10">
            <div className="flex flex-col gap-3">
              <div className="h-7 w-52 rounded-2xl bg-blue-100 animate-pulse" />
              <div className="h-10 w-72 rounded-xl bg-blue-100 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} delay={i * 150} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── EMPTY STATE ───────────────────────────────────────────
  if (sessions.length === 0) {
    return (
      <div className="py-16 pt-40" style={{ background: '#F1F7FE' }}>
        <Buscador />
        <div className="md:max-w-7xl mx-auto px-6">
          <div className="flex w-full md:items-center flex-col md:flex-row justify-between mb-10">
            <div>
              <p className="text-sm mb-1 bg-white w-55 text-[#1E3A5F] p-1.5 text-center rounded-2xl">
                Nuevas sesiones todos los días
              </p>
              <h2 className="text-2xl pb-4 md:pb-0 md:text-4xl font-medium text-[#1E3A5F] pt-4">
                Sesiones recientes
              </h2>
            </div>
          </div>

          {/* Desktop: 3 cards vacías — Mobile: solo 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EmptyCard />
            <div className="hidden md:block"><EmptyCard /></div>
            <div className="hidden md:block"><EmptyCard /></div>
          </div>
        </div>
      </div>
    );
  }

  // ── CONTENT ───────────────────────────────────────────────
  return (
    <div className="py-16 pt-40" style={{ background: '#F1F7FE' }}>
      <Buscador />
      <div className="md:max-w-7xl mx-auto px-6">
        <div className="flex w-full md:items-center flex-col md:flex-row justify-between mb-10">
          <div>
            <p className="text-sm mb-1 bg-white w-55 text-[#1E3A5F] p-1.5 text-center rounded-2xl">
              Nuevas sesiones todos los días
            </p>
            <h2 className="font-manrope font-medium md:text-[48px] leading-[48px] tracking-[-1.2%] md:text-center text-3xl pb-4 md:pb-0 md:text-4xl  text-[#1E3A5F] pt-4">
              Sesiones recientes
            </h2>
          </div>
          <div className="flex justify-end h-full">
            <Link
              href="/sesiones"
              className="flex font-inter font-medium text-[14px] leading-[20px] h-full items-end tracking-normal justify-end md:items-center gap-2 text-[#1E3A5F] hover:text-black "
            >
              Ver todas{' '}
              <span className="text-xl">
                <Image src="/icons/FlechaVerTodas.svg" width={20} height={20} alt="flecha" />
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => {
            const daysLeft = getDaysRemaining(session.activeUntil);
            return (
              <Link
                href={`/sesiones/${session.id}`}
                key={session.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-105"
              >
                <img
                  src={session.images?.[0]?.publicUrl || '/placeholder-surf.jpg'}
                  alt={session.title || 'Sesión de surf'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {daysLeft && (
                    <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Image src="/icons/hour.svg" width={16} height={16} alt="hora" />
                      {daysLeft}
                    </div>
                  )}
                  <div className="bg-[#0D2744] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Image src="/icons/camara.svg" width={16} height={16} alt="cámara" />
                    {session.photoCount} fotos
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">

                  <h3 className="text-2xl font-semibold mt-1 tracking-tight">{session.titleShort}</h3>
                  <p className="text-sm mt-2 opacity-90">{session.location || session.schoolName}</p>
                  
                  <p className="text-sm opacity-90 mt-1">{session.startTime} - {session.endTime}</p>
               <p className="text-sm opacity-90">
                    by{' '}
                    {session.photographer?.firstName && session.photographer?.lastName
                      ? `${session.photographer.firstName} ${session.photographer.lastName}`
                      : session.photographer?.alias || 'Fotógrafo'}
                  </p> </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}