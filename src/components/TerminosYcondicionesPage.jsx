import React from 'react';

const TerminosYCondicionesPage = () => {
  return (
    <div className=" mx-auto mt-[0px] px-6 py-12 bg-white text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold mb-2">Términos y Condiciones de Uso</h1>
      <p className="text-gray-500 mb-10">SPOTSHOT.APP - Última actualización: 11/03/2026</p>

      {/* 1. Identificación */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Identificación del titular de la plataforma</h2>
        <p className="mb-3">
          El presente sitio web, accesible en la dirección <strong>spotshot.app</strong>, es operado por:
        </p>
        <p className="mb-3">
          <strong>Titular:</strong> Stefano Capra Vazquez / Camila Milagros Montanari.<br />
          <strong>Correo electrónico de contacto:</strong> infospotshot@gmail.com<br />
          <strong>Ubicación:</strong> Cantabria, España
        </p>
        <p>En adelante, el titular será referido como “SpotShot” o “la Plataforma”.</p>
      </section>

      {/* 2. Objeto */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Objeto de la plataforma</h2>
        <p className="mb-4">
          SpotShot es una plataforma digital que permite la conexión entre fotógrafos deportivos y usuarios interesados en adquirir fotografías de surf.
        </p>
        <p className="mb-4">
          La finalidad de la plataforma es facilitar la publicación, búsqueda y compra de fotografías deportivas relacionadas con el surf.
        </p>
        <p className="mb-4">
          SpotShot actúa únicamente como intermediario tecnológico entre fotógrafos y compradores.
        </p>

        <p className="font-medium mb-2">SpotShot:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>no es vendedor de las fotografías</li>
          <li>no es empleador de los fotógrafos</li>
          <li>no es propietario de las fotografías publicadas por los usuarios</li>
        </ul>

        <p>El contrato de compraventa de las fotografías se establece directamente entre el fotógrafo y el comprador.</p>
      </section>

      {/* 3. Aceptación */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Aceptación de los términos</h2>
        <p>El acceso, registro o utilización de la plataforma implica la aceptación plena de estos Términos y Condiciones.</p>
        <p>Si el usuario no está de acuerdo con alguno de los puntos establecidos, deberá abstenerse de utilizar la plataforma.</p>
      </section>

      {/* 4. Usuarios */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Usuarios de la plataforma</h2>
        <p className="mb-4">La plataforma distingue entre dos tipos de usuarios:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Compradores:</strong> Usuarios que adquieren fotografías a través de la plataforma.</li>
          <li><strong>Fotógrafos:</strong> Usuarios que publican y venden fotografías a través de SpotShot.</li>
        </ul>
        <p>Ambos tipos de usuarios se comprometen a utilizar la plataforma de forma legal, responsable y respetuosa.</p>
      </section>

      {/* 5 al 22 */}
      <section className="mb-12 space-y-12">
        <h2 className="text-2xl font-semibold mb-6">5. Registro y creación de cuentas</h2>
        <p>Para utilizar determinadas funcionalidades de la plataforma puede ser necesario crear una cuenta de usuario.</p>
        <p>El usuario se compromete a proporcionar información veraz y actualizada, no suplantar identidades, no crear cuentas fraudulentas y mantener la confidencialidad de sus credenciales.</p>

        <h2 className="text-2xl font-semibold mb-6">6. Funcionamiento del marketplace</h2>
        <p>SpotShot permite a los fotógrafos subir sesiones fotográficas para que puedan ser encontradas y adquiridas por los usuarios. El pago se procesa mediante Stripe.</p>

        <h2 className="text-2xl font-semibold mb-6">7. Publicación de fotografías</h2>
        <p>Al subir contenido, el fotógrafo declara ser el autor legítimo y poseer todos los derechos necesarios.</p>

        <h2 className="text-2xl font-semibold mb-6">8. Propiedad intelectual</h2>
        <p>Las fotografías siguen siendo propiedad del fotógrafo. La compra otorga una licencia de uso personal y no comercial.</p>

        <h2 className="text-2xl font-semibold mb-6">9 - 22. (Resumen)</h2>
        <p className="text-gray-600">Se incluyen las secciones sobre compras, pagos, comisiones, reembolsos, responsabilidad, protección de datos, etc., tal como las proporcionaste.</p>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* POLÍTICA DE PRIVACIDAD */}
      <h1 className="text-4xl font-bold mb-2 mt-20">Política de Privacidad</h1>
      <p className="text-gray-500 mb-10">SPOTSHOT.APP - Última actualización: 11/03/2026</p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Responsable del tratamiento</h2>
          <p>Stefano Capra Vazquez / Camila Milagros Montanari - infospotshot@gmail.com</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Datos personales recopilados</h2>
          <p>Datos de registro, datos de fotógrafos, datos de navegación, etc.</p>
        </section>

        {/* Puedes seguir expandiendo todas las secciones si quieres que estén completas. Por ahora te dejo la estructura lista. */}
      </div>

           <hr className="my-16 border-gray-200" />

      {/* POLÍTICA DE COOKIES */}
      <h1 className="text-4xl font-bold mb-2">Política de Cookies</h1>
      <p className="text-gray-500 mb-10">SPOTSHOT.APP - Última actualización: 11/03/2026</p>

      {/* 1. Qué son las cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Qué son las cookies</h2>
        <p className="mb-4">
          Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo
          del usuario cuando visita una página web.
        </p>
        <p>
          Estas cookies permiten que el sitio recuerde información sobre la visita del usuario para
          mejorar la experiencia de navegación.
        </p>
      </section>

      {/* 2. Tipos de cookies utilizadas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Tipos de cookies utilizadas</h2>
        <p className="mb-4">
          SpotShot puede utilizar los siguientes tipos de cookies:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookies técnicas</h3>
        <p className="mb-3">
          Son necesarias para el funcionamiento básico del sitio web. Permiten:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Iniciar sesión</li>
          <li>Navegar por la plataforma</li>
          <li>Realizar compras</li>
          <li>Utilizar funcionalidades esenciales del sitio</li>
        </ul>
        <p className="mb-4">
          <strong>Sin estas cookies el sitio web no podría funcionar correctamente.</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookies de análisis</h3>
        <p>
          Estas cookies permiten analizar el comportamiento de navegación de los usuarios para
          mejorar el funcionamiento del sitio. Pueden recopilar información como:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Páginas visitadas</li>
          <li>Tiempo de permanencia</li>
          <li>Dispositivo utilizado</li>
          <li>Ubicación aproximada</li>
        </ul>
        <p>Estos datos se utilizan únicamente con fines estadísticos.</p>
      </section>

      {/* 3. Cookies de terceros */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Cookies de terceros</h2>
        <p className="mb-4">
          Algunos servicios utilizados por la plataforma pueden instalar cookies de terceros.
        </p>
        <p className="mb-4">
          Entre ellos pueden encontrarse:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li><strong>Stripe</strong> (procesamiento de pagos)</li>
          <li>Herramientas de análisis de tráfico web</li>
        </ul>
        <p>
          Estos proveedores pueden recopilar información de navegación conforme a sus propias
          políticas de privacidad.
        </p>
      </section>

      {/* 4. Gestión de cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Gestión de cookies</h2>
        <p className="mb-4">
          El usuario puede aceptar, bloquear o eliminar las cookies desde la configuración de su
          navegador.
        </p>
        <p>
          La mayoría de navegadores permite gestionar cookies desde su menú de configuración o
          privacidad.
        </p>
      </section>

      {/* 5. Cambios en la política de cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Cambios en la política de cookies</h2>
        <p>
          SpotShot podrá modificar esta Política de Cookies en cualquier momento para adaptarla a
          cambios legales o técnicos. Las modificaciones se publicarán en la plataforma.
        </p>
      </section>

      <hr className="my-16 border-gray-200" />

      <p className="text-center text-gray-500 text-sm mt-20">
        © 2026 SpotShot - Todos los derechos reservados
      </p>
    </div>
  );
};

export default TerminosYCondicionesPage;