'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar datos al iniciar la app
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('photographer');

        if (savedToken) {
            setToken(savedToken);
        }
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('photographer');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);