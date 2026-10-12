import SesionesPage from '@/components/SesionesPage'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Sesiones de surf recientes',
  description: 'Explora las últimas sesiones de surf fotografiadas en tu playa o escuela y encuentra tus fotos.',
  path: '/sesiones',
});



const page = () => {
  return (
    <div className='pt-20'>
     
      <SesionesPage/>
 
      </div>

  )
}

export default page