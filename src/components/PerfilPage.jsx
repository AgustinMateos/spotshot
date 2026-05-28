'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function PerfilPage() {
const { user, token, updateUser, updateToken, loading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  // Modal contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Stripe
  const [stripeConnect, setStripeConnect] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(false);
useEffect(() => {
  if (!token && !loading) {
    router.push('/login');
  }
}, [token, loading]);
  // Cargar datos
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAlias(user.alias || '');
      setAvatarPreview(user.avatarUrl);
    }
  }, [user]);
  // Cargar Stripe
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/v1/photographers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStripeConnect(data.stripeConnect);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [token]);

  const avatarUrl = avatarPreview || user?.avatarUrl;

  // ====================== ACTUALIZAR PERFIL ======================
  const handleSaveProfile = async () => {
    setLoadingSave(true);
    setError('');
    setMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photographers/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          alias: alias.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
    setMessage('✅ Perfil actualizado correctamente');
    updateUser(data.photographer);   // ← Actualiza navbar y todo
    setIsEditing(false);
} else {
        setError(data.message || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoadingSave(false);
    }
  };

  // ====================== SUBIR AVATAR ======================
  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photographers/me/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
    setMessage('✅ Avatar actualizado correctamente');
    setAvatarPreview(data.photographer.avatarUrl);
    updateUser(data.photographer);   // ← Actualiza navbar
} else {
        setError(data.message || 'Error al subir avatar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoadingAvatar(false);
    }
  };

  // ====================== ELIMINAR AVATAR ======================
  const handleDeleteAvatar = async () => {
    if (!confirm('¿Eliminar foto de perfil?')) return;

    setLoadingAvatar(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photographers/me/avatar`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
    setMessage('✅ Avatar eliminado correctamente');
    setAvatarPreview(null);
    updateUser({ ...user, avatarUrl: null });
}
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setLoadingAvatar(false);
    }
  };

  // ====================== CAMBIAR CONTRASEÑA ======================
// ====================== CAMBIAR CONTRASEÑA ======================
const handleChangePassword = async (e) => {
  e.preventDefault();
  setPasswordError('');
  setPasswordMessage('');

  if (newPassword !== confirmNewPassword) {
    setPasswordError('Las nuevas contraseñas no coinciden');
    return;
  }
  if (newPassword.length < 8) {
    setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
    return;
  }

  setLoadingPassword(true);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photographers/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setPasswordMessage('✅ Contraseña actualizada correctamente. Vuelve a iniciar sesión.');

      setTimeout(() => {
        logout();           // ← Ahora sí está definido
        router.push('/login');
      }, 1800);
    } else {
      setPasswordError(data.message || 'Error al cambiar la contraseña');
    }
  } catch (err) {
    setPasswordError('Error de conexión con el servidor');
  } finally {
    setLoadingPassword(false);
  }
};

  // Iniciar / Reanudar Onboarding de Stripe
  const handleConnectStripe = async () => {
    setLoadingStripe(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photographers/me/stripe/onboarding`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError('Error al conectar con Stripe');
    } finally {
      setLoadingStripe(false);
    }
  };

  // Reiniciar proceso (Refresh)
  const handleRefreshOnboarding = async () => {
    setLoadingStripe(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photographers/me/stripe/onboarding/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError('Error al refrescar el proceso');
    } finally {
      setLoadingStripe(false);
    }
  };

  const initials = (alias || 'F')
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

 // ====================== SKELETON LOADING ======================
if (loading) {
  return (
    <div className="max-w-full mx-auto px-6 py-10">
      {/* Título */}
      <div className="h-10 w-48 bg-gray-200 rounded-2xl animate-pulse mb-10"></div>

      {/* Sección Datos Personales */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-56 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-11 w-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Avatar + Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className="w-24 h-24 bg-gray-200 rounded-3xl animate-pulse"></div>
          
          <div className="space-y-3">
            <div className="h-7 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-5 w-80 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Campos del formulario */}
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Método de Cobro */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="h-8 w-52 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
        
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="w-10 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-12 w-44 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Sección Seguridad */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="h-8 w-40 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-52 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-52 bg-gray-200 rounded-2xl animate-pulse mt-6 md:mt-0"></div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-full mx-auto px-6 py-10">
     

      {/* Datos Personales */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
         <h1 className="text-4xl font-bold text-gray-900 mb-10">Mi cuenta</h1>
        <div className="flex  justify-between items-center mb-8">
          
          <h2 className="text-2xl font-semibold">Datos personales</h2>
   {/* Botón Editar / Guardar */}
<button
  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
  disabled={loadingSave}
  className="flex items-center gap-2 px-5 py-2.5 text-[#0D2744] rounded-2xl border border-[#E4E4E7] cursor-pointer hover:bg-gray-50 transition"
>
  {loadingSave ? (
    'Guardando...'
  ) : isEditing ? (
    <>
      <img src="/icons/guardar.svg" alt="Guardar" className="w-5 h-5" />
      <span className="hidden md:inline">Guardar cambios</span>
    </>
  ) : (
    <>
      <img src="/icons/editar2.svg" alt="Editar" className="w-5 h-5" />
      <span className="hidden md:inline">Editar</span>
    </>
  )}
</button>
        </div>

       {/* ====================== AVATAR ====================== */}
<div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
  <div className="relative group">
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
      />
    ) : (
      <div className="w-24 h-24 bg-amber-400 rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-800 border-4 border-white shadow-md">
        {initials}
      </div>
    )}

    {/* Botones flotantes */}
    <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
      {/* Subir nueva foto */}
      <label className="cursor-pointer bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition">
        <input 
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleUploadAvatar} 
          className="hidden" 
        />
        📷
      </label>

      {/* Eliminar foto */}
      {avatarUrl && (
        <button
          onClick={handleDeleteAvatar}
          disabled={loadingAvatar}
          className="bg-white hover:bg-red-50 text-red-600 rounded-full p-2 shadow-md transition"
        >
          🗑️
        </button>
      )}
    </div>
  </div>

  <div>
    <p className="text-2xl font-semibold">{alias || 'Sin alias'}</p>
    <p className="text-gray-500">{user?.email}</p>
    <p className="text-xs text-gray-400 mt-1">Haz clic en el icono de la cámara para cambiar tu foto</p>
 <p className="text-xs text-gray-400 mt-1">*Restricciones:

Tipos permitidos: image/jpeg, image/png, image/webp.
Tamaño máximo: 5 MB.</p>
  </div>
</div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Apodo</label>
            <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} disabled={!isEditing} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Correo electrónico</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nombre</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50" placeholder="Ingresa tu nombre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Apellido</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50" placeholder="Ingresa tu apellido" />
          </div>
        </div>

        {message && <p className="text-green-600 mt-6 text-center font-medium">{message}</p>}
        {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
      </div>

      {/* ====================== MÉTODO DE COBRO ====================== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Método de cobro</h2>
        <div className="flex flex-col md:flex-row items-start  md:items-center justify-between bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center pb-4 md:pb-0 gap-4">
            <div className="bg-purple-600 text-white  text-xs font-bold px-3 py-1 rounded">stripe</div>
            <div>
              <p className="font-medium">Stripe Connect</p>
              {stripeConnect?.isReady ? (
                <p className="text-green-600 text-sm flex items-center gap-1">✅ Conectado </p>
              ) : stripeConnect?.hasStartedOnboarding ? (
                <p className="text-amber-600 text-sm flex items-center gap-1">⏳ Proceso iniciado</p>
              ) : (
                <p className="text-red-600 text-sm">• No conectado</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {stripeConnect?.hasStartedOnboarding && !stripeConnect?.isReady && (
              <button
                onClick={handleRefreshOnboarding}
                disabled={loadingStripe}
                className="px-5 py-3 border border-gray-300 rounded-2xl hover:bg-gray-100 transition"
              >
                Reiniciar proceso
              </button>
            )}

            <button
              onClick={handleConnectStripe}
              disabled={loadingStripe || stripeConnect?.isReady}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition disabled:opacity-70"
            >
              {loadingStripe ? 'Conectando...' : stripeConnect?.isReady ? '✅ Conectado' : 'Conectar cuenta →'}
            </button>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">Seguridad</h2>
        <p className="text-xs text-gray-400 mt-1">*Al cambiar la contraseña se redijirá nuevamente al login.</p>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <p className="font-medium pt-5 md:pt-0">Contraseña</p>
            <p className="text-sm text-gray-500">Último cambio: hace poco</p>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="bg-gray-900 mt-8 md:mt-0 text-white px-6 py-3 rounded-2xl hover:bg-black transition"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      {/* ==================== MODAL CAMBIAR CONTRASEÑA ==================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <h3 className="text-2xl font-semibold mb-6">Cambiar Contraseña</h3>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Contraseña actual</label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl pr-12"
                  required
                />
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-4 top-11 text-gray-400 hover:text-gray-600">
                  {showOldPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl pr-12"
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-11 text-gray-400 hover:text-gray-600">
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">Confirmar Nueva Contraseña</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl pr-12"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-11 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {passwordError && <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl">{passwordError}</p>}
              {passwordMessage && <p className="text-green-600 text-center bg-green-50 py-3 rounded-xl">{passwordMessage}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword(''); setNewPassword(''); setConfirmNewPassword('');
                    setPasswordError(''); setPasswordMessage('');
                  }}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-medium hover:bg-black disabled:opacity-70"
                >
                  {loadingPassword ? 'Procesando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
