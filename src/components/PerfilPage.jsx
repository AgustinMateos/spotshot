'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  const { user, token } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Estados para editar perfil
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');

  // Estados del modal de contraseña
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
  const [loadingStripe, setLoadingStripe] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAlias(user.alias || '');
    }
  }, [user]);

  // Guardar cambios del perfil
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
        setIsEditing(false);
      } else {
        setError(data.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoadingSave(false);
    }
  };

  // Cambiar contraseña
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
        setPasswordMessage('✅ Contraseña actualizada correctamente');
        setTimeout(() => {
          setShowPasswordModal(false);
          setOldPassword(''); setNewPassword(''); setConfirmNewPassword('');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setPasswordError('Error de conexión con el servidor');
    } finally {
      setLoadingPassword(false);
    }
  };

  // Conectar Stripe
  const handleConnectStripe = async () => {
    setLoadingStripe(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${API_URL}/api/v1/photographers/me/stripe/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Error al conectar con Stripe');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">Mi cuenta</h1>

      {/* Datos Personales */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Datos personales</h2>
          <button
            onClick={() => {
              if (isEditing) handleSaveProfile();
              else setIsEditing(true);
            }}
            disabled={loadingSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl hover:bg-black transition disabled:opacity-70"
          >
            {loadingSave ? 'Guardando...' : isEditing ? '💾 Guardar' : '✏️ Editar'}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 bg-amber-400 rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-800 border-4 border-white shadow">
            {initials}
          </div>
          <div>
            <p className="text-2xl font-semibold">{alias || 'Sin alias'}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Apodo</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              disabled={!isEditing}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50"
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50"
              placeholder="Ingresa tu apellido"
            />
          </div>
        </div>

        {message && <p className="text-green-600 mt-6 text-center font-medium">{message}</p>}
        {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
      </div>

      {/* Método de Cobro */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Método de cobro</h2>
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded">stripe</div>
            <div>
              <p className="font-medium">Stripe Connect</p>
              <p className="text-sm text-red-600">• No conectado</p>
              <p className="text-xs text-gray-500">Tus sesiones no pueden publicarse</p>
            </div>
          </div>
          <button 
            onClick={handleConnectStripe}
            disabled={loadingStripe}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition disabled:opacity-70"
          >
            {loadingStripe ? 'Conectando...' : 'Conectar cuenta →'}
          </button>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">Seguridad</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Contraseña</p>
            <p className="text-sm text-gray-500">Último cambio: hace poco</p>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition"
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