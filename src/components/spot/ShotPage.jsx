'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MisSesionesTable from './MisSesionesShotTable';

function CardSkeleton({ delay = 0 }) {
    return (
        <div
            className="relative rounded-3xl overflow-hidden"
            style={{ aspectRatio: '16/10', animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-[#dce8f5]" />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    animation: 'waveSweep 1.6s ease-in-out infinite',
                    animationDelay: `${delay}ms`,
                }}
            />
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <div className="h-6 w-20 rounded-full bg-black/15" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2.5">
                <div className="h-4 w-3/4 rounded bg-white/30" />
                <div className="h-3 w-1/2 rounded bg-white/30" />
                <div className="h-3 w-1/3 rounded bg-white/30" />
            </div>
        </div>
    );
}

export default function ShotPage() {
    const { user, token, loading: authLoading } = useAuth();

    const [stripeConnect, setStripeConnect] = useState(null);
    const [allSessions, setAllSessions] = useState([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        audience: 'FREE_SURFERS',
        status: '',
        location: '',
        sessionDate: '',
        timeFrom: '',
        timeTo: '',
        page: 1,
    });

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    useEffect(() => {
        if (!token) return;

        const loadAll = async () => {
            if (loadingInitial) {
                // primera carga: carga perfil + sesiones juntos
            } else {
                setLoadingFilters(true);
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const params = new URLSearchParams();
            if (filters.audience) params.append('audience', filters.audience);
            if (filters.status) params.append('status', filters.status);
            if (filters.location) params.append('location', filters.location);
            if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
            if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
            if (filters.timeTo) params.append('timeTo', filters.timeTo);
            params.append('page', filters.page);

            try {
                const [stripeRes, sessionsRes] = await Promise.all([
                    fetch(`${API_URL}/api/v1/photographers/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/api/v1/photographers/me/photo-sessions?${params.toString()}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const [stripeData, sessionsData] = await Promise.all([
                    stripeRes.json(),
                    sessionsRes.json(),
                ]);

                if (stripeRes.ok) setStripeConnect(stripeData.stripeConnect);
                if (sessionsRes.ok) {
                    setAllSessions(sessionsData.items || []);
                    setPagination({
                        total: sessionsData.total || 0,
                        totalPages: sessionsData.totalPages || 1,
                        hasPreviousPage: sessionsData.hasPreviousPage || false,
                        hasNextPage: sessionsData.hasNextPage || false,
                    });
                }
            } catch (err) {
                console.error('Error cargando datos:', err);
            } finally {
                setLoadingFilters(false);
                if (loadingInitial) setLoadingInitial(false);
            }
        };

        loadAll();
    }, [token, filters.audience, filters.status, filters.location, filters.sessionDate,
        filters.timeFrom, filters.timeTo, filters.page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const isStripeReady = stripeConnect?.isReady === true;
    const alias = user?.alias || 'Fotógrafo';

    // ── SKELETON INICIAL ──
    if (authLoading || loadingInitial) {
        return (
            <div className="min-h-screen pt-20 bg-white">
                <div className="max-w-full mx-auto px-6 py-8">
                    <div className="bg-[#F1F7FE] rounded-2xl p-8 mb-10">
                        <div className="h-9 w-48 rounded-xl bg-blue-100 animate-pulse mb-3" />
                        <div className="h-5 w-64 rounded-lg bg-blue-100 animate-pulse" />
                        <div className="grid md:grid-cols-3 gap-8 mt-10">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="border border-gray-200 bg-white rounded-xl p-6 flex flex-col gap-4">
                                    <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                                    <div className="h-7 w-3/4 rounded-lg bg-gray-100 animate-pulse" />
                                    <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                                    <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
                                    <div className="h-11 w-40 rounded-xl bg-gray-100 animate-pulse mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-7 w-48 rounded-lg bg-gray-100 animate-pulse mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <CardSkeleton key={i} delay={i * 100} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-white">
            <div className="max-w-full mx-auto px-6 py-8">

                {/* Header de bienvenida */}
                <div className="bg-[#F1F7FE] rounded-2xl shadow-sm p-8 mb-10">
                    <h2 className="text-3xl font-semibold text-gray-900">Hola {alias}!</h2>
                    <p className="text-[#71717A] mt-1">
                        {allSessions.length > 0 ? 'Gestiona tus sesiones publicadas' : 'Completa estos pasos para comenzar'}
                    </p>

                    {/* Pasos solo si NO tiene sesiones */}
                    {allSessions.length === 0 && (
                        <div className="flex gap-8 justify-between  mt-10">

                           <div className='flex justify-between  flex-col md:flex-row '>
                             {/* Paso 1 - Stripe */}
                            <div className="border md:w-[460px] border-gray-200 bg-white rounded-xl p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Paso 1</div>
                                        <h3 className="text-2xl text-[#0F172A] font-semibold">Conecta tu cuenta de pagos</h3>
                                    </div>
                                    {isStripeReady && (
                                        <div className="bg-[#059669] text-white text-sm font-medium px-5 py-1.5 rounded-full">
                                            Completo
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Vinculá Stripe para poder publicar tus sesiones y recibir pagos automáticamente.
                                </p>
                                {isStripeReady ? (
                                    <div className="flex items-center gap-2 text-[#71717A] font-medium">
                                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                                        Stripe Conectado
                                    </div>
                                ) : (
                                    <Link
                                        href="/shot/perfil"
                                        className="inline-block bg-[#0D2744] text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition"
                                    >
                                        Conectar Stripe 
                                    </Link>
                                )}
                            </div>

                            {/* Paso 2 - Crear Sesión */}
                            <div className="p-6 md:w-[460px]">
                                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paso 2</div>
                                <h3 className="text-xl font-semibold mb-2">Crea tu primera sesión</h3>
                                <p className="text-gray-600 mb-6">
                                    Sube tus fotos, configurá precios y publica para que los surfistas te encuentren.
                                </p>
                                <Link
                                    href="/shot/newAlbum"
                                    className={`px-6 py-3 rounded-xl font-medium transition inline-flex items-center gap-3 ${isStripeReady
                                        ? 'bg-gray-900 text-white hover:bg-black'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={(e) => { if (!isStripeReady) e.preventDefault(); }}
                                >
                                    <span className="text-xl">+</span> Crear sesión
                                </Link>
                            </div>
                           </div>

                            <div className="hidden w-[240px] flex  md:block">
                                <Image height={183} width={240} alt="stripe steps" src="/icons/stripeSteps.svg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Lista de sesiones */}
                {isStripeReady ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <h3 className="text-xl text-[#10487C] font-semibold pb-5 md:pb-0">
                                Mis sesiones ({pagination.total})
                            </h3>
                            <Link
                                href="/shot/newAlbum"
                                className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black"
                            >
                                <span className="text-xl">+</span> Crear nueva sesión
                            </Link>
                        </div>

                        <MisSesionesTable
                            sessions={allSessions}
                            loading={loadingFilters}
                            pagination={{ ...pagination, page: filters.page }}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onPageChange={goToPage}
                            openMenuId={openMenuId}        // ← esto faltaba
                            setOpenMenuId={setOpenMenuId}
                            onCopyLink={(sessionId) => {
                                const shareUrl = `https://spotshot-rho.vercel.app/sesiones/${sessionId}`;
                                navigator.clipboard.writeText(shareUrl).then(() => {
                                    setCopiedId(sessionId);
                                    setTimeout(() => {
                                        setOpenMenuId(null);
                                        setCopiedId(null);
                                    }, 1800);
                                });
                            }}
                            copiedId={copiedId}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <Image
                            src="/crearPrimerAlbum.svg"
                            alt="Sin sesiones"
                            width={120}
                            height={120}
                            className="mx-auto mb-6 opacity-75"
                        />
                        <h4 className="text-2xl font-medium text-gray-800 mb-3">Crea tu primer álbum</h4>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            Sube tu primer álbum para empezar a vender tus mejores capturas
                        </p>
                        <span className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed">
                            <span className="text-2xl">+</span> Crear álbum
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}