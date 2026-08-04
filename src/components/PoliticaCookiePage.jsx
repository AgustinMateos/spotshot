import React from 'react';

const PoliticaCookiesPage = () => {
  return (
    <div className="mx-auto  px-6 py-12 bg-white text-gray-800 leading-relaxed mt-10 ">
      <h1 className="text-4xl font-bold mb-2">Política de Cookies + modelo de banner</h1>
      <p className="text-gray-500 mb-2">spotshot.app</p>
      <p className="text-gray-500 mb-10">Última actualización: julio de 2026</p>

      {/* PARTE A */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
          PARTE A · Política de Cookies
        </h2>

        {/* 1. Qué son las cookies */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">1. Qué son las cookies</h3>
          <p>
            Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas un sitio web. Junto a
            tecnologías similares (localStorage, píxeles, SDKs), permiten que el sitio funcione, recuerde tus preferencias o
            analice su uso.
          </p>
        </div>

        {/* 2. Marco legal */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">2. Marco legal</h3>
          <p>
            El art. 22.2 LSSICE permite utilizar dispositivos de almacenamiento y recuperación de datos en tu equipo solo
            si has dado tu consentimiento tras recibir información clara y completa sobre su uso. Quedan exceptuadas las
            cookies de índole técnica necesarias para prestar el servicio que has solicitado expresamente.
          </p>
        </div>

        {/* 3. Cookies que utiliza esta web */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">3. Cookies que utiliza esta web</h3>
          <p className="mb-4">
            A fecha de esta política, la web no incorpora rastreadores de terceros. La tabla siguiente se completará con el
            inventario definitivo cuando la web esté en producción y con el pago mediante Stripe activo (Stripe suele
            instalar cookies antifraude propias del proceso de pago):
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Cookie</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Titular</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Tipo</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Finalidad</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">[ej. session_id]</td>
                  <td className="border border-gray-300 px-3 py-2">Propia</td>
                  <td className="border border-gray-300 px-3 py-2">Técnica (exenta de consentimiento)</td>
                  <td className="border border-gray-300 px-3 py-2">Mantener la sesión iniciada</td>
                  <td className="border border-gray-300 px-3 py-2">Sesión</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">[ej. __stripe_mid]</td>
                  <td className="border border-gray-300 px-3 py-2">Stripe</td>
                  <td className="border border-gray-300 px-3 py-2">Técnica/antifraude del pago (a confirmar en el inventario)</td>
                  <td className="border border-gray-300 px-3 py-2">Prevención de fraude en pagos</td>
                  <td className="border border-gray-300 px-3 py-2">[al inventariar]</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">[analítica, si se añade]</td>
                  <td className="border border-gray-300 px-3 py-2">[según herramienta]</td>
                  <td className="border border-gray-300 px-3 py-2">Analítica (requiere consentimiento)</td>
                  <td className="border border-gray-300 px-3 py-2">Medición de uso</td>
                  <td className="border border-gray-300 px-3 py-2">[al inventariar]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Cómo aceptar, rechazar o revocar el consentimiento */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">4. Cómo aceptar, rechazar o revocar el consentimiento</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              En tu primera visita, el banner de cookies te permite aceptar, rechazar o configurar las cookies no
              esenciales.
            </li>
            <li>
              Puedes cambiar tu decisión en cualquier momento desde el enlace permanente "Gestionar cookies" del
              pie de página.
            </li>
            <li>
              También puedes eliminar o bloquear cookies desde la configuración de tu navegador (Chrome, Firefox,
              Safari o Edge).
            </li>
          </ul>
        </div>

        {/* 5. Transferencias internacionales y terceros */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">5. Transferencias internacionales y terceros</h3>
          <p>
            Si alguna cookie de tercero implica transferencia de datos fuera del EEE (p. ej., Stripe), se aplican las garantías
            descritas en la{' '}
            <a href="/politica-de-privacidad" className="text-blue-600 underline hover:text-blue-800">
              Política de Privacidad
            </a>
            , sección "Transferencias internacionales".
          </p>
        </div>

        {/* 6. Actualizaciones */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">6. Actualizaciones</h3>
          <p>
            Esta política se revisará cuando cambien las cookies utilizadas o el criterio de la AEPD.
          </p>
        </div>
      </section>

      <hr className="my-12 border-gray-200" />

   

     
      <p className="text-center text-gray-500 text-sm">
        Última actualización: julio de 2026
      </p>
     
    </div>
  );
};

export default PoliticaCookiesPage;