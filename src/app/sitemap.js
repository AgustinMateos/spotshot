import { API_URL, SITE_URL, slugify } from '@/lib/seo';
import { escuelas } from '@/lib/constants/surfData';

// Se regenera cada hora para incluir las sesiones nuevas
export const revalidate = 3600;

const MAX_PAGES = 50;

async function getPublicSessions() {
  const sessions = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(`${API_URL}/api/v1/public/photo-sessions?page=${page}`, {
        next: { revalidate },
      });
      if (!res.ok) break;

      const data = await res.json();
      sessions.push(...(data.items || []));
      if (!data.hasNextPage) break;
    }
  } catch (err) {
    console.error('sitemap: error cargando sesiones', err);
  }

  return sessions;
}

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/sesiones', changeFrequency: 'daily', priority: 0.9 },
    { path: '/sesiones/buscar/free-surfers', changeFrequency: 'daily', priority: 0.8 },
    { path: '/sesiones/buscar/escuelas', changeFrequency: 'daily', priority: 0.8 },
    { path: '/escuelaCantabraDeSurf', changeFrequency: 'daily', priority: 0.7 },
    { path: '/register', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/faqs', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/sesiones/contacto', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terminos-y-condiciones', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/politica-de-privacidad', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/politica-de-cookies', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/avisoLegal', changeFrequency: 'yearly', priority: 0.2 },
  ].map(({ path, ...rest }) => ({ url: `${SITE_URL}${path}`, lastModified: now, ...rest }));

  const schoolRoutes = escuelas.map((escuela) => ({
    url: `${SITE_URL}/sesiones/buscar/escuelas/${slugify(escuela.name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const sessions = await getPublicSessions();
  const sessionRoutes = sessions
    .filter((s) => s.id)
    .map((s) => ({
      url: `${SITE_URL}/sesiones/${s.id}`,
      lastModified: s.sessionDate ? new Date(s.sessionDate) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...schoolRoutes, ...sessionRoutes];
}
