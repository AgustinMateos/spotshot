import SesionDetail from '@/components/SesionDetail'
import React from 'react'
import { API_URL, pageMeta } from '@/lib/seo'

async function getSession(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/public/photo-sessions/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const formatDate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const session = await getSession(id);

  if (!session) {
    return { title: 'Sesión no encontrada', robots: { index: false, follow: true } };
  }

  const place = session.location || session.schoolName || '';
  const date = session.sessionDate ? formatDate(session.sessionDate) : '';
  const title = `Fotos de surf${place ? ` en ${place}` : ''}${date ? ` · ${date}` : ''}`;

  const description = [
    `Fotos de surf${place ? ` en ${place}` : ''}${date ? ` del ${date}` : ''}.`,
    session.photoCount ? `${session.photoCount} fotos disponibles.` : '',
    'Encuentra las tuyas y descárgalas en alta calidad en SpotShot.',
  ].filter(Boolean).join(' ');

  const cover = session.images?.[0]?.publicUrl;

  return pageMeta({
    title,
    description,
    path: `/sesiones/${id}`,
    ...(cover && { images: [{ url: cover, alt: title }] }),
  });
}

const page = () => {
  return (
    <div className='pt-16'><SesionDetail/></div>
  )
}

export default page
