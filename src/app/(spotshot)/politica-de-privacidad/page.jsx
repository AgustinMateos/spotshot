import PoliticadePrivacidad from '@/components/PoliticadePrivacidad'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Política de privacidad',
  description: 'Cómo trata SpotShot tus datos personales.',
  path: '/politica-de-privacidad',
});


const page = () => {
  return (
    <div><PoliticadePrivacidad/></div>
  )
}

export default page