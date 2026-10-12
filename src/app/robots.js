import { SITE_URL } from '@/lib/seo';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/shot/', '/purchase/', '/auth/', '/escuelaCantabraDeSurf/unsubscribe'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
