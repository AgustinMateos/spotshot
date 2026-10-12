import ContactoPage from '@/components/ContactoPage'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contacto',
  description: '¿Tienes dudas o quieres subir tus sesiones como fotógrafo o escuela? Escríbenos.',
  path: '/sesiones/contacto',
});


const page = () => {
  return (
    <div className='pt-20'><ContactoPage/></div>
  )
}

export default page