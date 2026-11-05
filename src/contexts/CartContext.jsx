'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children, storageKey = 'spotshot-cart' }) {
  const [cart, setCart] = useState([]);
  // Evita guardar el carrito vacío inicial en localStorage antes de haberlo
  // cargado (pisaba el carrito guardado, sobre todo en dev con StrictMode).
  const [loaded, setLoaded] = useState(false);

  // Cargar carrito al iniciar. Se hace en un efecto (y no en el estado
  // inicial) porque localStorage no existe en el render del servidor.
  useEffect(() => {
    let savedCart = [];
    try {
      savedCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      savedCart = [];
    }
    /* eslint-disable react-hooks/set-state-in-effect -- sincronización inicial con localStorage */
    setCart(Array.isArray(savedCart) ? savedCart : []);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [storageKey]);

  // Guardar en localStorage (solo después de haber cargado)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey, loaded]);

  const buildCartItem = (image, session) => ({
    ...image,
    sessionId: session.id,
    sessionTitle: session.title,
    location: session.location || session.schoolName || 'Sesión',
    unitPrice: session.pricing?.unitPriceCustomer,
    billablePhotoCap: session.pricing?.billablePhotoCap ?? null,
    // Opcional: agrupa el tope de fotos facturables por algo distinto a la
    // sesión (ej. escuelas en búsqueda por selfie: por día).
    billingGroupKey: session.billingGroupKey ?? null,
  });

  const addToCart = (image, session) => {
    if (cart.some(item => item.id === image.id)) return;
    const item = buildCartItem(image, session);
    setCart(prev => (prev.some(i => i.id === item.id) ? prev : [...prev, item]));
  };

  // entries: [{ image, session }]. Ignora las que ya están en el carrito.
  const addManyToCart = (entries) => {
    setCart(prev => {
      const ids = new Set(prev.map(i => i.id));
      const toAdd = [];
      for (const { image, session } of entries) {
        if (ids.has(image.id)) continue;
        ids.add(image.id);
        toAdd.push(buildCartItem(image, session));
      }
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
  };

  const removeFromCart = (imageId) => {
    setCart(prev => prev.filter(item => item.id !== imageId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, addManyToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);