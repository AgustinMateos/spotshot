'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('spotshot-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('spotshot-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (image, session) => {
    if (cart.some(item => item.id === image.id)) return;

    const itemWithSession = {
      ...image,
      sessionId: session.id,
      sessionTitle: session.title,
      location: session.location || session.schoolName || 'Sesión',
    };

    setCart(prev => [...prev, itemWithSession]);
  };

  const removeFromCart = (imageId) => {
    setCart(prev => prev.filter(item => item.id !== imageId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);