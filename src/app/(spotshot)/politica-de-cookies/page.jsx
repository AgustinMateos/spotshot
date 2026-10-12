import PoliticaCookiesPage from '@/components/PoliticaCookiePage'
import React from 'react'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Política de cookies',
  description: 'Información sobre las cookies que utiliza SpotShot.',
  path: '/politica-de-cookies',
});


const page = () => {
  return (
    <div><PoliticaCookiesPage/></div>
  )
}

export default page