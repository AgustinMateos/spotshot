'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
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
        router.replace('/login');   // ← Redirige automáticamente
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
                alert("Tu sesión ha expirado o el token es inválido.");
                logout();   // ← Expulsa al usuario
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
            handleAuthError   // ← Nueva función exportada
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);