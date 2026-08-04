import React from 'react';

const PoliticaPrivacidadPage = () => {
  return (
    <div className="mx-auto mt-10 px-6 py-12 bg-white text-gray-800 leading-relaxed ">
      <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-gray-500 mb-2">spotshot.app</p>
      <p className="text-gray-500 mb-10">Última actualización: julio de 2026</p>

      {/* 1. Responsable del tratamiento */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Responsable del tratamiento</h2>
        <ul className="list-disc pl-6 space-y-3 mb-4">
          <li>
            <strong>Responsables (corresponsables del tratamiento, art. 26 RGPD):</strong> D. Stefano Capra Vazquez y D.ª Camila
            Milagros Montanari, que explotan conjuntamente spotshot.app y determinan de común acuerdo los fines
            y medios del tratamiento.
          </li>
          <li>
            <strong>NIF/NIE:</strong> 54881188Z (Stefano Capra Vazquez) · Y8122679-J (Camila Milagros Montanari).
          </li>
          <li>
            <strong>Domicilio:</strong> Calle Cabo Mayor 4, portal 3, piso ático F, 39140 Somo (Cantabria).
          </li>
          <li>
            <strong>Email de privacidad y punto de contacto único (art. 26.1 RGPD):</strong>{' '}
            <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              privacidad@spotshot.app
            </a>
            .
          </li>
          <li>
            <strong>Reparto de responsabilidades (art. 26.2 RGPD):</strong> los aspectos esenciales del acuerdo de
            corresponsabilidad entre ambos titulares son los siguientes: ambos deciden conjuntamente sobre las
            finalidades, los proveedores y el contenido de las políticas publicadas; la atención del ejercicio de
            derechos y de las solicitudes de retirada de imágenes la ejecuta operativamente D. Stefano Capra
            Vazquez; el punto de contacto único es privacidad@spotshot.app. En todo caso, puedes ejercer tus
            derechos frente a cualquiera de los dos corresponsables (art. 26.3 RGPD).
          </li>
        </ul>
        <p>
          No existe obligación de designar Delegado de Protección de Datos y no se ha designado.
        </p>
      </section>

      {/* 2. Qué datos tratamos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Qué datos tratamos</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Datos de cuenta (compradores):</strong> identificativos y de contacto, credenciales, historial de compras.
          </li>
          <li>
            <strong>Datos de cuenta (fotógrafos):</strong> identificativos y de contacto, credenciales, los datos fiscales
            imprescindibles para la facturación de la comisión de la Plataforma, y el catálogo de fotografías subidas.
            Los datos bancarios y de cobro de los fotógrafos los gestiona directamente Stripe (integración Stripe
            Connect).
          </li>
          <li>
            <strong>Datos de pago:</strong> gestionados por la pasarela Stripe (integración Stripe Connect); la Plataforma no
            almacena los números completos de tarjeta.
          </li>
          <li>
            <strong>Imágenes de terceros:</strong> las fotografías publicadas pueden contener la imagen de personas identificables
            que no son usuarias de la Plataforma (ver sección 5).
          </li>
          <li>
            <strong>Datos de navegación:</strong> ver{' '}
            <a href="/politica-de-cookies" className="text-blue-600 underline hover:text-blue-800">
              Política de Cookies
            </a>
            .
          </li>
        </ul>
      </section>

      {/* 3. Finalidades, bases jurídicas y plazos de conservación */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Finalidades, bases jurídicas y plazos de conservación</h2>
        <p className="mb-4">
          Conforme al art. 13.1.c) RGPD, cada finalidad se vincula a su base jurídica:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Finalidad</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Base jurídica (art. 6.1 RGPD)</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Conservación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">1</td>
                <td className="border border-gray-300 px-3 py-2">
                  Registro y gestión de la cuenta de usuario (comprador o fotógrafo)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.b): ejecución del contrato (Términos y Condiciones)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Mientras la cuenta esté activa + plazos de prescripción
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">2</td>
                <td className="border border-gray-300 px-3 py-2">
                  Gestión de compras, pagos a fotógrafos y facturación
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.b): ejecución del contrato; 6.1.c): obligaciones fiscales y contables
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Durante los plazos legales de prescripción fiscal y mercantil (con carácter general, 4 y 6 años respectivamente)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">3</td>
                <td className="border border-gray-300 px-3 py-2">
                  Publicación y comercialización de fotografías con imagen de personas identificables
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.a): consentimiento, recabado por el fotógrafo mediante model release, para la explotación comercial en que la persona es el motivo principal; 6.1.f): interés legítimo (ver sección 5) solo para imágenes accesorias o cobertura editorial de eventos públicos
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Mientras la fotografía esté publicada; ante revocación u oposición, ocultación inmediata y retirada en un máximo de 72 horas
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">4</td>
                <td className="border border-gray-300 px-3 py-2">
                  Atención de consultas (formulario de contacto)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.b): medidas precontractuales a petición del interesado, cuando la consulta se refiera a la contratación de nuestros servicios; 6.1.f): interés legítimo en atender la consulta, en los demás casos
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  El necesario para atender la consulta + prescripción
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">5</td>
                <td className="border border-gray-300 px-3 py-2">
                  Comunicaciones comerciales sobre servicios propios
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.a): consentimiento; a clientes existentes, art. 21.2 LSSICE (servicios similares, con oposición sencilla y gratuita en la recogida y en cada envío)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Hasta retirada del consentimiento u oposición
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">6</td>
                <td className="border border-gray-300 px-3 py-2">
                  Cumplimiento de obligaciones legales (requerimientos de autoridades, contabilidad)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.c): obligación legal
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Plazos legales
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">7</td>
                <td className="border border-gray-300 px-3 py-2">
                  Formulación, ejercicio o defensa de reclamaciones
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.f): interés legítimo
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Plazos de prescripción de las acciones
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">8</td>
                <td className="border border-gray-300 px-3 py-2">
                  Cookies y tecnologías análogas no esenciales
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  6.1.a): consentimiento (art. 22.2 LSSICE)
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  Ver Política de Cookies
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-3">
          Conforme al art. 6.3 LOPDGDD, la ejecución del contrato no se supedita a consentimientos para finalidades no
          relacionadas; los consentimientos para finalidades distintas se recogen de forma separada (art. 6.2
          LOPDGDD).
        </p>
        <p>
          <strong>Decisiones automatizadas y perfilado:</strong> no tomamos decisiones basadas únicamente en tratamientos
          automatizados que produzcan efectos jurídicos o te afecten significativamente (art. 22 RGPD), ni elaboramos
          perfiles.
        </p>
      </section>

      {/* 4. Menores de edad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Menores de edad</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            El registro y la compra en la Plataforma están reservados a mayores de 18 años (tanto para Fotógrafos
            como para Compradores).
          </li>
          <li>
            <strong>Mecanismo en el alta:</strong> declaración responsable de mayoría de edad mediante casilla no premarcada. Al
            no ser un servicio de riesgo para menores, no se implanta un sistema técnico de verificación de edad; la
            declaración responsable es una medida proporcionada al riesgo conforme al principio de
            responsabilidad proactiva (arts. 5.2 y 24 RGPD), y su registro sirve de evidencia. La declaración falsa
            faculta para suspender la cuenta.
          </li>
          <li>
            <strong>Menores que aparecen en fotografías:</strong> la Plataforma no admite fotografías en las que aparezcan
            menores identificables. Esta prohibición es absoluta: no se aceptan ni siquiera con autorización de sus
            representantes legales. Si detectas una fotografía con un menor identificable, comunícalo a{' '}
            <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              privacidad@spotshot.app
            </a>{' '}
            y la ocultaremos de inmediato.
          </li>
        </ul>
      </section>

      {/* 5. Fotografías con imagen de personas identificables */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Fotografías con imagen de personas identificables</h2>
        <p className="mb-4">
          La imagen de una persona identificable es un dato personal (art. 4.1 RGPD) y, además, está protegida por la
          Ley Orgánica 1/1982, de protección civil del derecho al honor, a la intimidad personal y familiar y a la propia
          imagen.
        </p>

        <h3 className="text-lg font-semibold mb-3">Base jurídica</h3>
        <p className="mb-3">
          Distinguimos según el uso de la fotografía:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            Cuando una persona identificable es el motivo principal de una fotografía que se comercializa, tratamos
            su imagen sobre la base de su consentimiento (art. 6.1.a RGPD y art. 2.2 LO 1/1982). Ese consentimiento
            lo recaba el fotógrafo en el momento de la captación (autorización de imagen o model release), y declara
            y garantiza haberlo obtenido para su publicación y venta en SpotShot. El consentimiento es revocable en
            cualquier momento (art. 2.3 LO 1/1982 y art. 7.3 RGPD).
          </li>
          <li>
            Cuando la imagen de una persona aparece de forma accesoria, o se trata de la cobertura de un evento
            deportivo público en el que participan personas con proyección pública, tratamos la imagen sobre la
            base de nuestro interés legítimo (art. 6.1.f RGPD) en documentar y difundir el deporte del surf y en
            explotar el archivo fotográfico, en los términos de los apartados a) y c) del art. 8.2 LO 1/1982, tras una
            valoración de ponderación documentada. En este caso puedes oponerte al tratamiento por motivos
            relacionados con tu situación particular (art. 21 RGPD).
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Cómo puedes solicitar la retirada</h3>
        <p className="mb-6">
          Si apareces en una fotografía y no deseas que se muestre o comercialice
          (retirando tu consentimiento u oponiéndote), utiliza el formulario de retirada de la web o escríbenos a{' '}
          <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
            privacidad@spotshot.app
          </a>{' '}
          indicando la fotografía. No necesitas justificar tu solicitud cuando revoques un
          consentimiento; atenderemos tu petición de forma prioritaria: la imagen quedará oculta de inmediato
          mientras la tramitamos y la retirada se completará en un plazo máximo de 72 horas.
        </p>

        <h3 className="text-lg font-semibold mb-3">Información a las personas retratadas (art. 14 RGPD)</h3>
        <p className="mb-6">
          Cuando las fotografías incluyen a personas que no son
          usuarias de SpotShot, sus datos (la imagen) no se obtienen directamente de ellas. Cuando el fotógrafo ha
          recabado su autorización, la persona ya ha sido informada en ese momento (art. 14.5.a RGPD). En los demás
          casos, informar individualmente a cada persona resulta imposible o supone un esfuerzo desproporcionado
          (art. 14.5.b RGPD), por lo que ofrecemos esta información de forma pública y habilitamos el canal de retirada
          anterior como medida de protección.
        </p>

        <h3 className="text-lg font-semibold mb-3">
          Garantías (aspectos esenciales de la corresponsabilidad con los fotógrafos, art. 26.2 RGPD)
        </h3>
        <p className="mb-3">
          SpotShot y el
          fotógrafo son corresponsables (art. 26 RGPD) de la publicación y venta de las fotografías, conforme al reparto
          recogido en el Anexo I de los Términos y Condiciones de Fotógrafo, cuyos aspectos esenciales se resumen
          aquí; SpotShot es el punto de contacto para ejercer tus derechos, sin perjuicio de que puedas dirigirte
          también al fotógrafo (art. 26.3 RGPD). Aplicamos estas garantías:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Canal de retirada y oposición gratuito y sin fricción, con ocultación cautelar inmediata de la imagen
            mientras se resuelve y retirada en un máximo de 72 horas.
          </li>
          <li>
            Prohibición a los fotógrafos de subir imágenes captadas en lugares o momentos de la vida privada (art.
            7.5 LO 1/1982) y prohibición absoluta de fotografías con menores identificables (ver sección 4).
          </li>
          <li>
            Declaración y garantía del fotógrafo en el alta sobre la obtención de los consentimientos necesarios y
            sobre la licitud de la captación, con obligación de conservar la evidencia y aportarla a requerimiento de
            SpotShot en un plazo de 72 horas (verificación razonable).
          </li>
          <li>
            Etiquetado que permite localizar y retirar imágenes por persona afectada.
          </li>
          <li>
            Exclusión de categorías especiales de datos (art. 9 RGPD): no tratamos las imágenes para revelar datos
            de salud, origen étnico, creencias u otras categorías especiales; si una imagen los revelara de forma
            manifiesta, aplicamos el protocolo de retirada.
          </li>
        </ul>
        <p>
          <strong>Punto de contacto único (art. 26.1 RGPD):</strong>{' '}
          <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
            privacidad@spotshot.app
          </a>
          .
        </p>
      </section>

      {/* 6. Destinatarios de los datos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Destinatarios de los datos</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Stripe</strong> (pasarela de pago, integración Stripe Connect): encargado del tratamiento o responsable
            independiente según el servicio concreto, conforme a su contrato de tratamiento de datos.
          </li>
          <li>
            <strong>Vercel</strong> (alojamiento e infraestructura de la web): encargado del tratamiento.
          </li>
          <li>
            <strong>Google Workspace</strong> (correo corporativo @spotshot.app): encargado del tratamiento.
          </li>
          <li>
            Sin herramientas de analítica de terceros a fecha de esta política.
          </li>
          <li>
            Administraciones públicas, jueces y tribunales, cuando exista obligación legal.
          </li>
          <li>
            <strong>Fotógrafos y compradores entre sí:</strong> en cada venta, el Fotógrafo ve (a través de su panel de Stripe) los
            datos que Stripe le muestra del pagador: nombre y correo electrónico, país de procedencia, forma de
            pago, y los cuatro últimos dígitos y la caducidad de la tarjeta (nunca el número completo). El Fotógrafo
            trata estos datos para gestionar la venta y sus obligaciones fiscales.
          </li>
        </ul>
      </section>

      {/* 7. Transferencias internacionales */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">7. Transferencias internacionales</h2>
        <p className="mb-3">
          El uso de Stripe puede implicar transferencias de datos a Stripe, LLC (EE. UU.). Dichas transferencias se
          amparan en las garantías del Capítulo V del RGPD:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-4">
          <li>
            <strong>Decisión de adecuación UE–EE. UU. (Data Privacy Framework):</strong> Decisión de Ejecución (UE) 2023/1795, en
            vigor (art. 45 RGPD). La pasarela de pago está adherida al Marco de Privacidad de Datos UE-EE. UU.
          </li>
          <li>
            <strong>Garantía alternativa:</strong> cláusulas contractuales tipo de la Decisión de Ejecución (UE) 2021/914 (art. 46.2.c
            RGPD), incorporadas en el contrato de encargo (DPA) de Stripe, que se aplican de forma acumulativa por
            si decayera la decisión de adecuación.
          </li>
          <li>
            El alojamiento en Vercel Inc. (EE. UU.) puede implicar transferencias internacionales; se amparan en las
            mismas garantías del Capítulo V: adhesión al Data Privacy Framework y, como respaldo, las cláusulas
            contractuales tipo (Decisión (UE) 2021/914) del DPA de Vercel.
          </li>
          <li>
            Google Workspace (Google Ireland Ltd. como contratante UE): transferencias a EE. UU. amparadas
            igualmente en el Data Privacy Framework y, como respaldo, en las cláusulas contractuales tipo, según su
            DPA estándar.
          </li>
        </ul>
      </section>

      {/* 8. Derechos de las personas interesadas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">8. Derechos de las personas interesadas</h2>
        <p className="mb-3">
          Cualquier persona (usuaria o no de la Plataforma, incluidas las personas que aparezcan en fotografías) puede
          ejercer los derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición
          (arts. 15 a 22 RGPD), así como retirar en cualquier momento el consentimiento prestado sin que ello afecte a
          la licitud del tratamiento previo (art. 7.3 RGPD):
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Por escrito a{' '}
            <a href="mailto:privacidad@spotshot.app" className="text-blue-600 underline hover:text-blue-800">
              privacidad@spotshot.app
            </a>
            , acompañando información que permita verificar su identidad.
          </li>
          <li>
            Plazo de respuesta: un mes, ampliable conforme al art. 12.3 RGPD.
          </li>
        </ul>
        <p>
          Asimismo, puede presentar una reclamación ante la Agencia Española de Protección de Datos (art. 77
          RGPD):{' '}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
            www.aepd.es
          </a>{' '}
          · Edificio Cuzco IV, Paseo de la Castellana, 141, 28046 Madrid.
        </p>
      </section>

      {/* 9. Seguridad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">9. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas apropiadas al riesgo (art. 32 RGPD), entre ellas el cifrado de las
          comunicaciones (HTTPS) y el control de accesos a los sistemas.
        </p>
      </section>

      {/* 10. Actualizaciones */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">10. Actualizaciones</h2>
        <p>
          Esta política puede actualizarse. La versión vigente estará siempre publicada en la Plataforma con su fecha.
        </p>
      </section>

      <hr className="my-12 border-gray-200" />

      <p className="text-center text-gray-500 text-sm">
        Última actualización: julio de 2026
      </p>
      
    </div>
  );
};

export default PoliticaPrivacidadPage;