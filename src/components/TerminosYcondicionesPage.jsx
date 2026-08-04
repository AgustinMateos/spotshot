import React from 'react';

export default function TerminosYCondicionesPage  () {
  return (
    <div className="mx-auto mt-10 px-6 py-12 bg-white text-gray-800 leading-relaxed ">
      <h1 className="text-4xl font-bold mb-2">Términos y Condiciones del marketplace</h1>
      <p className="text-gray-500 mb-2">spotshot.app</p>
      <p className="text-gray-500 mb-10">Última actualización: julio de 2026</p>

      {/* PARTE I */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">PARTE I · Disposiciones generales (ambas audiencias)</h2>

        {/* 1. Identificación y objeto */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">1. Identificación y objeto</h3>
          <p className="mb-3">
            Los presentes Términos y Condiciones ("T&C") regulan el uso de la plataforma spotshot.app ("la Plataforma"),
            titularidad de D. Stefano Capra Vazquez y D.ª Camila Milagros Montanari (los "Titulares"; ver Aviso Legal), que
            permite a fotógrafos registrados ("Fotógrafos") publicar y ofrecer fotografías de surf, y a usuarios registrados
            ("Compradores") adquirir licencias de uso sobre ellas.
          </p>
          <p className="mb-3">
            La Plataforma actúa como intermediaria entre Fotógrafo y Comprador: el Fotógrafo es quien vende la
            fotografía al Comprador, y la Plataforma facilita la publicación y el cobro (a través de Stripe) percibiendo una
            comisión únicamente por cada venta efectiva. La Plataforma no vende en nombre propio ni adquiere la
            titularidad de las fotografías.
          </p>
        </div>

        {/* 2. Definiciones */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">2. Definiciones</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Fotografía:</strong> cada imagen fotográfica que un Fotógrafo publica y ofrece en la Plataforma.
            </li>
            <li>
              <strong>Licencia:</strong> la autorización de uso sobre una Fotografía que el Comprador adquiere en los términos de la
              cláusula 7, sin transferencia de la propiedad intelectual.
            </li>
            <li>
              <strong>Contenido:</strong> las Fotografías y cualquier otra información (títulos, descripciones, etiquetas) que los
              Fotógrafos publican en la Plataforma.
            </li>
            <li>
              <strong>Cuenta:</strong> el registro personal de cada usuario (Fotógrafo o Comprador) en la Plataforma, protegido por sus
              credenciales.
            </li>
          </ul>
        </div>

        {/* 3. Registro y cuenta */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">3. Registro y cuenta</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Edad mínima:</strong> 18 años, tanto para registrarse como Fotógrafo como para registrarse y comprar como
              Comprador. En el alta se recaba una declaración expresa de mayoría de edad mediante casilla no
              premarcada. La Plataforma podrá suspender o cancelar las cuentas cuya declaración resulte falsa.
            </li>
            <li>
              Los datos de registro deben ser veraces; cada usuario responde de la custodia de sus credenciales.
            </li>
            <li>
              La aceptación de estos T&C se realiza mediante casilla en el alta. Conforme a los arts. 23 y 24 LSSICE, el
              contrato celebrado por vía electrónica produce todos los efectos y su soporte electrónico es admisible
              como prueba documental. La Plataforma conserva registro de la aceptación (fecha, hora, versión).
            </li>
          </ul>
        </div>

        {/* 4. Información precontractual y confirmación */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">4. Información precontractual y confirmación (arts. 27 y 28 LSSICE)</h3>
          <p className="mb-3">
            Antes de contratar, la Plataforma pone a disposición: los trámites para celebrar el contrato, si se archivará el
            documento electrónico y si será accesible, los medios para corregir errores en los datos y la lengua de
            formalización, que es el español. Estos T&C pueden almacenarse y reproducirse (art. 27.4 LSSICE). Tras cada
            compra, el Comprador recibirá confirmación por correo electrónico en las 24 horas siguientes (art. 28.1.a
            LSSICE).
          </p>
        </div>

        {/* 5. Uso permitido de la Plataforma */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">5. Uso permitido de la Plataforma</h3>
          <p className="mb-3">
            El usuario se compromete a utilizar la Plataforma conforme a la ley, a estos T&C y a la buena fe. En particular,
            queda prohibido:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Subir, publicar o difundir contenidos ilícitos, lesivos de derechos de terceros (propiedad intelectual,
              imagen, intimidad, honor) o contrarios a estos T&C.
            </li>
            <li>
              Realizar extracciones masivas o automatizadas de contenidos (scraping), reproducir el catálogo o
              construir servicios derivados a partir de él sin autorización.
            </li>
            <li>
              Eludir o manipular las medidas técnicas de protección de la Plataforma (marcas de agua, límites de
              descarga, controles de acceso).
            </li>
            <li>
              Suplantar la identidad de terceros, crear cuentas falsas o interferir en el funcionamiento normal de la
              Plataforma.
            </li>
          </ul>
          <p>
            El incumplimiento de esta cláusula faculta a la Plataforma para retirar los contenidos y suspender o cancelar
            la Cuenta, conforme a la cláusula 13.
          </p>
        </div>
      </section>

      {/* PARTE II */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">PARTE II · Condiciones para COMPRADORES</h2>

        {/* 6. Proceso de compra y precio */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">6. Proceso de compra y precio</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              Selección de fotografía → carrito → pago mediante Stripe. La Plataforma no almacena datos completos
              de tarjeta.
            </li>
            <li>
              Los precios se muestran en euros con los impuestos incluidos (IVA). Al tratarse de contenido digital, no
              hay gastos de envío.
            </li>
            <li>
              Factura/recibo: al ser el Fotógrafo el vendedor, la factura o recibo de la compra corresponde al Fotógrafo;
              la Plataforma factura al Fotógrafo su comisión.
            </li>
          </ul>
        </div>

        {/* 7. Licencia adquirida por el Comprador */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">7. Licencia adquirida por el Comprador</h3>
          <p className="mb-3">
            Al adquirir una Fotografía, el Comprador obtiene una licencia de uso personal y no comercial:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li>
              <strong>Alcance:</strong> reproducción y uso privado de la Fotografía, sin fines comerciales, sin sublicencia, cesión ni
              reventa. Quedan permitidas la impresión doméstica y la publicación en redes sociales personales,
              siempre sin ánimo de lucro ni explotación comercial.
            </li>
            <li>
              No se comercializan licencias comerciales por esta vía.
            </li>
            <li>
              La licencia no transfiere la propiedad intelectual de la obra, que conserva el Fotógrafo (arts. 14, 17 y 43 y
              ss. TRLPI). El Fotógrafo mantiene en todo caso sus derechos morales (art. 14 TRLPI).
            </li>
            <li>
              <strong>Restricciones en todo caso:</strong> no usos difamatorios o ilícitos; no usos que dañen la dignidad de las personas
              retratadas; no usos publicitarios o comerciales de la imagen de las personas retratadas, que requieren
              una legitimación adicional de la que esta licencia no dispone (art. 7.6 LO 1/1982).
            </li>
          </ul>
        </div>

        {/* 8. Entrega, desistimiento y reclamaciones */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">8. Entrega, desistimiento y reclamaciones</h3>
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li>
              <strong>Entrega:</strong> descarga digital inmediata tras el pago.
            </li>
            <li>
              <strong>Desistimiento (contenido digital sin soporte material).</strong> Con carácter general, el Comprador consumidor
              dispone de 14 días naturales para desistir (art. 102 TRLGDCU). No obstante, en el suministro de contenido
              digital de descarga inmediata el derecho de desistimiento no resulta aplicable cuando concurren las tres
              condiciones del art. 103.m TRLGDCU:
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>
                  el Comprador ha prestado su consentimiento previo expreso para iniciar la descarga durante el plazo de
                  desistimiento;
                </li>
                <li>
                  el Comprador ha reconocido que, al iniciarse la descarga, pierde su derecho de desistimiento; y
                </li>
                <li>
                  la Plataforma ha facilitado la confirmación del contrato en soporte duradero (email de confirmación de
                  la compra que reproduzca esas dos declaraciones), conforme a los arts. 98.7 TRLGDCU y 28 LSSICE.
                </li>
              </ol>
            </li>
          </ul>
          <p className="mb-3">
            A tal efecto, en el checkout figura una casilla no premarcada: «Solicito la ejecución/descarga inmediata y
            reconozco que, al iniciarse la descarga, pierdo mi derecho de desistimiento», y tras la compra se envía el email
            de confirmación con esa constancia. Sin ambos elementos, el Comprador conserva los 14 días de
            desistimiento.
          </p>
          <p>
            <strong>Reclamaciones y soporte:</strong> puede dirigir cualquier reclamación o consulta a info@spotshot.app. La
            Plataforma responderá en el plazo máximo de un mes.
          </p>
        </div>
      </section>

      {/* PARTE III */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">PARTE III · Condiciones para FOTÓGRAFOS</h2>

        {/* 9. Alta y relación con la Plataforma */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">9. Alta y relación con la Plataforma</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              El Fotógrafo se da de alta aceptando estos T&C mediante casilla en el registro. La aceptación comprende
              expresamente el Anexo I (Corresponsabilidad y condiciones de tratamiento, art. 26 RGPD), que forma
              parte integrante de estos T&C. El texto íntegro, Anexo incluido, es accesible y almacenable antes de
              aceptar (art. 27.4 LSSICE), y la Plataforma conserva registro de la identidad, fecha, hora y versión
              aceptada (arts. 23 y 24 LSSICE).
            </li>
            <li>
              La relación Fotógrafo–Plataforma no es laboral ni de agencia: el Fotógrafo actúa por cuenta propia. A
              título informativo, las obligaciones fiscales derivadas de su actividad (alta censal, IVA, IRPF) son
              responsabilidad exclusiva del Fotógrafo.
            </li>
          </ul>
        </div>

        {/* 10. Declaraciones y garantías del Fotógrafo */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">10. Declaraciones y garantías del Fotógrafo</h3>
          <p className="mb-3">
            El Fotógrafo declara y garantiza, respecto de cada Fotografía que suba:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              Que es autor de la Fotografía o titular de derechos suficientes para licenciarla.
            </li>
            <li>
              Que la Fotografía no vulnera derechos de terceros (propiedad intelectual, imagen, intimidad, marcas).
            </li>
            <li>
              Respecto de personas identificables que aparezcan en ella:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>a)</strong> cuando la persona sea el motivo principal de la Fotografía, que ha obtenido su consentimiento expreso
                  para la captación, reproducción, publicación y explotación comercial de su imagen a través de la Plataforma
                  (arts. 2.2 y 7.6 LO 1/1982; art. 6.1.a RGPD), mediante autorización de imagen o model release que cubra
                  específicamente esos fines (art. 6.2 LOPDGDD), y que conserva la evidencia de dicho consentimiento,
                  obligándose a aportarla a requerimiento de la Plataforma en un plazo de 72 horas. La Plataforma no exige el
                  depósito previo del model release: exige la declaración y esta obligación de conservación y aportación
                  (verificación razonable);
                </li>
                <li>
                  <strong>b)</strong> cuando la imagen de la persona sea meramente accesoria, o se trate de la cobertura de un evento
                  deportivo público con participación de personas de proyección pública, que concurre alguno de los
                  supuestos del art. 8.2 LO 1/1982 y que el uso no constituye explotación publicitaria o comercial de la imagen
                  de la persona en el sentido del art. 7.6 LO 1/1982;
                </li>
                <li>
                  <strong>c)</strong> que no ha captado la imagen en lugares o momentos de la vida privada de la persona (art. 7.5 LO 1/1982);
                </li>
                <li>
                  <strong>d)</strong> que el consentimiento del retratado es revocable (art. 2.3 LO 1/1982; art. 7.3 RGPD) y que, si la Plataforma
                  recibe una revocación u oposición, cooperará en la retirada de la Fotografía en el plazo máximo de 72 horas
                  fijado en el Anexo I, con ocultación cautelar inmediata por la Plataforma.
                </li>
              </ul>
            </li>
            <li>
              Respecto de menores identificables: que no subirá fotografías en las que aparezcan menores
              identificables. La Plataforma no admite este tipo de fotografías en ningún caso, ni siquiera con
              autorización de los representantes legales.
            </li>
            <li>
              Que indemnizará y mantendrá indemne a la Plataforma frente a reclamaciones, sanciones, daños y
              gastos (incluidos los de defensa jurídica razonables) que traigan causa del incumplimiento de las garantías
              de esta cláusula, en particular por falta de derechos sobre la Fotografía o de la legitimación necesaria
              sobre las personas identificables que aparezcan en ella. Esta indemnidad se limita a los daños directos
              efectivamente acreditados, con exclusión de los daños indirectos, y el Fotógrafo tendrá derecho a
              cooperar en la defensa frente a la reclamación. La indemnidad opera en la relación interna entre las
              partes y no limita los derechos de los interesados, que pueden dirigirse frente a cualquiera de ellas (art.
              26.3 RGPD).
            </li>
          </ol>
        </div>

        {/* 11. Licencia del Fotógrafo a la Plataforma */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">11. Licencia del Fotógrafo a la Plataforma</h3>
          <p className="mb-3">
            El Fotógrafo, que conserva la autoría y la titularidad de los derechos de explotación (arts. 14 y 17 TRLPI),
            concede a la Plataforma una licencia de carácter no exclusivo (art. 50 TRLPI) para alojar, reproducir, mostrar
            (incluidas miniaturas y marcas de agua), promocionar y comercializar la Fotografía a través de la Plataforma, y
            sublicenciarla a los Compradores en los términos de la cláusula 7. El carácter no exclusivo significa que el
            Fotógrafo puede seguir vendiendo o licenciando sus Fotografías por cualquier otro canal, dentro o fuera de
            internet, sin autorización de la Plataforma. La cesión se pacta expresamente mundial y por la duración de la
            publicación en la Plataforma; se hace constar el alcance de forma expresa porque, en silencio, el art. 43.2
            TRLPI limitaría la cesión a 5 años y al país de la cesión.
          </p>
          <p>
            La Plataforma podrá asimismo utilizar miniaturas o versiones con marca de agua de las Fotografías
            publicadas para promocionar el propio marketplace (redes sociales, portada y materiales de difusión), citando
            en todo caso al Fotógrafo como autor. El Fotógrafo puede oponerse a este uso promocional en cualquier
            momento comunicándolo a la Plataforma, sin que ello afecte al resto de la licencia.
          </p>
        </div>

        {/* 12. Retribución del Fotógrafo */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">12. Retribución del Fotógrafo</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              Por cada venta, el Fotógrafo percibe el importe de la Fotografía menos la comisión de la Plataforma, del
              20 % del precio de venta. Los pagos se canalizan a través de Stripe Connect, abonándose la parte del
              Fotógrafo en su cuenta de Stripe según los plazos de liquidación de dicho servicio, y la comisión a la
              Plataforma. La comisión de Stripe por transacción la asume la Plataforma.
            </li>
            <li>
              <strong>Impuestos:</strong> cada parte asume los suyos; el Fotógrafo es el único responsable de sus obligaciones fiscales y
              de facturación (alta censal, IVA, IRPF) derivadas de sus ventas.
            </li>
          </ul>
        </div>

        {/* 13. Retirada de contenidos y baja */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">13. Retirada de contenidos y baja</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              El Fotógrafo puede retirar sus Fotografías de la venta en cualquier momento. La retirada no afecta a las
              licencias ya vendidas, que se mantienen en sus términos.
            </li>
            <li>
              La Plataforma puede retirar contenidos que incumplan estos T&C o la ley, y suspender cuentas en caso de
              incumplimiento grave. Toda retirada o suspensión se acompañará de una declaración de motivos
              (hechos, fundamento contractual o legal y vías de reclamación disponibles) conforme al art. 17 del
              Reglamento (UE) 2022/2065 (DSA).
            </li>
          </ul>
        </div>
      </section>

      {/* PARTE IV */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">PARTE IV · Disposiciones comunes finales</h2>

        {/* 14. Contenidos de terceros y régimen de responsabilidad */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">14. Contenidos de terceros y régimen de responsabilidad (art. 16 LSSICE)</h3>
          <p className="mb-3">
            La Plataforma aloja contenidos proporcionados por los Fotógrafos. No será responsable de la información
            almacenada si no tiene conocimiento efectivo de su ilicitud o, teniéndolo, actúa con diligencia para retirarla o
            imposibilitar el acceso (art. 16 LSSICE).
          </p>
          <p>
            <strong>Notificación y retirada:</strong> cualquier persona puede notificar contenidos presuntamente ilícitos o lesivos,
            identificando el contenido y el derecho afectado: si afectan a su propia imagen o a sus datos personales, a
            privacidad@spotshot.app (o mediante el formulario de retirada de la web); en los demás casos (por ejemplo,
            propiedad intelectual), a info@spotshot.app. La Plataforma podrá ocultar cautelarmente el contenido
            mientras tramita la notificación.
          </p>
        </div>

        {/* 15. Comunicaciones comerciales */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">15. Comunicaciones comerciales</h3>
          <p>
            Solo se enviarán con consentimiento previo o al amparo del art. 21.2 LSSICE (clientes, servicios similares), con
            posibilidad de baja sencilla y gratuita en cada envío.
          </p>
        </div>

        {/* 16. Modificación de los T&C */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">16. Modificación de los T&C</h3>
          <p>
            La Plataforma podrá modificar estos T&C notificándolo con 15 días naturales de antelación; los cambios no se
            aplican retroactivamente a compras ya realizadas. Para los usuarios registrados, los cambios se comunicarán
            mediante aviso en el siguiente inicio de sesión, en el que se recabará su aceptación de la nueva versión.
          </p>
        </div>

        {/* 17. Nulidad parcial, ley aplicable y fuero */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">17. Nulidad parcial, ley aplicable y fuero</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              La nulidad de una cláusula no afecta al resto.
            </li>
            <li>
              Ley española. Consumidores: fuero de su domicilio (los contratos electrónicos con consumidores se
              presumen celebrados en su residencia habitual, art. 29 LSSICE). Usuarios que no tengan la condición de
              consumidor (en particular, Fotógrafos profesionales): sumisión expresa a los juzgados y tribunales del
              domicilio de los Titulares (Santander), sin perjuicio de los fueros imperativos que resulten de aplicación.
            </li>
          </ul>
        </div>
      </section>

      {/* ANEXO I */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
          ANEXO I · Corresponsabilidad y condiciones de tratamiento (art. 26 RGPD)
        </h2>
        <p className="mb-6">
          Parte integrante de los Términos y Condiciones de Fotógrafo. Su aceptación se produce con la casilla única
          del registro (cláusula 9) y determina, de modo transparente y de mutuo acuerdo (art. 26.1 RGPD), las
          responsabilidades respectivas del Fotógrafo y de la Plataforma respecto del tratamiento de los datos
          personales de las personas identificables que aparecen en las Fotografías. La imagen de una persona
          identificable es un dato personal, y su publicación y venta constituyen un tratamiento sujeto al RGPD y,
          además, a la protección de la Ley Orgánica 1/1982, de protección civil del derecho al honor, a la intimidad
          personal y familiar y a la propia imagen.
        </p>

        {/* A.1 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.1. Estructura del tratamiento por fases</h3>
          <p className="mb-4">
            Las partes reconocen la siguiente distribución de posiciones:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Fase</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Posición</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Captación de la fotografía (previa e independiente de la Plataforma)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">El Fotógrafo es responsable único</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Publicación, oferta y venta en la Plataforma
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Fotógrafo y Plataforma son corresponsables (art. 26 RGPD)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Datos de cuenta de fotógrafos y compradores
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    La Plataforma es responsable única (Política de Privacidad)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Uso posterior de la fotografía por el comprador
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    El comprador es responsable de su propio uso
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* A.2 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.2. Fase de captación: responsabilidad exclusiva del Fotógrafo</h3>
          <p>
            El Fotógrafo capta las fotografías por su propia iniciativa, con sus propios medios y para sus propios fines, sin
            instrucción ni encargo de la Plataforma, y es responsable único (art. 4.7 RGPD) del tratamiento inherente a la
            captación. Las políticas de contenido de la Plataforma son requisitos de admisión, no instrucciones de
            captación. Las declaraciones y garantías del Fotógrafo sobre la legitimación (consentimiento expreso y model
            release cuando la persona es el motivo principal; supuestos del art. 8.2 LO 1/1982 en imagen accesoria o
            cobertura de eventos públicos; exclusión de la vida privada; prohibición absoluta de menores identificables)
            son las de la cláusula 10 de estos T&C, que forma unidad con este Anexo.
          </p>
        </div>

        {/* A.3 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.3. Fase de publicación y venta: reparto de la corresponsabilidad</h3>
          <p className="mb-4">
            En esta fase el Fotógrafo y la Plataforma determinan conjuntamente fines y medios y son corresponsables
            (art. 26.1 RGPD), sin que ello implique una responsabilidad equivalente. El reparto es el siguiente:
          </p>

          <p className="font-semibold mb-2">Corresponde al Fotógrafo (obligaciones sustantivas):</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>a)</strong> responder en exclusiva de la licitud de origen de cada Fotografía (A.2 y cláusula 10);
            </li>
            <li>
              <strong>b)</strong> obtener, conservar y aportar a requerimiento de la Plataforma, en un plazo máximo de 72 horas, la
              evidencia del consentimiento (model release);
            </li>
            <li>
              <strong>c)</strong> cooperar en la atención de los ejercicios de derechos y, en particular, retirar o consentir la retirada de la
              Fotografía cuando la persona retratada revoque su consentimiento (art. 2.3 LO 1/1982; art. 7.3 RGPD) o se
              oponga (art. 21 RGPD), en un plazo máximo de 72 horas desde la comunicación de la Plataforma;
            </li>
            <li>
              <strong>d)</strong> mantener actualizada la información facilitada a la Plataforma cuando afecte a los derechos de las personas
              retratadas.
            </li>
          </ul>

          <p className="font-semibold mb-2">Corresponde a la Plataforma (funciones de canal y ejecución técnica):</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>e)</strong> actuar como punto de contacto para las personas interesadas (art. 26.1 RGPD) a través de
              privacidad@spotshot.app, canalizando las solicitudes hacia el Fotógrafo cuando proceda;
            </li>
            <li>
              <strong>f)</strong> ejecutar la retirada técnica de contenidos, con ocultación cautelar inmediata de la imagen afectada
              mientras se resuelve la solicitud;
            </li>
            <li>
              <strong>g)</strong> cumplir el deber de información de los arts. 13 y 14 RGPD en la fase de publicación mediante la Política de
              Privacidad (incluida la vía del art. 14.5.b), y poner a disposición de los interesados los aspectos esenciales de
              este Anexo (art. 26.2 RGPD).
            </li>
          </ul>
        </div>

        {/* A.4 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.4. Derechos de los interesados frente a ambas partes</h3>
          <p>
            Este reparto es interno y no limita los derechos de las personas interesadas, que podrán ejercerlos frente a, y
            en contra de, cada una de las partes (art. 26.3 RGPD). Quien atienda una reclamación o indemnice
            conservará la acción de regreso frente a la otra parte conforme al reparto pactado (arts. 82.4 y 82.5 RGPD).
          </p>
        </div>

        {/* A.5 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.5. Reparto interno del riesgo e indemnidad</h3>
          <p>
            En la relación interna entre las partes, el Fotógrafo asume íntegramente las consecuencias económicas
            (sanciones, indemnizaciones, gastos, incluidos los de defensa jurídica razonables) que traigan causa del
            incumplimiento de sus declaraciones, garantías y obligaciones (A.2, A.3 y cláusula 10), conforme a la
            indemnidad de la cláusula 10.5 (limitada a daños directos efectivamente acreditados, con cooperación en la
            defensa). La Plataforma responde internamente solo de los daños causados por el incumplimiento de sus
            propias funciones del apartado A.3, letras e) a g).
          </p>
        </div>

        {/* A.6 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.6. Tratamientos excluidos</h3>
          <p>
            Los datos de cuenta del Fotógrafo y de los Compradores son responsabilidad exclusiva de la Plataforma y se
            rigen por la Política de Privacidad. El uso ulterior de la Fotografía por el Comprador es responsabilidad de este,
            dentro de los límites de su licencia (cláusula 7); la licencia no ampara usos que requieran legitimación
            adicional sobre la imagen de las personas retratadas (art. 7.6 LO 1/1982).
          </p>
        </div>

        {/* A.7 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">A.7. Duración</h3>
          <p>
            Este Anexo rige mientras la Cuenta del Fotógrafo permanezca activa. La baja no extingue las
            declaraciones, garantías, obligaciones de cooperación e indemnidad relativas a las Fotografías publicadas o
            vendidas durante su vigencia. Las licencias ya vendidas se mantienen conforme a sus términos.
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