'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false); // ← nuevo
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('photographer');

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));

        setLoading(false);
    }, []);

    const login = (access_token, photographer) => {
        localStorage.setItem('token', access_token);
        if (photographer) {
            localStorage.setItem('photographer', JSON.stringify(photographer));
            setUser(photographer);
        }
        setToken(access_token);
    };

    const updateUser = (newUserData) => {
        if (!newUserData) return;
        setUser(newUserData);
        localStorage.setItem('photographer', JSON.stringify(newUserData));
    };

    const updateToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('photographer');
        setToken(null);
        setUser(null);
        router.replace('/login');
    };

    // Se llama cuando el usuario confirma el modal
    const confirmSessionExpired = () => {
        setSessionExpired(false);
        logout();
    };

    // Función global para manejar errores de autenticación
    const handleAuthError = async (response) => {
        if (response.status === 401) {
            const errorData = await response.json().catch(() => ({}));

            const message = errorData.message || '';
            if (
                message.toLowerCase().includes('token inválido') ||
                message.toLowerCase().includes('token invalid') ||
                message.toLowerCase().includes('unauthorized')
            ) {
                setSessionExpired(true); // ← en lugar de alert()
                return true;
            }
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            updateUser,
            updateToken,
            loading,
            handleAuthError
        }}>
            {children}

            {sessionExpired && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 8,
                            padding: '24px 28px',
                            maxWidth: 360,
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3 style={{ marginBottom: 12 }}>Sesión expirada</h3>
                        <p style={{ marginBottom: 20, color: '#555' }}>
                            Tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente.
                        </p>
                        <button
                            onClick={confirmSessionExpired}
                            style={{
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 20px',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);