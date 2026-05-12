'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

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
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            updateUser,
            updateToken,     // ← Nuevo
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);