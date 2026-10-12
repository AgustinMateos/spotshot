import EscuelaCantabraDeSurfPage from '@/components/EscuelaCantabraDeSurf'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: { absolute: 'Fotos de tus clases | Escuela Cántabra de Surf' },
  description: 'Encuentra y descarga las fotos de tus clases con la Escuela Cántabra de Surf.',
  path: '/escuelaCantabraDeSurf',
});


const page = () => {
  return (
    <div><EscuelaCantabraDeSurfPage/></div>
  )
}

export default page