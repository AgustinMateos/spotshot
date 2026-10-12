
import TerminosYcondicionesPage from '@/components/TerminosYcondicionesPage'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Términos y condiciones',
  description: 'Términos y condiciones de uso del marketplace de fotos de surf SpotShot.',
  path: '/terminos-y-condiciones',
});


const page = () => {
  return (
    <div className='pt-20'>
     
      <TerminosYcondicionesPage/></div>
  )
}

export default page