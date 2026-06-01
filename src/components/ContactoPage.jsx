'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí luego conectarías con tu backend
    console.log('Datos del formulario:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* LADO IZQUIERDO - Marketing */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between p-5 md:p-0 md:pl-20 md:pt-20">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Estamos aquí para ayudarte
          </h1>
          <p className="mt-6 w-[85%] text-xl text-gray-600">
            ¿Tenés alguna duda sobre SpotShot? ¿Querés ser fotógrafo? 
            Contactanos y te responderemos lo antes posible.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4 text-gray-700">
              <img src="/icons/check.svg" alt="check" className="w-6 h-6 mt-1 shrink-0" />
              <span>Respuesta en menos de 24 horas</span>
            </li>
            <li className="flex items-start gap-4 text-gray-700">
              <img src="/icons/check.svg" alt="check" className="w-6 h-6 mt-1 shrink-0" />
              <span>Soporte dedicado para fotógrafos</span>
            </li>
            <li className="flex items-start gap-4 text-gray-700">
              <img src="/icons/check.svg" alt="check" className="w-6 h-6 mt-1 shrink-0" />
              <span>Colaboraciones y partnerships</span>
            </li>
          </ul>
        </div>

        {/* Imagen decorativa */}
        <div className="mt-12 md:mt-0 w-full">
          <img
            src="/fondo.svg"
            alt="surf"
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* LADO DERECHO - Formulario */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-10 ">
        <div className="w-full max-w-md">
        

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-3xl text-center">
              <p className="text-xl font-medium">¡Mensaje enviado con éxito!</p>
              <p className="mt-2">Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 p-6 mt-10 rounded-[10px]">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-gray-900"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-gray-900"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Asunto</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-gray-900"
                >
                  <option value="">Seleccioná un motivo</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="fotografo">Quiero ser fotógrafo</option>
                  <option value="surfista">Soy surfista y tengo dudas</option>
                  <option value="colaboracion">Colaboraciones / Partnerships</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-gray-300 rounded-3xl px-4 py-3 focus:outline-none focus:border-gray-900 resize-y"
                  placeholder="Escribí tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3.5 rounded-2xl transition"
              >
                Enviar mensaje
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-500 mt-8">
            También podés escribirnos a <br />
            <a href="mailto:hola@spotshot.com" className="text-gray-700 hover:underline">
             infospotshot@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}