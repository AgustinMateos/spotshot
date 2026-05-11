import React from 'react';

const TerminosYCondicionesPage = () => {
  return (
    <div className="max-w-7xl mt-[90px] mx-auto px-6 py-12 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-10">Términos y Condiciones</h1>

      {/* 1. Identificación del titular */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Identificación del titular de la plataforma</h2>
        <p className="mb-3">
          El presente sitio web, accesible en la dirección spotshot.app, es operado por:
        </p>
        <p className="mb-3">
          <strong>Titular:</strong> Stefano Capra Vazquez / Camila Milagros Montanari.<br />
          <strong>Correo electrónico de contacto:</strong> infospotshot@gmail.com<br />
          <strong>Ubicación:</strong> Cantabria, España
        </p>
        <p>
          En adelante, el titular será referido como “SpotShot” o “la Plataforma”
        </p>
      </section>

      {/* 2. Objeto de la plataforma */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Objeto de la plataforma</h2>
        <p className="mb-4">
          SpotShot es una plataforma digital que permite la conexión entre fotógrafos deportivos y
          usuarios interesados en adquirir fotografías de surf.
        </p>
        <p className="mb-4">
          La finalidad de la plataforma es facilitar la publicación, búsqueda y compra de fotografías
          deportivas relacionadas con el surf.
        </p>
        <p className="mb-4">
          SpotShot actúa únicamente como intermediario tecnológico entre fotógrafos y
          compradores.
        </p>

        <p className="font-medium mb-2">SpotShot:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>No es vendedor de las fotografías</li>
          <li>No es empleador de los fotógrafos</li>
          <li>No es propietario de las fotografías publicadas por los usuarios</li>
        </ul>

        <p>
          El contrato de compraventa de las fotografías se establece directamente entre el
          fotógrafo y el comprador.
        </p>
      </section>

      {/* 3. Aceptación de los términos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Aceptación de los términos</h2>
        <p className="mb-4">
          El acceso, registro o utilización de la plataforma implica la aceptación plena de estos
          Términos y Condiciones.
        </p>
        <p>
          Si el usuario no está de acuerdo con alguno de los puntos establecidos, deberá abstenerse
          de utilizar la plataforma.
        </p>
      </section>

      {/* 4. Usuarios de la plataforma
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Usuarios de la plataforma</h2>
        <p className="text-gray-600 italic">
          (Aquí puedes agregar el contenido de esta sección cuando lo tengas listo)
        </p>
      </section>

      <hr className="my-12 border-gray-200" />

      <p className="text-center text-gray-500 text-sm">
        © 2026 SpotShot - Todos los derechos reservados
      </p> */}
    </div>
  );
};

export default TerminosYCondicionesPage;