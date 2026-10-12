import AvisoLegal from '@/components/AvisoLegal'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Aviso legal',
  description: 'Aviso legal de SpotShot.',
  path: '/avisoLegal',
});


const page = () => {
  return (
    <div><AvisoLegal/></div>
  )
}

export default page