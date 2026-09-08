'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ChevronDown, Download, ExternalLink, X } from 'lucide-react';

const INITIAL_CONSENTS = {
  terms: false,
  adult: false,
  photosRights: false,
  marketing: false,
};

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [legalOpen, setLegalOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsReviewed, setTermsReviewed] = useState(false);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);

  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [consentToken, setConsentToken] = useState('');
  const [acceptingConsents, setAcceptingConsents] = useState(false);

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';

  const requiredOk = consents.terms && consents.adult && consents.photosRights;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const openTerms = () => {
    setTermsOpen(true);
    setTermsReviewed(true);
  };

  const toggleConsent = (key) => {
    if (key === 'terms' && !termsReviewed) {
      setError('Abrí los Términos y Condiciones y guardalos o descargalos antes de aceptarlos.');
      openTerms();
      return;
    }
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
    setError('');
  };

  const downloadTerms = async () => {
    setTermsReviewed(true);
    try {
      const res = await fetch('/terminos-y-condiciones');
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SpotShot-Terminos-y-Condiciones-julio-2026.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open('/terminos-y-condiciones', '_blank', 'noopener,noreferrer');
    }
  };

  const finishLogin = (data) => {
    if (data.access_token) {
      login(data.access_token, data.photographer);
    }
    setSuccess(data.message || 'Inicio de sesión exitoso');
    setTimeout(() => router.push('/shot'), 800);
  };

  const doLogin = async () => {
    const response = await fetch(`${API_URL}/api/v1/photographers/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { response, data };
  };

  const handleAcceptConsentsAndLogin = async () => {
    if (!requiredOk) {
      setError('Tenés que aceptar las casillas obligatorias.');
      return;
    }
    if (!consentToken) {
      setError('El token de consentimiento expiró. Intentá iniciar sesión de nuevo.');
      setConsentModalOpen(false);
      return;
    }

    setAcceptingConsents(true);
    setError('');

    try {
      const acceptRes = await fetch(`${API_URL}/api/v1/photographers/auth/accept-consents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentToken,
          acceptedTerms: consents.terms,
          acceptedMajorityAge: consents.adult,
          acceptedPhotoAuthorship: consents.photosRights,
          subscribeNewsletter: consents.marketing,
        }),
      });

      const acceptData = await acceptRes.json();

      if (!acceptRes.ok) {
        setError(acceptData.message || 'No se pudieron guardar los consentimientos.');
        return;
      }

      const { response, data } = await doLogin();

      if (response.ok) {
        setConsentModalOpen(false);
        setConsentToken('');
        finishLogin(data);
      } else if (response.status === 403 && data.code === 'CONSENT_REQUIRED') {
        setConsentToken(data.consent_token || '');
        setError('Todavía faltan consentimientos. Revisá las casillas e intentá de nuevo.');
      } else {
        setConsentModalOpen(false);
        setError(data.message || 'Consentimientos guardados, pero el login falló. Probá de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    } finally {
      setAcceptingConsents(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegister && !termsReviewed) {
      setError('Tenés que abrir y poder guardar los Términos y Condiciones antes de crear la cuenta.');
      openTerms();
      setLoading(false);
      return;
    }

    if (isRegister && !requiredOk) {
      setError('Tenés que aceptar las casillas obligatorias para crear la cuenta.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { response, data } = await doLogin();

        if (response.ok) {
          finishLogin(data);
        } else if (response.status === 403 && data.code === 'CONSENT_REQUIRED') {
          setConsentToken(data.consent_token || '');
          setConsents(INITIAL_CONSENTS);
          setConsentModalOpen(true);
          setError('');
        } else {
          setError(data.message || 'Ocurrió un error');
        }
      } else if (isRegister) {
        const response = await fetch(`${API_URL}/api/v1/photographers/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alias,
            email,
            password,
            acceptedTerms: consents.terms,
            acceptedMajorityAge: consents.adult,
            acceptedPhotoAuthorship: consents.photosRights,
            subscribeNewsletter: consents.marketing,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess(data.message || 'Cuenta creada. Revisa tu email para activarla.');
          setAlias('');
          setEmail('');
          setPassword('');
          setConsents(INITIAL_CONSENTS);
          setTermsReviewed(false);
          setTermsOpen(false);
        } else {
          setError(data.message || 'Ocurrió un error');
        }
      } else if (isForgot) {
        const response = await fetch(`${API_URL}/api/v1/photographers/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess(
            data.message ||
              'Si el email está registrado, te enviamos instrucciones para restablecer tu contraseña.'
          );
          setEmail('');
        } else {
          setError(data.message || 'Ocurrió un error');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 p-6 mt-10 rounded-[10px]">
      <h2 className="text-3xl font-bold text-black mb-2">
        {isLogin && 'Inicia sesión en Spotshot'}
        {isRegister && 'Crea tu cuenta de fotógrafo'}
        {isForgot && '¿Olvidaste tu contraseña?'}
      </h2>

      <p className="text-gray-600 mb-8">
        {isLogin && 'Bienvenido de nuevo'}
        {isRegister && 'Ingresa tus datos para crear tu cuenta de fotógrafo'}
        {isForgot && 'Ingresa tu correo electrónico y te enviaremos un enlace'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
              placeholder="Tu alias único"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900"
            placeholder="info@ejemplo.com"
            required
          />
        </div>

        {(isLogin || isRegister) && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border text-black border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 pr-12"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-11 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        )}

        {isRegister && (
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setLegalOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="text-sm font-semibold text-[#0D2744]">
                  Información básica sobre protección de datos
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-500 transition-transform ${
                    legalOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {legalOpen && (
                <div className="px-4 py-4 text-sm text-gray-600 leading-relaxed space-y-2 border-t border-gray-200 bg-white">
                  <p>
                    <span className="font-semibold text-gray-800">Responsable:</span> Stefano
                    Capra Vazquez y Camila Milagros Montanari (corresponsables, art. 26 RGPD) ·{' '}
                    <a href="mailto:privacidad@spotshot.app" className="text-[#0D2744] underline">
                      privacidad@spotshot.app
                    </a>
                    .
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Finalidad:</span> gestionar tu
                    alta y cuenta de fotógrafo, la publicación y venta de tus fotografías y el
                    cobro de tus ventas a través de Stripe.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Legitimación:</span> ejecución
                    del contrato; obligaciones legales aplicables.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Destinatarios:</span> Stripe
                    (pagos) y los proveedores indicados en la{' '}
                    <Link href="/politica-de-privacidad" className="text-[#0D2744] font-medium underline">
                      Política de Privacidad
                    </Link>
                    ; no se ceden datos a terceros salvo obligación legal.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Derechos:</span> acceso,
                    rectificación, supresión y demás derechos, como se explica en la{' '}
                    <Link href="/politica-de-privacidad" className="text-[#0D2744] font-medium underline">
                      Política de Privacidad
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#0D2744]/20 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setTermsOpen((v) => {
                    const next = !v;
                    if (next) setTermsReviewed(true);
                    return next;
                  });
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-[#0D2744]/5 hover:bg-[#0D2744]/10 transition"
              >
                <span className="text-sm font-semibold text-[#0D2744]">
                  Términos y Condiciones (texto íntegro, incluido Anexo I)
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-500 transition-transform ${
                    termsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {termsOpen && (
                <div className="border-t border-gray-200 bg-white">
                  <p className="px-4 pt-4 text-sm text-gray-600">
                    Podés leerlos acá, abrirlos en otra pestaña, descargarlos o imprimirlos /
                    guardarlos como PDF desde el navegador <strong>antes de aceptarlos</strong>.
                  </p>

                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={downloadTerms}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium text-[#0D2744] hover:bg-gray-50"
                    >
                      <Download size={16} />
                      Descargar
                    </button>
                    <Link
                      href="/terminos-y-condiciones"
                      target="_blank"
                      onClick={() => setTermsReviewed(true)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium text-[#0D2744] hover:bg-gray-50"
                    >
                      <ExternalLink size={16} />
                      Abrir en otra pestaña
                    </Link>
                  </div>

                  <div className="px-4 pb-4 text-sm text-gray-600">
                    El texto íntegro está en{' '}
                    <Link
                      href="/terminos-y-condiciones"
                      target="_blank"
                      className="text-[#0D2744] font-medium underline"
                      onClick={() => setTermsReviewed(true)}
                    >
                      /terminos-y-condiciones
                    </Link>
                    . Usá Descargar antes de aceptar.
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.terms}
                onChange={() => toggleConsent('terms')}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
              />
              <span className="text-sm text-gray-700">
                <span className="text-red-600 font-medium">(Obligatoria)</span> He leído y
                acepto los{' '}
                <Link
                  href="/terminos-y-condiciones"
                  className="text-[#0D2744] font-medium underline"
                  target="_blank"
                  onClick={() => setTermsReviewed(true)}
                >
                  Términos y Condiciones
                </Link>
                , incluido su Anexo I (Corresponsabilidad y condiciones de tratamiento).
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.adult}
                onChange={() => toggleConsent('adult')}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
              />
              <span className="text-sm text-gray-700">
                <span className="text-red-600 font-medium">(Obligatoria)</span> Declaro que soy
                mayor de 18 años y que los datos facilitados son ciertos. Soy consciente de que
                facilitar una edad falsa puede conllevar la suspensión o cancelación de mi
                cuenta.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.photosRights}
                onChange={() => toggleConsent('photosRights')}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
              />
              <span className="text-sm text-gray-700">
                <span className="text-red-600 font-medium">(Obligatoria)</span> Declaro que
                sobre las fotografías que suba: soy autor o titular de los derechos necesarios;
                que informaré y recabaré los consentimientos de las personas identificables que
                aparezcan en ellas conforme a las condiciones de la Plataforma; y que no subiré
                fotografías en las que aparezcan menores identificables (la Plataforma no las
                admite).
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.marketing}
                onChange={() => toggleConsent('marketing')}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
              />
              <span className="text-sm text-gray-700">
                <span className="text-gray-500 font-medium">(Opcional)</span> Quiero recibir
                comunicaciones sobre novedades y servicios de SpotShot.
              </span>
            </label>
          </div>
        )}

        {isLogin && (
          <div>
            <a href="/forgot-password" className="text-sm text-[#0D2744] hover:underline font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        {error && !consentModalOpen && (
          <p className="text-red-600 text-center bg-red-50 py-3 rounded-xl">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center bg-green-50 py-3 rounded-xl">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading || (isRegister && (!requiredOk || !termsReviewed))}
          className="w-full cursor-pointer transition-all active:scale-95 bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl text-lg disabled:opacity-70"
        >
          {loading
            ? 'Procesando...'
            : isRegister
              ? 'Crear cuenta'
              : isForgot
                ? 'Enviar enlace'
                : 'Iniciar sesión'}
        </button>
      </form>

      <p className="text-center mt-8 text-gray-600">
        {isLogin && (
          <>
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-[#0D2744] font-medium hover:underline">
              Crea una cuenta
            </a>
          </>
        )}
        {isRegister && (
          <>
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-[#0D2744] font-medium hover:underline">
              Inicia sesión
            </a>
          </>
        )}
        {isForgot && (
          <>
            ¿Recordaste tu contraseña?{' '}
            <a href="/login" className="text-[#0D2744] font-medium hover:underline">
              Inicia sesión
            </a>
          </>
        )}
      </p>

      {isLogin && consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !acceptingConsents && setConsentModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setConsentModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-semibold text-[#0D2744] pr-10">
              Aceptá las condiciones para entrar
            </h3>
            <p className="text-sm text-gray-600 mt-2 mb-5">
              Falta registrar los consentimientos obligatorios. Después vas a entrar automáticamente.
            </p>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.terms}
                  onChange={() => toggleConsent('terms')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-600 font-medium">(Obligatoria)</span> He leído y
                  acepto los{' '}
                  <Link
                    href="/terminos-y-condiciones"
                    className="text-[#0D2744] font-medium underline"
                    target="_blank"
                    onClick={() => setTermsReviewed(true)}
                  >
                    Términos y Condiciones
                  </Link>
                  , incluido su Anexo I (Corresponsabilidad y condiciones de tratamiento).
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.adult}
                  onChange={() => toggleConsent('adult')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-600 font-medium">(Obligatoria)</span> Declaro que soy
                  mayor de 18 años y que los datos facilitados son ciertos.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.photosRights}
                  onChange={() => toggleConsent('photosRights')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-600 font-medium">(Obligatoria)</span> Declaro la
                  autoría / derechos de las fotos y que no subiré menores identificables.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={() => toggleConsent('marketing')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D2744]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500 font-medium">(Opcional)</span> Quiero recibir
                  comunicaciones sobre novedades y servicios de SpotShot.
                </span>
              </label>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-xl mt-4">
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={acceptingConsents || !requiredOk}
              onClick={handleAcceptConsentsAndLogin}
              className="mt-6 w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl disabled:opacity-60"
            >
              {acceptingConsents ? 'Guardando y entrando...' : 'Aceptar y continuar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}