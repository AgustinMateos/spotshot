'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import MisSesionesTable from './MisSesionesShotTable';

export default function MisSesionesPage() {
  const { token } = useAuth();

  const [stripeConnect, setStripeConnect] = useState(undefined);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    audience: 'FREE_SURFERS',
    status: '',
    location: '',
    sessionDate: '',
    timeFrom: '',
    timeTo: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const stripeLoaded = stripeConnect !== undefined;
  const isStripeReady = stripeConnect?.isReady === true;

  useEffect(() => {
    if (!token) return;

    const loadAll = async () => {
      setLoading(true);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const params = new URLSearchParams();
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.sessionDate) params.append('sessionDate', filters.sessionDate);
      if (filters.timeFrom) params.append('timeFrom', filters.timeFrom);
      if (filters.timeTo) params.append('timeTo', filters.timeTo);
      params.append('page', pagination.page);

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
          setSessions(sessionsData.items || []);
          setPagination({
            page: sessionsData.page || 1,
            total: sessionsData.total || 0,
            totalPages: sessionsData.totalPages || 1,
            hasPreviousPage: sessionsData.hasPreviousPage || false,
            hasNextPage: sessionsData.hasNextPage || false,
          });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [token, filters, pagination.page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDeleteSession = async (sessionId) => {
    if (!token || !sessionId) return;
    setIsDeleting(true);
    setDeleteSuccess(false);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setDeleteSuccess(true);
      } else {
        alert('No se pudo eliminar la sesión');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la sesión');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between flex-col md:flex-row items-start md:items-center mb-8">
          <h1 className="text-[24px] font-medium text-[#10487C] pb-5 md:pb-0">Mis Sesiones</h1>

          {!stripeLoaded ? (
            <div className="h-10 w-36 rounded-lg bg-gray-200 animate-pulse" />
          ) : (
            <Link
              href={isStripeReady ? '/shot/newAlbum' : '#'}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 h-10 transition font-medium ${
                isStripeReady
                  ? 'bg-[#0D2744] text-white hover:bg-[#0d2744e5]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => {
                if (!isStripeReady) {
                  e.preventDefault();
                  alert('Debes conectar tu cuenta de Stripe para crear sesiones');
                }
              }}
            >
              <span className="text-xl">+</span> Crear Sesión
            </Link>
          )}
        </div>

        {/* Tabla reutilizable */}
        <MisSesionesTable
          sessions={sessions}
          loading={loading}
          pagination={pagination}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={goToPage}
          onDelete={(session) => {
            setSessionToDelete(session);
            setShowDeleteConfirmModal(true);
          }}
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
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          copiedId={copiedId}
        />

      </div>

      {/* Modal eliminar */}
      {showDeleteConfirmModal && sessionToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
            {!deleteSuccess ? (
              <>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🗑️</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">¿Eliminar esta sesión?</h3>
                <p className="text-gray-600 mb-8">
                  Se eliminará permanentemente la sesión:<br />
                  <strong>"{sessionToDelete.title}"</strong>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirmModal(false);
                      setSessionToDelete(null);
                      setDeleteSuccess(false);
                    }}
                    className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteSession(sessionToDelete.id)}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
                  >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-green-600">¡Sesión eliminada correctamente!</h3>
                <p className="text-gray-600 mb-8">
                  La sesión "{sessionToDelete.title}" ha sido eliminada.
                </p>
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setSessionToDelete(null);
                    setDeleteSuccess(false);
                  }}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}