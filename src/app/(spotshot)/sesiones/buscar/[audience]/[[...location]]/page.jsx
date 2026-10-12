import DynamicSesionesPage from '@/components/DynamicSesionesPage'
import { pageMeta, unslugify } from '@/lib/seo'

import React from 'react'

const AUDIENCES = {
  'free-surfers': 'free surfers',
  escuelas: 'escuelas de surf',
};

export async function generateMetadata({ params }) {
  const { audience, location = [] } = await params;
  const audienceLabel = AUDIENCES[audience];
  const place = location.length ? unslugify(location.join('-')) : '';
  const path = `/sesiones/buscar/${audience}${location.length ? `/${location.join('/')}` : ''}`;

  if (!audienceLabel) {
    return { title: 'Sesiones de surf', robots: { index: false, follow: true } };
  }

  const placePrefix = audience === 'escuelas' ? 'de' : 'en';

  const title = place
    ? `Fotos de surf ${placePrefix} ${place}`
    : `Sesiones de surf para ${audienceLabel}`;

  const description = place
    ? `Encuentra tus fotos de surf ${placePrefix} ${place}. Sesiones recientes de ${audienceLabel}, listas para descargar en SpotShot.`
    : `Explora las sesiones de surf fotografiadas para ${audienceLabel} y encuentra tus fotos en segundos.`;

  return pageMeta({ title, description, path });
}

const page = () => {
  return (
    <div className='pt-20'><DynamicSesionesPage/></div>
  )
}

export default page
