'use client';

import { useState } from 'react';

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "¿Qué es SpotShot?",
        a: "SpotShot es una plataforma que conecta a surfistas con fotógrafos. Después de tu sesión, puedes encontrar tus fotos por playa y fecha, verlas y comprarlas en segundos."
      },
      {
        q: "¿Necesito registrarme para comprar?",
        a: "No. Puedes comprar y descargar tus fotos como invitado, sin crear una cuenta."
      },
      {
        q: "¿Cómo encuentro mis fotos?",
        a: "Puedes buscarlas por playa y fecha desde la página principal. Si hiciste una clase, también puedes buscarlas por escuela."
      },
      {
        q: "¿Qué pasa si no encuentro mi foto?",
        a: "Puede que el fotógrafo aún no haya subido la sesión o que no haya fotos tuyas ese día. Si tienes dudas, escríbenos a infospotshot@gmail.com y te ayudamos."
      },
      {
        q: "¿En qué calidad se descargan las imágenes?",
        a: "Las fotos se descargan en alta resolución, listas para redes sociales o impresión sin pérdida de calidad."
      },
      {
        q: "¿Es seguro pagar en SpotShot?",
        a: "Sí. Utilizamos Stripe, una de las plataformas de pago más seguras del mundo."
      }
    ]
  },
  {
    category: "Fotógrafos",
    questions: [
      {
        q: "¿Cómo puedo empezar a vender mis fotos?",
        a: "Solo tienes que registrarte y acceder a la sección “Vender mis fotos”. En pocos pasos podrás subir tus sesiones y empezar a vender."
      },
      {
        q: "¿Cuánto cuesta usar SpotShot?",
        a: "Publicar tus fotos es completamente gratis. Solo pagas una comisión cuando realizas una venta."
      },
      {
        q: "¿Cuánto gano por cada venta?",
        a: "Tú te quedas con el 80% del precio de cada foto. El 20% restante cubre la plataforma, pagos y gestión."
      },
      {
        q: "¿Quién fija el precio de las fotos?",
        a: "Tú decides el precio de tus fotos y packs."
      },
      {
        q: "¿Cuándo recibo mis pagos?",
        a: "Los pagos se gestionan a través de Stripe. Podrás recibir tu dinero directamente en tu cuenta según la configuración de tu cuenta de Stripe."
      }
    ]
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto mt-[40px] px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h1>
        <p className="text-xl text-gray-600">Todo lo que necesitas saber sobre SpotShot</p>
      </div>

      <div className="space-y-8">
        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-3">
              {section.category}
            </h2>

            <div className="space-y-4">
              {section.questions.map((faq, index) => {
                const globalIndex = `${sectionIndex}-${index}`;
                const isOpen = openIndex === globalIndex;

                return (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(globalIndex)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <span className="font-medium text-lg text-gray-900">{faq.q}</span>
                      <span className="text-2xl text-gray-400 transition-transform duration-300">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <p className="text-gray-600">¿No encontraste tu pregunta?</p>
        <a 
          href="mailto:infospotshot@gmail.com" 
          className="inline-block mt-3 bg-gray-900 text-white px-8 py-3.5 rounded-2xl hover:bg-black transition"
        >
          Escríbenos a infospotshot@gmail.com
        </a>
      </div>
    </div>
  );
}