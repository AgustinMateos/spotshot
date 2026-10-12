export const SITE_URL = 'https://www.spotshot.app';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Mismo slug que usa el Buscador para las URLs de /sesiones/buscar
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// "playa-de-somo" -> "Playa De Somo"
export const unslugify = (slug) =>
  decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const DEFAULT_OG_IMAGE = { url: '/inicio/somo1.webp', alt: 'Surf en la playa' };

// Metadata por página: título, descripción, canonical y Open Graph coherentes.
// (openGraph no se fusiona en profundidad con el del layout, por eso se repite aquí)
export const pageMeta = ({ title, description, path, images = [DEFAULT_OG_IMAGE], robots }) => {
  const socialTitle = typeof title === 'string' ? `${title} | SpotShot` : title.absolute;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: 'SpotShot',
      title: socialTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: images.map((img) => img.url ?? img),
    },
    ...(robots && { robots }),
  };
};

export const NOINDEX = { index: false, follow: false };
