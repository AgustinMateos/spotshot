import React from 'react';

const AvisoLegal = () => {
  return (
    <div className="mx-auto  px-6 py-12 bg-white text-gray-800 leading-relaxed mt-10">
      <h1 className="text-4xl font-bold mb-2">Aviso Legal</h1>
      <p className="text-gray-500 mb-2">spotshot.app</p>
      <p className="text-gray-500 mb-10">Última actualización: julio de 2026</p>

      {/* 1. Identificación del titular */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Identificación del titular (art. 10.1 LSSICE)</h2>
        <p className="mb-4">
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la
          información y de comercio electrónico (LSSICE), se informa de que los titulares del sitio web spotshot.app (en
          adelante, "el Sitio Web" o "la Plataforma") son:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Titulares (corresponsables):</strong> D. Stefano Capra Vazquez y D.ª Camila Milagros Montanari, personas físicas
            que explotan conjuntamente la Plataforma (ver{' '}
            <a href="/politica-de-privacidad" className="text-blue-600 underline hover:text-blue-800">
              Política de Privacidad
            </a>{' '}
            y el acuerdo de corresponsabilidad del art. 26 RGPD).
          </li>
          <li>
            <strong>NIF/NIE:</strong> 54881188Z (Stefano Capra Vazquez) · Y8122679-J (Camila Milagros Montanari).
          </li>
          <li>
            <strong>Domicilio:</strong> Calle Cabo Mayor 4, portal 3, piso ático F, 39140 Somo (Cantabria).
          </li>
          <li>
            <strong>Correo electrónico:</strong>{' '}
            <a href="mailto:info@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              info@spotshot.app
            </a>
          </li>
        </ul>
      </section>

      {/* 2. Objeto del Sitio Web */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Objeto del Sitio Web</h2>
        <p>
          spotshot.app es una plataforma en línea (marketplace) que permite a fotógrafos registrados publicar y
          ofrecer a la venta fotografías de surf, y a los usuarios adquirir licencias sobre dichas fotografías. Las
          condiciones que rigen el uso de la Plataforma y la compraventa de fotografías se recogen en los{' '}
          <a href="/terminos-y-condiciones" className="text-blue-600 underline hover:text-blue-800">
            Términos y Condiciones
          </a>
          .
        </p>
      </section>

      {/* 3. Condiciones de uso */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Condiciones de uso</h2>
        <p className="mb-3">
          El acceso y navegación por el Sitio Web atribuye la condición de usuario e implica la aceptación de este Aviso
          Legal. El usuario se compromete a:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Hacer un uso lícito del Sitio Web, conforme a la ley, a este Aviso Legal y a los Términos y Condiciones.
          </li>
          <li>
            No realizar actividades que puedan dañar, sobrecargar o deteriorar la Plataforma o impedir su normal
            funcionamiento.
          </li>
          <li>
            No introducir ni difundir contenidos ilícitos, lesivos de derechos de terceros o contrarios a este Aviso
            Legal.
          </li>
        </ul>
      </section>

      {/* 4. Propiedad intelectual e industrial de la Plataforma */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Propiedad intelectual e industrial de la Plataforma</h2>
        <p className="mb-3">
          Los elementos que integran el Sitio Web (diseño, estructura, código fuente, textos, logotipos, marca
          "SpotShot" e imágenes propias de la Plataforma) son titularidad de los titulares del Sitio Web o de sus
          licenciantes, y están protegidos por la normativa de propiedad intelectual (texto refundido de la Ley de
          Propiedad Intelectual, Real Decreto Legislativo 1/1996, de 12 de abril) e industrial.
        </p>
        <p className="mb-3">
          Las fotografías publicadas por los fotógrafos no son titularidad de la Plataforma: su régimen de derechos y
          licencias se regula en los Términos y Condiciones (sección Fotógrafos).
        </p>
        <p>
          Queda prohibida la reproducción, distribución, comunicación pública o transformación de los contenidos del
          Sitio Web sin autorización del titular, salvo los usos legalmente permitidos.
        </p>
      </section>

      {/* 5. Precios */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Precios (art. 10.1.f LSSICE)</h2>
        <p>
          Los precios de las fotografías ofrecidas en la Plataforma se muestran en cada ficha de producto con los
          impuestos incluidos (IVA). No existen gastos de envío al tratarse exclusivamente de contenido digital (no se
          venden copias físicas).
        </p>
      </section>

      {/* 6. Contenidos alojados de terceros */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Contenidos alojados de terceros</h2>
        <p className="mb-3">
          La Plataforma actúa como prestador de servicios de intermediación que aloja contenidos (fotografías y datos)
          proporcionados por los fotógrafos registrados. Conforme al artículo 16 LSSICE, el titular no será responsable
          de la información almacenada a petición de los fotógrafos siempre que no tenga conocimiento efectivo de su
          ilicitud o, teniéndolo, actúe con diligencia para retirar los datos o imposibilitar el acceso a ellos.
        </p>
        <p className="mb-3">
          Si considera que algún contenido publicado en la Plataforma vulnera sus derechos, puede notificarlo
          identificando el contenido, el derecho afectado y su acreditación:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Si afecta a su propia imagen o a sus datos personales:{' '}
            <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              privacidad@spotshot.app
            </a>
            .
          </li>
          <li>
            En los demás casos (por ejemplo, propiedad intelectual):{' '}
            <a href="mailto:info@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              info@spotshot.app
            </a>
            .
          </li>
        </ul>
        <p>
          El procedimiento de retirada se desarrolla en los Términos y Condiciones, sección "Notificación y retirada de
          contenidos".
        </p>
      </section>

      {/* 7. Enlaces */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">7. Enlaces</h2>
        <p>
          El Sitio Web puede contener enlaces a sitios de terceros (por ejemplo, la pasarela de pago). El titular no
          asume responsabilidad por los contenidos o prácticas de dichos sitios.
        </p>
      </section>

      {/* 8. Protección de datos y cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">8. Protección de datos y cookies</h2>
        <p>
          El tratamiento de datos personales se rige por la{' '}
          <a href="/politica-de-privacidad" className="text-blue-600 underline hover:text-blue-800">
            Política de Privacidad
          </a>
          . El uso de cookies y tecnologías similares se rige por la{' '}
          <a href="/politica-de-cookies" className="text-blue-600 underline hover:text-blue-800">
            Política de Cookies
          </a>
          .
        </p>
      </section>

      {/* 9. Legislación aplicable y jurisdicción */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">9. Legislación aplicable y jurisdicción</h2>
        <p>
          Este Aviso Legal se rige por la legislación española. Para las controversias con usuarios que tengan la
          condición de consumidor será competente el juzgado del domicilio del consumidor. Para las controversias con
          usuarios que no tengan la condición de consumidor (en particular, fotógrafos profesionales), las partes se
          someten expresamente a los juzgados y tribunales del domicilio de los Titulares (Santander), sin perjuicio de
          los fueros imperativos que resulten de aplicación.
        </p>
      </section>

      <hr className="my-12 border-gray-200" />

      <p className="text-center text-gray-500 text-sm">
        Última actualización: julio de 2026
      </p>
      
    </div>
  );
};

export default AvisoLegal;