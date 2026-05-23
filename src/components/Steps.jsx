// src/components/Steps.jsx
'use client';

import React from 'react';

const Steps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: 'Detalles', icon: '📋' },
    { number: 2, label: 'Fotos', icon: '📸' },
    { number: 3, label: 'Precios', icon: '💰' },
    { number: 4, label: 'Confirmación', icon: '✅' },
  ];

  return (
    <div className="flex justify-center mb-10">
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Paso */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-200
                    ${isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isActive 
                        ? 'bg-white border-blue-600 text-blue-600 shadow-md' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>

                <p className={`text-sm mt-3 font-medium transition-colors
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.label}
                </p>

                {/* Línea conectora */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-[calc(50%+24px)] w-full h-0.75 -z-10 transition-all
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} 
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;