// components/CustomDatePicker.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

// Convierte 'YYYY-MM-DD' a Date local (evita corrimiento de zona horaria)
const parseLocalDate = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplay = (str) => {
  if (!str) return null;
  const date = parseLocalDate(str);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

/**
 * CustomDatePicker
 * @param {string} value - fecha en formato 'YYYY-MM-DD'
 * @param {function} onChange - recibe la fecha en formato 'YYYY-MM-DD'
 * @param {string} placeholder
 * @param {string} minDate - 'YYYY-MM-DD' opcional
 * @param {string} maxDate - 'YYYY-MM-DD' opcional
 * @param {string} className - clases extra para el contenedor del input
 */
export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  minDate,
  maxDate,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseLocalDate(value) || new Date());
  const ref = useRef(null);

  useEffect(() => {
    if (value) setViewDate(parseLocalDate(value));
  }, [value]);

 useEffect(() => {
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };
  document.addEventListener('click', handleClickOutside, true);
  return () => document.removeEventListener('click', handleClickOutside, true);
}, []);

  const min = minDate ? parseLocalDate(minDate) : null;
  const max = maxDate ? parseLocalDate(maxDate) : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  // Lunes = 0 ... Domingo = 6
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isDisabled = (date) => {
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const isSelected = (date) => value && formatDate(date) === value;

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const goToMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const selectDay = (date) => {
    if (isDisabled(date)) return;
    onChange(formatDate(date));
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-gray-400 transition"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplay(value) || placeholder}
        </span>
        <Image src="/icons/calendario.svg" width={18} height={18} alt="calendario" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl right-[-20px] p-5 w-72">
        
          {/* Header mes/año */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-600"
            >
              ‹
            </button>
            <span className="font-medium text-[#0D2744]">
              {MESES[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-600"
            >
              ›
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;

              const disabled = isDisabled(date);
              const selected = isSelected(date);
              const today = isToday(date);

              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  disabled={disabled}
                  onClick={() => selectDay(date)}
                  className={`h-9 w-9 rounded-full text-sm flex items-center justify-center transition cursor-pointer pointer-events-auto
                    ${disabled ? 'text-gray-300 cursor-not-allowed pointer-events-none' : 'hover:bg-blue-50 text-gray-700'}
                    ${selected ? 'bg-[#0D2744] text-white hover:bg-[#0D2744]' : ''}
                    ${today && !selected ? 'border border-[#0D2744] text-[#0D2744] font-medium' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="flex-1 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer text-sm"
            >
              Limpiar
            </button>
            {/* <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 bg-[#0D2744] text-white rounded-xl hover:bg-[#0a1f35] cursor-pointer text-sm"
            >
              Aplicar
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}